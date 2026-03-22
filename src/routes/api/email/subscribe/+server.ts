import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import { sendWelcomeEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request }) => {
	const { email, name } = await request.json();

	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'Valid email required' }, { status: 400 });
	}

	if (!supabaseAdmin) return json({ error: 'Database not configured' }, { status: 503 });

	const { error } = await supabaseAdmin
		.from('subscribers')
		.upsert(
			{ email: email.toLowerCase(), name: name || null, status: 'active' },
			{ onConflict: 'email', ignoreDuplicates: false }
		);

	if (error) return json({ error: 'Failed to subscribe' }, { status: 500 });

	sendWelcomeEmail(email, name).catch(() => {});

	return json({ success: true });
};
