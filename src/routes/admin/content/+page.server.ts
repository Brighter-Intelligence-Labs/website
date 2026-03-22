import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export const load: PageServerLoad = async () => {
	if (!supabaseAdmin) return { articles: [] };

	const { data: articles } = await supabaseAdmin
		.from('articles')
		.select('id, title, slug, category, status, featured, published_at, created_at, updated_at')
		.order('updated_at', { ascending: false });

	return { articles: articles ?? [] };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		if (!supabaseAdmin) return fail(503, { error: 'Database not configured' });

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const status = formData.get('status') as string;

		await supabaseAdmin.from('articles').update({ status }).eq('id', id);

		return { success: true };
	}
};
