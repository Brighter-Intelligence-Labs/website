import { getArticles } from '$lib/utils/articles';

export async function load() {
	const articles = await getArticles();
	return { articles };
}
