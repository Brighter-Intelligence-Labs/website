import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const actions: Actions = {
	default: async ({ request }) => {
		if (!supabaseAdmin) return fail(503, { error: 'Database not configured', title: '', slug: '', category: '', excerpt: '', tags: '' });

		const formData = await request.formData();
		const title = formData.get('title') as string;
		let slug = (formData.get('slug') as string)?.trim();
		const category = formData.get('category') as string;
		const excerpt = (formData.get('excerpt') as string) || null;
		const tagsRaw = formData.get('tags') as string;
		const tags = tagsRaw
			? tagsRaw
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: [];

		if (!title || !category) {
			return fail(400, { error: 'Title and category are required', title, slug, category, excerpt, tags: tagsRaw });
		}

		if (!slug) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-')
				.trim();
		}

		const { data: article, error } = await supabaseAdmin
			.from('articles')
			.insert({ title, slug, category, excerpt, tags, status: 'idea' })
			.select('id')
			.single();

		if (error) {
			return fail(500, { error: error.message, title, slug, category, excerpt, tags: tagsRaw });
		}

		throw redirect(303, `/admin/content/${article.id}`);
	}
};
