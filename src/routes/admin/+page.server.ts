import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

const STATUSES = ['idea', 'researching', 'drafting', 'review', 'approved', 'published'] as const;

export const load: PageServerLoad = async () => {
	if (!supabaseAdmin) return { statusCounts: [], subscriberCount: 0, campaignCount: 0 };

	const { data: articles } = await supabaseAdmin
		.from('articles')
		.select('status');

	const counts = STATUSES.map((status) => ({
		status,
		count: (articles ?? []).filter((a) => a.status === status).length
	}));

	const { count: subscriberCount } = await supabaseAdmin
		.from('subscribers')
		.select('*', { count: 'exact', head: true })
		.eq('status', 'active');

	const { count: campaignCount } = await supabaseAdmin
		.from('email_campaigns')
		.select('*', { count: 'exact', head: true });

	return {
		statusCounts: counts,
		subscriberCount: subscriberCount ?? 0,
		campaignCount: campaignCount ?? 0
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		await locals.supabase.auth.signOut();
		throw redirect(303, '/admin/login');
	}
};
