import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const article = await import(`../../../content/insights/${params.slug}.md`);
		return {
			content: article.default,
			meta: article.metadata
		};
	} catch {
		throw error(404, `Article not found: ${params.slug}`);
	}
}
