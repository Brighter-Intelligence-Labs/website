import type { PageServerLoad, Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	if (!supabaseAdmin) throw error(503, 'Database not configured');

	const { data: article } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!article) throw error(404, 'Article not found');
	return { article };
};

export const actions: Actions = {
	save: async ({ request, params }) => {
		if (!supabaseAdmin) return fail(503, { error: 'Database not configured' });

		const data = Object.fromEntries(await request.formData());
		const { error: err } = await supabaseAdmin
			.from('articles')
			.update({
				title: data.title as string,
				slug: data.slug as string,
				content: data.content as string,
				excerpt: data.excerpt as string,
				category: data.category as string,
				tags: (data.tags as string)
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean),
				read_time: (data.read_time as string) || null,
				featured: data.featured === 'on'
			})
			.eq('id', params.id);

		if (err) return fail(500, { error: err.message });
		return { success: true };
	}
};
