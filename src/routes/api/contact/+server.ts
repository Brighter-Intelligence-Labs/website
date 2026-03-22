import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email';
import { AWS_SES_REPLY_TO } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, company, message } = await request.json();

	if (!name || !email || !message) {
		return json({ error: 'Name, email, and message are required' }, { status: 400 });
	}

	// Sanitize inputs for HTML
	const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	await sendEmail({
		to: AWS_SES_REPLY_TO,
		subject: `New contact form submission from ${esc(name)}`,
		html: `
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <p><strong>Company:</strong> ${esc(company || 'N/A')}</p>
      <p><strong>Message:</strong></p>
      <p>${esc(message).replace(/\n/g, '<br>')}</p>
    `,
		text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`
	});

	return json({ success: true });
};
