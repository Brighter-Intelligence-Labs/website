import type { PageServerLoad } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const load: PageServerLoad = async () => {
	if (!supabaseAdmin) return { subscribers: [] };

	const { data: subscribers } = await supabaseAdmin
		.from('subscribers')
		.select('*')
		.order('subscribed_at', { ascending: false });

	return { subscribers: subscribers ?? [] };
};
