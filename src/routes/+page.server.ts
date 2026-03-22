import { supabaseAdmin } from '$lib/server/supabase';

export async function load() {
	if (!supabaseAdmin) return { articles: [] };

	const { data: articles } = await supabaseAdmin
		.from('articles')
		.select('id, title, slug, category, excerpt, author, tags, read_time, featured, published_at')
		.eq('status', 'published')
		.order('published_at', { ascending: false })
		.limit(3);

	const mapped = (articles ?? []).map((a) => ({
		meta: {
			title: a.title,
			slug: a.slug,
			category: a.category,
			date: a.published_at ?? '',
			author: a.author,
			excerpt: a.excerpt ?? '',
			tags: a.tags,
			readTime: a.read_time ?? '',
			featured: a.featured
		},
		path: `/insights/${a.slug}`
	}));

	return { articles: mapped };
}
