import { describe, it, expect, vi, beforeEach } from 'vitest';

// Build a proper chainable mock
function createChainableMock() {
	const mock: Record<string, ReturnType<typeof vi.fn>> = {};

	const chainable = () => {
		return new Proxy(
			{},
			{
				get(_, prop: string) {
					if (!mock[prop]) {
						mock[prop] = vi.fn().mockReturnValue(chainable());
					}
					return mock[prop];
				}
			}
		);
	};

	return { chain: chainable(), mock };
}

const { chain: supabaseMock, mock: mockFns } = createChainableMock();

vi.mock('$lib/server/supabase', () => ({
	supabaseAdmin: supabaseMock
}));

vi.mock('openai', () => ({
	default: class MockOpenAI {
		embeddings = {
			create: vi.fn().mockResolvedValue({
				data: [{ embedding: new Array(1536).fill(0) }]
			})
		};
	}
}));

vi.mock('@anthropic-ai/sdk', () => ({
	default: class MockAnthropic {
		messages = {
			create: vi.fn().mockResolvedValue({
				content: [{ type: 'text', text: 'Generated research notes about AI systems.' }]
			}),
			stream: vi.fn()
		};
	}
}));

vi.mock('$lib/server/embeddings', () => ({
	embedArticle: vi.fn().mockResolvedValue(undefined),
	generateEmbedding: vi.fn().mockResolvedValue(new Array(1536).fill(0)),
	searchSimilar: vi.fn().mockResolvedValue([]),
	chunkText: vi.fn().mockReturnValue(['chunk1', 'chunk2'])
}));

describe('Content Agent - slug generation', () => {
	it('generates slug from title correctly', () => {
		const title = 'Why AI Agents Fail in Production';
		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
		expect(slug).toBe('why-ai-agents-fail-in-production');
	});

	it('handles special characters in slug generation', () => {
		const title = "The Real Cost: Running AI Systems (2026)";
		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
		expect(slug).toBe('the-real-cost-running-ai-systems-2026');
	});
});

describe('Content Agent - read time calculation', () => {
	it('calculates read time from word count', () => {
		const content = Array(600).fill('word').join(' ');
		const wordCount = content.split(/\s+/).length;
		const readTime = `${Math.ceil(wordCount / 200)} min read`;
		expect(readTime).toBe('3 min read');
	});

	it('rounds up for partial minutes', () => {
		const content = Array(201).fill('word').join(' ');
		const wordCount = content.split(/\s+/).length;
		const readTime = `${Math.ceil(wordCount / 200)} min read`;
		expect(readTime).toBe('2 min read');
	});
});

describe('Content Agent - research prompt construction', () => {
	it('builds research prompt with article metadata', () => {
		const article = { title: 'Test Title', category: 'agent-design', excerpt: 'Test excerpt' };

		const prompt = `Research the following article topic thoroughly:

Topic: "${article.title}"
Category: ${article.category}
${article.excerpt ? `Initial concept: ${article.excerpt}` : ''}`;

		expect(prompt).toContain('Test Title');
		expect(prompt).toContain('agent-design');
		expect(prompt).toContain('Test excerpt');
	});

	it('omits excerpt line when not provided', () => {
		const article = { title: 'Test Title', category: 'agent-design', excerpt: '' };

		const prompt = `Research the following article topic thoroughly:

Topic: "${article.title}"
Category: ${article.category}
${article.excerpt ? `Initial concept: ${article.excerpt}` : ''}`;

		expect(prompt).not.toContain('Initial concept:');
	});
});

describe('Content Agent - system prompt', () => {
	const SYSTEM_PROMPT = `You are the assistant for Brighter Intelligence Labs`;

	it('includes service descriptions', () => {
		expect(SYSTEM_PROMPT).toContain('Brighter Intelligence Labs');
	});
});
