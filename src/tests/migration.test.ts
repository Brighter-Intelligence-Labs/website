import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const MIGRATIONS_DIR = path.join(process.cwd(), 'supabase/migrations');

describe('SQL Migrations', () => {
	it('migration files exist in correct order', () => {
		const files = fs.readdirSync(MIGRATIONS_DIR).sort();
		expect(files).toContain('001_initial_schema.sql');
		expect(files).toContain('002_rls_policies.sql');
		expect(files).toContain('003_search_function.sql');
	});

	describe('001_initial_schema.sql', () => {
		const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '001_initial_schema.sql'), 'utf-8');

		it('enables pgvector extension', () => {
			expect(sql).toContain('create extension if not exists vector');
		});

		it('creates articles table', () => {
			expect(sql).toContain('create table articles');
			expect(sql).toContain('title         text not null');
			expect(sql).toContain('slug          text unique not null');
			expect(sql).toContain('embedding     vector(1536)');
		});

		it('creates article_embeddings table with correct vector dimensions', () => {
			expect(sql).toContain('create table article_embeddings');
			expect(sql).toContain('vector(1536)');
		});

		it('creates conversations table', () => {
			expect(sql).toContain('create table conversations');
			expect(sql).toContain('session_token text unique not null');
		});

		it('creates messages table', () => {
			expect(sql).toContain('create table messages');
			expect(sql).toContain("check (role in ('user', 'assistant'))");
		});

		it('creates subscribers table', () => {
			expect(sql).toContain('create table subscribers');
			expect(sql).toContain('email             text unique not null');
		});

		it('creates email_campaigns table', () => {
			expect(sql).toContain('create table email_campaigns');
		});

		it('creates email_events table', () => {
			expect(sql).toContain('create table email_events');
		});

		it('creates updated_at trigger function', () => {
			expect(sql).toContain('create or replace function set_updated_at()');
			expect(sql).toContain('create trigger articles_updated_at');
		});

		it('creates IVFFlat index for embeddings', () => {
			expect(sql).toContain('using ivfflat (embedding vector_cosine_ops)');
		});

		it('defines valid article statuses', () => {
			expect(sql).toContain("'idea'");
			expect(sql).toContain("'researching'");
			expect(sql).toContain("'drafting'");
			expect(sql).toContain("'review'");
			expect(sql).toContain("'approved'");
			expect(sql).toContain("'published'");
		});

		it('defines valid article categories', () => {
			expect(sql).toContain("'systems-thinking'");
			expect(sql).toContain("'agent-design'");
			expect(sql).toContain("'cost-governance'");
		});
	});

	describe('002_rls_policies.sql', () => {
		const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '002_rls_policies.sql'), 'utf-8');

		it('enables RLS on all tables', () => {
			const tables = [
				'articles',
				'article_embeddings',
				'conversations',
				'messages',
				'subscribers',
				'email_campaigns',
				'email_events'
			];
			for (const table of tables) {
				expect(sql).toContain(`alter table ${table}`);
				expect(sql).toContain('enable row level security');
			}
		});

		it('allows public to read published articles only', () => {
			expect(sql).toContain("status = 'published'");
		});

		it('gives authenticated users full access', () => {
			expect(sql).toContain("auth.role() = 'authenticated'");
		});
	});

	describe('003_search_function.sql', () => {
		const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, '003_search_function.sql'), 'utf-8');

		it('creates search_articles function', () => {
			expect(sql).toContain('create or replace function search_articles');
		});

		it('accepts vector(1536) embedding parameter', () => {
			expect(sql).toContain('query_embedding vector(1536)');
		});

		it('uses cosine distance for similarity', () => {
			expect(sql).toContain('<=>');
		});

		it('filters only published articles', () => {
			expect(sql).toContain("a.status = 'published'");
		});

		it('returns expected columns', () => {
			expect(sql).toContain('ae.article_id');
			expect(sql).toContain('ae.chunk_text');
			expect(sql).toContain('similarity');
			expect(sql).toContain('a.title');
			expect(sql).toContain('a.slug');
		});
	});
});
