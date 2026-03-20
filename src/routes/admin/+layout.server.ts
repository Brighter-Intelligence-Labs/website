import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (url.pathname === '/admin/login') return { session: null };
	const { session } = await locals.safeGetSession();
	if (!session) throw redirect(303, '/admin/login');
	return { session };
};
