import type { PageServerLoad, Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { sendCampaign } from '$lib/server/email';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	if (!supabaseAdmin) throw error(503, 'Database not configured');

	const { data: campaign } = await supabaseAdmin
		.from('email_campaigns')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!campaign) throw error(404, 'Campaign not found');

	const { count } = await supabaseAdmin
		.from('subscribers')
		.select('*', { count: 'exact', head: true })
		.eq('status', 'active');

	return { campaign, activeSubscriberCount: count ?? 0 };
};

export const actions: Actions = {
	send: async ({ params }) => {
		try {
			await sendCampaign(params.id);
			return { success: true };
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			return fail(500, { error: message });
		}
	}
};
