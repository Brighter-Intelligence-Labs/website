import { getArticles } from '$lib/utils/articles';

export async function load() {
	const articles = await getArticles();
	const categories = [...new Set(articles.map((a) => a.meta.category))];
	return { articles, categories };
}
