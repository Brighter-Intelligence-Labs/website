export interface ArticleMeta {
	title: string;
	slug: string;
	category: string;
	date: string;
	author: string;
	excerpt: string;
	tags: string[];
	readTime: string;
	featured: boolean;
}

export interface Article {
	meta: ArticleMeta;
	path: string;
}

export async function getArticles(): Promise<Article[]> {
	const modules = import.meta.glob('/src/content/insights/*.md', { eager: true });

	const articles: Article[] = [];

	for (const [path, module] of Object.entries(modules)) {
		const mod = module as { metadata: ArticleMeta };
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';

		articles.push({
			meta: { ...mod.metadata, slug },
			path
		});
	}

	articles.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

	return articles;
}

export function filterByCategory(articles: Article[], category: string): Article[] {
	if (category === 'all') return articles;
	const categorySlug = category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
	return articles.filter((a) => {
		const artCatSlug = a.meta.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
		return artCatSlug === categorySlug;
	});
}
