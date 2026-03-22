import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) return new Response('Missing subscriber ID', { status: 400 });
	if (!supabaseAdmin) return new Response('Database not configured', { status: 503 });

	await supabaseAdmin
		.from('subscribers')
		.update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
		.eq('id', id);

	return new Response(
		`<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:2rem">
      <h2>You've been unsubscribed.</h2>
      <p>You won't receive any more emails from Brighter Intelligence Labs.</p>
      <a href="/">Back to site</a>
    </body></html>`,
		{ headers: { 'Content-Type': 'text/html' } }
	);
};
