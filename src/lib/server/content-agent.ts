import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { supabaseAdmin } from './supabase';
import { embedArticle } from './embeddings';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

/**
 * Phase 1: Research an article idea.
 * Sets status: researching -> drafting after completion.
 */
export async function researchArticle(articleId: string): Promise<void> {
	if (!supabaseAdmin) throw new Error('Database not configured');

	const { data: article } = await supabaseAdmin
		.from('articles')
		.select('title, excerpt, category')
		.eq('id', articleId)
		.single();

	if (!article) throw new Error('Article not found');

	await supabaseAdmin.from('articles').update({ status: 'researching' }).eq('id', articleId);

	const prompt = `You are a research assistant for Brighter Intelligence Labs, a consultancy specialising in AI workflow systems, intelligent operations, and AI infrastructure for businesses.

Research the following article topic thoroughly:

Topic: "${article.title}"
Category: ${article.category}
${article.excerpt ? `Initial concept: ${article.excerpt}` : ''}

Provide:
1. Key arguments and angles to explore
2. Relevant technical concepts to explain (at a business-leader level)
3. Common pain points or mistakes companies make in this area
4. 3-5 concrete examples or case study angles (no made-up companies — use general patterns)
5. Potential structure/outline for the article
6. Key takeaways the reader should leave with

Be specific and actionable. This research will be used to write a thought leadership article for B2B technology decision-makers.`;

	const message = await anthropic.messages.create({
		model: 'claude-sonnet-4-6',
		max_tokens: 2000,
		messages: [{ role: 'user', content: prompt }]
	});

	const researchNotes = message.content[0].type === 'text' ? message.content[0].text : '';

	await supabaseAdmin
		.from('articles')
		.update({
			research_notes: researchNotes,
			status: 'drafting'
		})
		.eq('id', articleId);
}

/**
 * Phase 2: Draft the article from research notes.
 * Sets status: drafting -> review after completion.
 */
export async function draftArticle(articleId: string): Promise<void> {
	if (!supabaseAdmin) throw new Error('Database not configured');

	const { data: article } = await supabaseAdmin
		.from('articles')
		.select('title, category, research_notes')
		.eq('id', articleId)
		.single();

	if (!article) throw new Error('Article not found');
	if (!article.research_notes) throw new Error('No research notes — run research phase first');

	const prompt = `You are a content writer for Brighter Intelligence Labs, a consultancy that builds AI workflow systems, intelligent operations tooling, and AI infrastructure for businesses.

Write a complete blog article based on the research notes below.

Title: "${article.title}"
Category: ${article.category}

Research Notes:
${article.research_notes}

Writing guidelines:
- Length: 900–1400 words
- Tone: authoritative but accessible — confident, not academic. Write like a senior practitioner talking to a peer
- Audience: CTOs, engineering leaders, founders at companies with 20–500 employees considering AI adoption
- Structure: Introduction hook -> core argument -> practical section (3-4 points) -> conclusion with clear takeaway
- Format: Markdown with ## and ### headings. No H1 (the title is handled separately)
- Avoid: Buzzword overload, vague promises, "AI will transform everything" cliches
- Include: At least one concrete example or pattern. End with a specific actionable insight.
- Do NOT include author bylines, dates, or metadata — just the article body in markdown.`;

	const message = await anthropic.messages.create({
		model: 'claude-sonnet-4-6',
		max_tokens: 3000,
		messages: [{ role: 'user', content: prompt }]
	});

	const draftContent = message.content[0].type === 'text' ? message.content[0].text : '';

	const wordCount = draftContent.split(/\s+/).length;
	const readTime = `${Math.ceil(wordCount / 200)} min read`;

	await supabaseAdmin
		.from('articles')
		.update({
			draft_content: draftContent,
			content: draftContent,
			read_time: readTime,
			status: 'review'
		})
		.eq('id', articleId);
}

/**
 * Phase 3: Publish — set published_at, generate slug, embed article.
 */
export async function publishArticle(articleId: string): Promise<void> {
	if (!supabaseAdmin) throw new Error('Database not configured');

	const { data: article } = await supabaseAdmin
		.from('articles')
		.select('title, slug, status')
		.eq('id', articleId)
		.single();

	if (!article) throw new Error('Article not found');

	const slug =
		article.slug ||
		article.title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();

	await supabaseAdmin
		.from('articles')
		.update({
			slug,
			status: 'published',
			published_at: new Date().toISOString()
		})
		.eq('id', articleId);

	await embedArticle(articleId);
}
