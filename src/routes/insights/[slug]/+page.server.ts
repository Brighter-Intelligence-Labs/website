import { error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!supabaseAdmin) throw error(503, 'Database not configured');

	const { data: article } = await supabaseAdmin
		.from('articles')
		.select('*')
		.eq('slug', params.slug)
		.eq('status', 'published')
		.single();

	if (!article) throw error(404, 'Article not found');

	return {
		meta: {
			title: article.title,
			slug: article.slug,
			category: article.category,
			date: article.published_at ?? article.created_at,
			author: article.author,
			excerpt: article.excerpt ?? '',
			tags: article.tags,
			readTime: article.read_time ?? '',
			featured: article.featured
		},
		articleContent: article.content ?? ''
	};
};
