import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { searchSimilar } from '$lib/server/embeddings';

export const POST: RequestHandler = async ({ request }) => {
	const { query, limit = 5 } = await request.json();
	if (!query?.trim()) return json({ error: 'Query required' }, { status: 400 });

	const results = await searchSimilar(query, limit);
	return json({ results });
};
