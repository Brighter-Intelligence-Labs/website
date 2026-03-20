import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { researchArticle } from '$lib/server/content-agent';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!locals.session) return json({ error: 'Unauthorized' }, { status: 401 });
	try {
		await researchArticle(params.id);
		return json({ success: true });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		return json({ error: message }, { status: 500 });
	}
};
