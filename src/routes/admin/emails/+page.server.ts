import type { PageServerLoad } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const load: PageServerLoad = async () => {
	if (!supabaseAdmin) return { campaigns: [] };

	const { data: campaigns } = await supabaseAdmin
		.from('email_campaigns')
		.select('*')
		.order('created_at', { ascending: false });

	return { campaigns: campaigns ?? [] };
};
