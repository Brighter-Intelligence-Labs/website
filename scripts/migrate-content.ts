#!/usr/bin/env npx tsx
/**
 * One-time migration: import existing markdown articles from the filesystem
 * into Supabase and generate their embeddings.
 *
 * Usage:
 *   npx tsx scripts/migrate-content.ts
 *
 * Prerequisites:
 *   - .env file with Supabase + OpenAI credentials
 *   - Supabase migrations already run
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
	process.env.PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CONTENT_DIR = path.join(__dirname, '../src/content/insights');
const CHARS_PER_TOKEN = 4;
const CHUNK_CHARS = 500 * CHARS_PER_TOKEN;

async function generateEmbedding(text: string): Promise<number[]> {
	const response = await openai.embeddings.create({
		model: 'text-embedding-3-small',
		input: text.replace(/\n/g, ' ')
	});
	return response.data[0].embedding;
}

function chunkText(content: string): string[] {
	const paragraphs = content.split(/\n\n+/);
	const chunks: string[] = [];
	let current = '';

	for (const para of paragraphs) {
		if ((current + '\n\n' + para).length <= CHUNK_CHARS) {
			current = current ? current + '\n\n' + para : para;
		} else {
			if (current) chunks.push(current.trim());
			current = para;
		}
	}
	if (current) chunks.push(current.trim());
	return chunks;
}

async function migrateArticle(filePath: string) {
	const raw = fs.readFileSync(filePath, 'utf-8');
	const { data: frontmatter, content } = matter(raw);

	console.log(`Migrating: ${frontmatter.title}`);

	const { data: article, error } = await supabase
		.from('articles')
		.upsert(
			{
				title: frontmatter.title,
				slug: frontmatter.slug,
				content,
				excerpt: frontmatter.excerpt,
				category: frontmatter.category,
				status: 'published',
				author: frontmatter.author || 'Richard',
				tags: frontmatter.tags || [],
				read_time: frontmatter.readTime,
				featured: frontmatter.featured || false,
				published_at: frontmatter.date
					? new Date(frontmatter.date).toISOString()
					: new Date().toISOString()
			},
			{ onConflict: 'slug' }
		)
		.select('id')
		.single();

	if (error || !article) {
		console.error(`  Failed to insert: ${error?.message}`);
		return;
	}

	await supabase.from('article_embeddings').delete().eq('article_id', article.id);

	const fullText = `${frontmatter.title}\n\n${frontmatter.excerpt ?? ''}\n\n${content}`;
	const chunks = chunkText(fullText);

	for (let i = 0; i < chunks.length; i++) {
		const embedding = await generateEmbedding(chunks[i]);
		await supabase.from('article_embeddings').insert({
			article_id: article.id,
			chunk_index: i,
			chunk_text: chunks[i],
			embedding
		});
		console.log(`  Chunk ${i + 1}/${chunks.length} embedded`);
	}

	console.log(`  Done: ${frontmatter.slug}`);
}

async function main() {
	const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'));
	console.log(`Found ${files.length} articles to migrate\n`);

	for (const file of files) {
		await migrateArticle(path.join(CONTENT_DIR, file));
	}

	console.log('\nMigration complete.');
}

main().catch(console.error);
