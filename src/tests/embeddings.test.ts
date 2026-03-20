import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock OpenAI before importing
vi.mock('openai', () => {
	return {
		default: class MockOpenAI {
			embeddings = {
				create: vi.fn().mockResolvedValue({
					data: [{ embedding: new Array(1536).fill(0) }]
				})
			};
		}
	};
});

vi.mock('$lib/server/supabase', () => ({
	supabaseAdmin: {
		from: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		eq: vi.fn().mockReturnThis(),
		single: vi.fn(),
		insert: vi.fn().mockReturnThis(),
		delete: vi.fn().mockReturnThis(),
		rpc: vi.fn()
	}
}));

// Now import after mocks are set up
const { chunkText } = await import('$lib/server/embeddings');

describe('chunkText', () => {
	it('returns a single chunk for short content', () => {
		const content = 'This is a short paragraph.';
		const chunks = chunkText(content);
		expect(chunks).toHaveLength(1);
		expect(chunks[0]).toBe('This is a short paragraph.');
	});

	it('splits long content into multiple chunks', () => {
		const paragraph = 'This is a test paragraph with some content. '.repeat(60);
		const content = `${paragraph}\n\n${paragraph}\n\n${paragraph}`;
		const chunks = chunkText(content);
		expect(chunks.length).toBeGreaterThan(1);
	});

	it('strips markdown syntax from chunks', () => {
		const content = '## Heading\n\n**Bold text** and *italic text* with `code` and [link](url).';
		const chunks = chunkText(content);
		expect(chunks[0]).not.toContain('##');
		expect(chunks[0]).not.toContain('**');
		expect(chunks[0]).toContain('Bold text');
		expect(chunks[0]).toContain('italic text');
	});

	it('preserves actual content while stripping markdown', () => {
		const content = '### Important Section\n\nThis is the actual content that matters.';
		const chunks = chunkText(content);
		expect(chunks[0]).toContain('Important Section');
		expect(chunks[0]).toContain('actual content that matters');
	});

	it('handles empty content', () => {
		const chunks = chunkText('');
		expect(chunks).toHaveLength(0);
	});

	it('respects paragraph boundaries', () => {
		const content = 'First paragraph content.\n\nSecond paragraph content.';
		const chunks = chunkText(content);
		expect(chunks).toHaveLength(1);
		expect(chunks[0]).toContain('First paragraph');
		expect(chunks[0]).toContain('Second paragraph');
	});

	it('adds overlap between chunks when splitting', () => {
		const longParagraph = 'A'.repeat(1800);
		const content = `${longParagraph}\n\n${'B'.repeat(1800)}`;
		const chunks = chunkText(content);

		if (chunks.length > 1) {
			const firstChunkEnd = chunks[0].slice(-200);
			expect(chunks[1]).toContain(firstChunkEnd);
		}
	});

	it('handles single very long paragraph by splitting on sentences', () => {
		const sentences = Array.from({ length: 100 }, (_, i) => `Sentence number ${i} is here.`);
		const content = sentences.join(' ');
		const chunks = chunkText(content);
		expect(chunks.length).toBeGreaterThan(1);
		for (const chunk of chunks) {
			expect(chunk.length).toBeLessThanOrEqual(2500);
		}
	});
});
