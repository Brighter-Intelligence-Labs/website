import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import {
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_REGION,
	AWS_SES_FROM_ADDRESS,
	AWS_SES_REPLY_TO
} from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import { supabaseAdmin } from './supabase';

const ses = new SESClient({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	}
});

/**
 * Send a single transactional email.
 */
export async function sendEmail(params: {
	to: string;
	subject: string;
	html: string;
	text: string;
}): Promise<void> {
	await ses.send(
		new SendEmailCommand({
			Source: AWS_SES_FROM_ADDRESS,
			ReplyToAddresses: [AWS_SES_REPLY_TO],
			Destination: { ToAddresses: [params.to] },
			Message: {
				Subject: { Data: params.subject, Charset: 'UTF-8' },
				Body: {
					Html: { Data: params.html, Charset: 'UTF-8' },
					Text: { Data: params.text, Charset: 'UTF-8' }
				}
			}
		})
	);
}

/**
 * Send a campaign to all active subscribers.
 */
export async function sendCampaign(campaignId: string): Promise<void> {
	if (!supabaseAdmin) throw new Error('Database not configured');

	const { data: campaign } = await supabaseAdmin
		.from('email_campaigns')
		.select('*')
		.eq('id', campaignId)
		.single();

	if (!campaign) throw new Error('Campaign not found');

	const { data: subscribers } = await supabaseAdmin
		.from('subscribers')
		.select('id, email, name')
		.eq('status', 'active');

	if (!subscribers?.length) {
		await supabaseAdmin
			.from('email_campaigns')
			.update({ status: 'sent', sent_at: new Date().toISOString() })
			.eq('id', campaignId);
		return;
	}

	await supabaseAdmin.from('email_campaigns').update({ status: 'sending' }).eq('id', campaignId);

	const BATCH_SIZE = 50;
	for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
		const batch = subscribers.slice(i, i + BATCH_SIZE);
		await Promise.all(
			batch.map(async (subscriber) => {
				const unsubUrl = `${PUBLIC_SITE_URL}/api/email/unsubscribe?id=${subscriber.id}`;
				const html = campaign.body_html.replace('{{unsubscribe_url}}', unsubUrl);
				const text = campaign.body_text.replace('{{unsubscribe_url}}', unsubUrl);

				try {
					await sendEmail({
						to: subscriber.email,
						subject: campaign.subject,
						html,
						text
					});

					await supabaseAdmin!.from('email_events').insert({
						campaign_id: campaignId,
						subscriber_id: subscriber.id,
						event_type: 'sent'
					});
				} catch {
					// Log failure but don't abort the whole campaign
				}
			})
		);
	}

	await supabaseAdmin!
		.from('email_campaigns')
		.update({ status: 'sent', sent_at: new Date().toISOString() })
		.eq('id', campaignId);
}

/**
 * Send a welcome email to a new subscriber.
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<void> {
	const greeting = name ? `Hi ${name},` : 'Hi there,';
	const html = `
    <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #c85a2a;">${greeting}</h2>
      <p>You're now subscribed to Brighter Intelligence Labs — practical insights on AI systems, agents, and building AI that actually works in production.</p>
      <p>We publish when we have something worth saying. Expect 1-2 emails per month.</p>
      <p style="margin-top: 2rem;">— Richard</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0;" />
      <p style="font-size: 0.8rem; color: #6b7280;">
        You subscribed at brighterintelligence.com.<br>
        <a href="{{unsubscribe_url}}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;
	const text = `${greeting}\n\nYou're now subscribed to Brighter Intelligence Labs.\n\nWe publish practical insights on AI systems and agents 1-2x per month.\n\n— Richard\n\nUnsubscribe: {{unsubscribe_url}}`;

	await sendEmail({ to: email, subject: 'Welcome to Brighter Intelligence Labs', html, text });
}
