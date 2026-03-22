import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const GET: RequestHandler = async () => {
	const { data: articles } = supabaseAdmin
		? await supabaseAdmin.from('articles').select('slug, updated_at').eq('status', 'published')
		: { data: [] as { slug: string; updated_at: string | null }[] };

	const staticPages = ['', '/about', '/systems', '/contact', '/insights'];

	const urls = [
		...staticPages.map(
			(path) => `
      <url>
        <loc>${PUBLIC_SITE_URL}${path}</loc>
        <changefreq>weekly</changefreq>
        <priority>${path === '' ? '1.0' : '0.8'}</priority>
      </url>`
		),
		...(articles ?? []).map(
			(a) => `
      <url>
        <loc>${PUBLIC_SITE_URL}/insights/${a.slug}</loc>
        <lastmod>${a.updated_at?.split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>`
		)
	];

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`,
		{ headers: { 'Content-Type': 'application/xml' } }
	);
};
