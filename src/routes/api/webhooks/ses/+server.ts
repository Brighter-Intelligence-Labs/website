import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request }) => {
	if (!supabaseAdmin) return json({ error: 'Database not configured' }, { status: 503 });

	const body = await request.json();

	// Handle SNS subscription confirmation
	if (body.Type === 'SubscriptionConfirmation') {
		await fetch(body.SubscribeURL);
		return json({ ok: true });
	}

	if (body.Type !== 'Notification') return json({ ok: true });

	const message = JSON.parse(body.Message);
	const eventType = message.notificationType?.toLowerCase();

	if (!eventType) return json({ ok: true });

	const typeMap: Record<string, string> = {
		bounce: 'bounced',
		complaint: 'complained',
		delivery: 'delivered'
	};

	const mappedType = typeMap[eventType];
	if (!mappedType) return json({ ok: true });

	const addresses: string[] =
		eventType === 'bounce'
			? (message.bounce?.bouncedRecipients?.map((r: { emailAddress: string }) => r.emailAddress) ?? [])
			: eventType === 'complaint'
				? (message.complaint?.complainedRecipients?.map((r: { emailAddress: string }) => r.emailAddress) ?? [])
				: (message.delivery?.recipients ?? []);

	for (const email of addresses) {
		const { data: subscriber } = await supabaseAdmin
			.from('subscribers')
			.select('id')
			.eq('email', email.toLowerCase())
			.single();

		if (!subscriber) continue;

		if (mappedType === 'bounced' || mappedType === 'complained') {
			await supabaseAdmin
				.from('subscribers')
				.update({ status: 'bounced' })
				.eq('id', subscriber.id);
		}
	}

	return json({ ok: true });
};
