import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { supabaseAdmin } from '$lib/server/supabase';
import { searchSimilar } from '$lib/server/embeddings';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the assistant for Brighter Intelligence Labs, a consultancy that builds AI workflow systems, intelligent operations tooling, and AI infrastructure for businesses.

Your role is to help potential clients understand how Brighter Intelligence Labs can help them. Be helpful, direct, and professional. When relevant, reference specific articles from the knowledge base provided.

Services we offer:
- AI Workflow Systems: automating complex business processes with LLMs and agents
- Intelligent Operations: tooling for teams running AI in production (monitoring, eval, cost management)
- Infrastructure Consulting: architecture review and advisory for companies building on LLMs

Always link to relevant articles when referencing them (use the slug as: /insights/[slug]).
Keep responses concise — 2-4 paragraphs unless a detailed answer is warranted.
Do not make up services or pricing. If unsure, offer to connect them with Richard directly.`;

export const POST: RequestHandler = async ({ request, locals }) => {
	const { message } = await request.json();
	const sessionToken = locals.sessionToken;

	if (!message?.trim()) {
		return json({ error: 'Message is required' }, { status: 400 });
	}

	if (!supabaseAdmin) {
		return json({ error: 'Database not configured' }, { status: 503 });
	}

	// Get or create conversation
	let conversationId: string;
	const { data: existing } = await supabaseAdmin
		.from('conversations')
		.select('id')
		.eq('session_token', sessionToken)
		.single();

	if (existing) {
		conversationId = existing.id;
	} else {
		const { data: created, error } = await supabaseAdmin
			.from('conversations')
			.insert({ session_token: sessionToken })
			.select('id')
			.single();
		if (error || !created)
			return json({ error: 'Failed to create conversation' }, { status: 500 });
		conversationId = created.id;
	}

	// Load last 10 messages for context
	const { data: history } = await supabaseAdmin
		.from('messages')
		.select('role, content')
		.eq('conversation_id', conversationId)
		.order('created_at', { ascending: true })
		.limit(10);

	// Vector search for relevant context
	let contextBlock = '';
	try {
		const results = await searchSimilar(message, 4, 0.65);
		if (results.length > 0) {
			contextBlock =
				'\n\n---\nRelevant content from our knowledge base:\n\n' +
				results
					.map((r) => `Article: "${r.title}" (/insights/${r.slug})\n${r.chunk_text}`)
					.join('\n\n---\n\n');
		}
	} catch {
		// Non-fatal — proceed without context
	}

	// Save user message
	await supabaseAdmin.from('messages').insert({
		conversation_id: conversationId,
		role: 'user',
		content: message
	});

	// Build message array for Claude
	const messages: Anthropic.MessageParam[] = [
		...(history ?? []).map((m) => ({
			role: m.role as 'user' | 'assistant',
			content: m.content
		})),
		{ role: 'user', content: message }
	];

	// Stream response via SSE
	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			let fullResponse = '';

			try {
				const anthropicStream = anthropic.messages.stream({
					model: 'claude-sonnet-4-6',
					max_tokens: 1024,
					system: SYSTEM_PROMPT + contextBlock,
					messages
				});

				for await (const chunk of anthropicStream) {
					if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
						const text = chunk.delta.text;
						fullResponse += text;
						controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
					}
				}

				// Save assistant response
				await supabaseAdmin!.from('messages').insert({
					conversation_id: conversationId,
					role: 'assistant',
					content: fullResponse
				});

				controller.enqueue(encoder.encode('data: [DONE]\n\n'));
			} catch {
				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
				);
			} finally {
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
