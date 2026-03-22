import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { supabaseAdmin } from './supabase';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;
const CHARS_PER_TOKEN = 4;

/**
 * Generate an embedding vector for a text string.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	const response = await openai.embeddings.create({
		model: EMBEDDING_MODEL,
		input: text.replace(/\n/g, ' ')
	});
	return response.data[0].embedding;
}

/**
 * Split article markdown content into overlapping chunks.
 * Tries to split on paragraph boundaries first.
 */
export function chunkText(content: string): string[] {
	const chunkChars = CHUNK_SIZE * CHARS_PER_TOKEN;
	const overlapChars = CHUNK_OVERLAP * CHARS_PER_TOKEN;

	const stripped = content
		.replace(/#{1,6}\s+/g, '')
		.replace(/\*\*(.+?)\*\*/g, '$1')
		.replace(/\*(.+?)\*/g, '$1')
		.replace(/`(.+?)`/g, '$1')
		.replace(/\[(.+?)\]\(.+?\)/g, '$1')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

	const paragraphs = stripped.split(/\n\n+/);
	const chunks: string[] = [];
	let current = '';

	for (const paragraph of paragraphs) {
		if ((current + '\n\n' + paragraph).length <= chunkChars) {
			current = current ? current + '\n\n' + paragraph : paragraph;
		} else {
			if (current) chunks.push(current.trim());
			if (paragraph.length > chunkChars) {
				const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
				current = '';
				for (const sentence of sentences) {
					if ((current + ' ' + sentence).length <= chunkChars) {
						current = current ? current + ' ' + sentence : sentence;
					} else {
						if (current) chunks.push(current.trim());
						current = sentence;
					}
				}
			} else {
				current = paragraph;
			}
		}
	}
	if (current) chunks.push(current.trim());

	const overlappedChunks: string[] = [];
	for (let i = 0; i < chunks.length; i++) {
		if (i === 0) {
			overlappedChunks.push(chunks[i]);
		} else {
			const prev = chunks[i - 1];
			const overlapText = prev.slice(-overlapChars);
			overlappedChunks.push(overlapText + '\n\n' + chunks[i]);
		}
	}

	return overlappedChunks;
}

/**
 * Generate and store embeddings for an article.
 * Deletes existing embeddings first (idempotent).
 */
export async function embedArticle(articleId: string): Promise<void> {
	if (!supabaseAdmin) throw new Error('Database not configured');

	const { data: article, error } = await supabaseAdmin
		.from('articles')
		.select('id, title, content, excerpt')
		.eq('id', articleId)
		.single();

	if (error || !article) throw new Error(`Article not found: ${articleId}`);
	if (!article.content) throw new Error(`Article has no content: ${articleId}`);

	await supabaseAdmin.from('article_embeddings').delete().eq('article_id', articleId);

	const fullText = `${article.title}\n\n${article.excerpt ?? ''}\n\n${article.content}`;
	const chunks = chunkText(fullText);

	const embeddings = await Promise.all(
		chunks.map(async (chunk, index) => ({
			article_id: articleId,
			chunk_index: index,
			chunk_text: chunk,
			embedding: await generateEmbedding(chunk)
		}))
	);

	const { error: insertError } = await supabaseAdmin
		.from('article_embeddings')
		.insert(embeddings);

	if (insertError) throw insertError;
}

/**
 * Search for article chunks semantically similar to a query.
 */
export async function searchSimilar(
	query: string,
	limit = 5,
	threshold = 0.7
): Promise<
	Array<{
		article_id: string;
		chunk_index: number;
		chunk_text: string;
		similarity: number;
		title: string;
		slug: string;
		category: string;
		excerpt: string | null;
	}>
> {
	if (!supabaseAdmin) throw new Error('Database not configured');

	const queryEmbedding = await generateEmbedding(query);

	const { data, error } = await supabaseAdmin.rpc('search_articles', {
		query_embedding: queryEmbedding,
		match_threshold: threshold,
		match_count: limit
	});

	if (error) throw error;
	return data ?? [];
}
