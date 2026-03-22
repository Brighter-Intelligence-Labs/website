import { describe, it, expect } from 'vitest';
import type { Database } from '$lib/types/database.types';

describe('Database types', () => {
	it('articles table has correct row shape', () => {
		// Type-level test: verify the shape compiles correctly
		const row: Database['public']['Tables']['articles']['Row'] = {
			id: 'test-uuid',
			title: 'Test Article',
			slug: 'test-article',
			content: 'Some content',
			excerpt: 'An excerpt',
			category: 'agent-design',
			status: 'published',
			author: 'Richard',
			tags: ['ai', 'agents'],
			read_time: '5 min read',
			featured: false,
			research_notes: null,
			draft_content: null,
			published_at: '2026-01-01T00:00:00Z',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-01T00:00:00Z'
		};
		expect(row.id).toBe('test-uuid');
		expect(row.tags).toEqual(['ai', 'agents']);
	});

	it('article_embeddings table has correct row shape', () => {
		const row: Database['public']['Tables']['article_embeddings']['Row'] = {
			id: 'emb-uuid',
			article_id: 'art-uuid',
			chunk_index: 0,
			chunk_text: 'chunk content',
			embedding: [0.1, 0.2, 0.3],
			created_at: '2026-01-01T00:00:00Z'
		};
		expect(row.embedding).toHaveLength(3);
	});

	it('conversations table has correct row shape', () => {
		const row: Database['public']['Tables']['conversations']['Row'] = {
			id: 'conv-uuid',
			session_token: 'token-123',
			created_at: '2026-01-01T00:00:00Z',
			updated_at: '2026-01-01T00:00:00Z'
		};
		expect(row.session_token).toBe('token-123');
	});

	it('messages table has correct row shape', () => {
		const row: Database['public']['Tables']['messages']['Row'] = {
			id: 'msg-uuid',
			conversation_id: 'conv-uuid',
			role: 'user',
			content: 'Hello',
			created_at: '2026-01-01T00:00:00Z'
		};
		expect(row.role).toBe('user');
	});

	it('subscribers table has correct row shape', () => {
		const row: Database['public']['Tables']['subscribers']['Row'] = {
			id: 'sub-uuid',
			email: 'test@example.com',
			name: 'Test User',
			status: 'active',
			subscribed_at: '2026-01-01T00:00:00Z',
			unsubscribed_at: null
		};
		expect(row.status).toBe('active');
	});

	it('email_campaigns table has correct row shape', () => {
		const row: Database['public']['Tables']['email_campaigns']['Row'] = {
			id: 'camp-uuid',
			subject: 'Newsletter',
			body_html: '<p>Hello</p>',
			body_text: 'Hello',
			article_id: null,
			status: 'draft',
			sent_at: null,
			created_at: '2026-01-01T00:00:00Z'
		};
		expect(row.status).toBe('draft');
	});

	it('search_articles function has correct args/returns', () => {
		const args: Database['public']['Functions']['search_articles']['Args'] = {
			query_embedding: [0.1, 0.2, 0.3],
			match_threshold: 0.7,
			match_count: 5
		};
		expect(args.query_embedding).toHaveLength(3);

		const result: Database['public']['Functions']['search_articles']['Returns'][0] = {
			article_id: 'art-uuid',
			chunk_index: 0,
			chunk_text: 'text',
			similarity: 0.85,
			title: 'Title',
			slug: 'slug',
			category: 'agent-design',
			excerpt: 'Excerpt'
		};
		expect(result.similarity).toBe(0.85);
	});
});
