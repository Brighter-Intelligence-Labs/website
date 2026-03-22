import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ locals }) => {
	if (!supabaseAdmin) return json({ messages: [] });

	const sessionToken = locals.sessionToken;

	const { data: conversation } = await supabaseAdmin
		.from('conversations')
		.select('id')
		.eq('session_token', sessionToken)
		.single();

	if (!conversation) return json({ messages: [] });

	const { data: messages } = await supabaseAdmin
		.from('messages')
		.select('id, role, content, created_at')
		.eq('conversation_id', conversation.id)
		.order('created_at', { ascending: true })
		.limit(50);

	return json({ messages: messages ?? [] });
};
