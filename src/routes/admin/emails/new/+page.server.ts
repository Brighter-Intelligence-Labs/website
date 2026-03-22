import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const actions: Actions = {
	default: async ({ request }) => {
		if (!supabaseAdmin) return fail(503, { error: 'Database not configured' });

		const formData = await request.formData();
		const subject = formData.get('subject') as string;
		const body_html = formData.get('body_html') as string;
		const body_text = formData.get('body_text') as string;

		if (!subject || !body_html || !body_text) {
			return fail(400, { error: 'All fields are required' });
		}

		const { data: campaign, error } = await supabaseAdmin
			.from('email_campaigns')
			.insert({ subject, body_html, body_text })
			.select('id')
			.single();

		if (error) return fail(500, { error: error.message });

		throw redirect(303, `/admin/emails/${campaign.id}`);
	}
};
