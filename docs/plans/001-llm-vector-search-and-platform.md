# 001 — LLM Vector Search & Platform

**Status:** Planned
**Created:** 2026-03-20
**Scope:** Full-stack platform upgrade — Supabase integration, pgvector semantic search, streaming chat UI, agentic content pipeline, email marketing

---

## Table of Contents

1. [Context & Current State](#1-context--current-state)
2. [Architecture Overview](#2-architecture-overview)
3. [Environment Variables & Config](#3-environment-variables--config)
4. [Database Schema & Migrations](#4-database-schema--migrations)
5. [Supabase Client Setup](#5-supabase-client-setup)
6. [Vector Embeddings Pipeline](#6-vector-embeddings-pipeline)
7. [Chat API & Streaming](#7-chat-api--streaming)
8. [Chat UI Components](#8-chat-ui-components)
9. [Admin CMS](#9-admin-cms)
10. [Agentic Content Workflow](#10-agentic-content-workflow)
11. [Email Marketing System](#11-email-marketing-system)
12. [Public Site Updates](#12-public-site-updates)
13. [Content Migration Script](#13-content-migration-script)
14. [Implementation Order](#14-implementation-order)
15. [Estimated Costs](#15-estimated-costs)

---

## 1. Context & Current State

### Existing Stack
- **Framework:** SvelteKit 2 + Svelte 5 (runes syntax), TypeScript strict, Vite 6
- **Content:** mdsvex — 3 published markdown articles in `src/content/insights/`
- **Routing:** Fully prerendered SSG, no API routes, no database
- **Deployment:** Vercel via `@sveltejs/adapter-vercel`
- **Design system:** Teal `#0D9488` accent, CSS variables, scoped styles (no Tailwind)
- **Fonts:** DM Serif Display, M PLUS Rounded 1c, Inter, JetBrains Mono

### Known Gaps (pre-existing)
- Contact form posts to `formspree.io/f/placeholder` — broken
- No sitemap.xml, no robots.txt
- No analytics

### What This Plan Adds
- Supabase Postgres + pgvector for data persistence and semantic search
- Streaming chat interface on the homepage (not a widget — full UI)
- Internal CMS at `/admin` for managing the content pipeline
- Agentic research + drafting workflow powered by Claude API
- Email marketing via AWS SES with subscriber management
- Fix the broken contact form using SES

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Vercel (SvelteKit)                │
│                                                     │
│  Public Routes          Admin Routes                │
│  /                      /admin (Supabase auth)      │
│  /insights              /admin/content              │
│  /insights/[slug]       /admin/subscribers          │
│  /contact               /admin/emails               │
│                                                     │
│  API Routes (+server.ts)                            │
│  POST /api/chat                 ← SSE streaming     │
│  GET  /api/chat/history                             │
│  POST /api/search                                   │
│  POST /api/email/subscribe                          │
│  GET  /api/email/unsubscribe                        │
│  POST /api/contact                                  │
│  POST /api/webhooks/ses                             │
│  POST /api/admin/content/[id]/trigger-research      │
│  POST /api/admin/content/[id]/trigger-draft         │
│  POST /api/admin/content/[id]/publish               │
│  POST /api/admin/email/send                         │
└────────────┬──────────────┬──────────────┬──────────┘
             │              │              │
    ┌────────▼──────┐ ┌─────▼─────┐ ┌────▼──────────┐
    │ Supabase Pro  │ │ Anthropic │ │   AWS SES      │
    │               │ │ Claude API│ │                │
    │ • Postgres    │ │           │ │ • Send email   │
    │ • pgvector    │ │ • Chat    │ │ • Webhooks     │
    │ • Auth        │ │ • Draft   │ │   (SNS → API)  │
    │ • RLS         │ │ • Research│ └────────────────┘
    └───────────────┘ │           │
                      │ OpenAI    │
                      │ • Embed   │
                      └───────────┘
```

### Key Decisions
- **No separate backend service.** All server logic lives in SvelteKit `+server.ts` files.
- **Supabase Auth** for admin only. Public users are anonymous (session token in cookie).
- **OpenAI `text-embedding-3-small`** for embeddings (1536 dims, cheapest quality option).
- **Claude `claude-sonnet-4-6`** for chat responses and content generation.
- **SSE (Server-Sent Events)** for streaming chat — not WebSockets.
- **mdsvex** still used for rendering markdown on the frontend; content now stored in Supabase, not filesystem.

---

## 3. Environment Variables & Config

### `.env` (git-ignored, copy from `.env.example`)

```bash
# Supabase
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (embeddings only)
OPENAI_API_KEY=sk-...

# AWS SES
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_SES_FROM_ADDRESS=hello@brighterintelligence.com
AWS_SES_REPLY_TO=richard@brighterintelligence.com

# App
PUBLIC_SITE_URL=https://brighterintelligence.com
```

### `.env.example` (committed to repo)

Same as above but with empty values. Create this file so future developers know what's needed.

### `src/app.d.ts` — extend with Supabase types

```typescript
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
      session: Session | null;
      user: User | null;
      sessionToken: string; // anonymous chat session token
    }
    interface PageData {
      session: Session | null;
    }
  }
}
export {};
```

### `package.json` — new dependencies to install

```bash
npm install @supabase/supabase-js @supabase/ssr openai @anthropic-ai/sdk @aws-sdk/client-ses @aws-sdk/client-sns uuid
npm install --save-dev supabase
```

---

## 4. Database Schema & Migrations

All migration files go in `supabase/migrations/`. Run with `supabase db push` or via the Supabase dashboard SQL editor.

### `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable pgvector extension
create extension if not exists vector;

-- ─────────────────────────────────────────
-- articles
-- ─────────────────────────────────────────
create table articles (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  content       text,                    -- final human-edited markdown
  excerpt       text,
  category      text not null check (category in (
                  'systems-thinking',
                  'agent-design',
                  'cost-governance'
                )),
  status        text not null default 'idea' check (status in (
                  'idea',
                  'researching',
                  'drafting',
                  'review',
                  'approved',
                  'published'
                )),
  author        text not null default 'Richard',
  tags          text[] default '{}',
  read_time     text,                    -- e.g. "8 min read"
  featured      boolean default false,
  research_notes text,                   -- AI-generated research
  draft_content  text,                   -- AI-generated draft
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────
-- article_embeddings
-- ─────────────────────────────────────────
create table article_embeddings (
  id            uuid primary key default gen_random_uuid(),
  article_id    uuid not null references articles(id) on delete cascade,
  chunk_index   int not null,
  chunk_text    text not null,
  embedding     vector(1536) not null,
  created_at    timestamptz default now()
);

-- IVFFlat index for fast cosine similarity search
-- Lists value: rule of thumb is rows/1000, min 10
create index article_embeddings_embedding_idx
  on article_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);

create index article_embeddings_article_id_idx
  on article_embeddings(article_id);

-- ─────────────────────────────────────────
-- conversations
-- ─────────────────────────────────────────
create table conversations (
  id            uuid primary key default gen_random_uuid(),
  session_token text unique not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger conversations_updated_at
  before update on conversations
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────
-- messages
-- ─────────────────────────────────────────
create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz default now()
);

create index messages_conversation_id_idx on messages(conversation_id);
create index messages_created_at_idx on messages(created_at);

-- ─────────────────────────────────────────
-- subscribers
-- ─────────────────────────────────────────
create table subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             text unique not null,
  name              text,
  status            text not null default 'active' check (status in (
                      'active', 'unsubscribed', 'bounced'
                    )),
  subscribed_at     timestamptz default now(),
  unsubscribed_at   timestamptz
);

-- ─────────────────────────────────────────
-- email_campaigns
-- ─────────────────────────────────────────
create table email_campaigns (
  id          uuid primary key default gen_random_uuid(),
  subject     text not null,
  body_html   text not null,
  body_text   text not null,
  article_id  uuid references articles(id) on delete set null,
  status      text not null default 'draft' check (status in (
                'draft', 'scheduled', 'sending', 'sent'
              )),
  sent_at     timestamptz,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────
-- email_events
-- ─────────────────────────────────────────
create table email_events (
  id              uuid primary key default gen_random_uuid(),
  campaign_id     uuid not null references email_campaigns(id) on delete cascade,
  subscriber_id   uuid not null references subscribers(id) on delete cascade,
  event_type      text not null check (event_type in (
                    'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained'
                  )),
  event_data      jsonb default '{}',
  created_at      timestamptz default now()
);

create index email_events_campaign_id_idx on email_events(campaign_id);
create index email_events_subscriber_id_idx on email_events(subscriber_id);
```

### `supabase/migrations/002_rls_policies.sql`

```sql
-- Enable RLS on all tables
alter table articles             enable row level security;
alter table article_embeddings   enable row level security;
alter table conversations        enable row level security;
alter table messages             enable row level security;
alter table subscribers          enable row level security;
alter table email_campaigns      enable row level security;
alter table email_events         enable row level security;

-- ─────────────────────────────────────────
-- Public read policies
-- ─────────────────────────────────────────
create policy "Public can read published articles"
  on articles for select
  using (status = 'published');

create policy "Public can read embeddings for published articles"
  on article_embeddings for select
  using (
    exists (
      select 1 from articles
      where articles.id = article_embeddings.article_id
        and articles.status = 'published'
    )
  );

-- Anonymous users can read/write their own conversations (by session_token)
-- This is handled server-side using the service role key, not client-side RLS.
-- No public policy needed for conversations/messages.

-- ─────────────────────────────────────────
-- Authenticated (admin) full access
-- ─────────────────────────────────────────
create policy "Authenticated users have full access to articles"
  on articles for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to article_embeddings"
  on article_embeddings for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to conversations"
  on conversations for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to messages"
  on messages for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to subscribers"
  on subscribers for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to email_campaigns"
  on email_campaigns for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users have full access to email_events"
  on email_events for all
  using (auth.role() = 'authenticated');
```

### `supabase/migrations/003_search_function.sql`

```sql
-- pgvector semantic search function
-- Called from the server: select * from search_articles($1, $2, $3)
create or replace function search_articles(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count     int default 5
)
returns table (
  article_id    uuid,
  chunk_index   int,
  chunk_text    text,
  similarity    float,
  title         text,
  slug          text,
  category      text,
  excerpt       text
)
language sql stable
as $$
  select
    ae.article_id,
    ae.chunk_index,
    ae.chunk_text,
    1 - (ae.embedding <=> query_embedding) as similarity,
    a.title,
    a.slug,
    a.category,
    a.excerpt
  from article_embeddings ae
  join articles a on a.id = ae.article_id
  where
    a.status = 'published'
    and 1 - (ae.embedding <=> query_embedding) > match_threshold
  order by ae.embedding <=> query_embedding
  limit match_count;
$$;
```

### `supabase/config.toml` (local dev)

```toml
[api]
port = 54321

[db]
port = 54322

[studio]
port = 54323

[auth]
site_url = "http://localhost:5173"
additional_redirect_urls = ["http://localhost:5173/admin"]
```

---

## 5. Supabase Client Setup

### `src/lib/server/supabase.ts` — server-side client (service role)

```typescript
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';

// Service role client — bypasses RLS. Only use server-side.
export const supabaseAdmin = createClient<Database>(
  PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false }
  }
);
```

### `src/lib/supabase.ts` — browser client (anon key)

```typescript
import { createBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database.types';

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}
```

### `src/hooks.server.ts` — session management + anonymous token

```typescript
import { createServerClient } from '@supabase/ssr';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

const supabaseHandle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' });
          });
        }
      }
    }
  );

  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    if (!session) return { session: null, user: null };
    const { data: { user }, error } = await event.locals.supabase.auth.getUser();
    if (error) return { session: null, user: null };
    return { session, user };
  };

  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};

// Anonymous session token for chat (cookie-based, not Supabase auth)
const sessionTokenHandle: Handle = async ({ event, resolve }) => {
  let token = event.cookies.get('chat_session');
  if (!token) {
    token = randomUUID();
    event.cookies.set('chat_session', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });
  }
  event.locals.sessionToken = token;
  return resolve(event);
};

export const handle = sequence(supabaseHandle, sessionTokenHandle);
```

### `src/lib/types/database.types.ts`

Generate this file automatically using the Supabase CLI after running migrations:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.types.ts
```

Commit the generated file. Re-run whenever the schema changes.

---

## 6. Vector Embeddings Pipeline

### `src/lib/server/embeddings.ts`

```typescript
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { supabaseAdmin } from './supabase';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const EMBEDDING_MODEL = 'text-embedding-3-small';
const CHUNK_SIZE = 500;      // tokens (approximate — use char count: ~4 chars/token → 2000 chars)
const CHUNK_OVERLAP = 50;    // tokens overlap (~200 chars)
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

  // Strip markdown syntax for cleaner embeddings
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
      // If a single paragraph exceeds chunk size, split by sentence
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

  // Add overlap: prepend end of previous chunk to next chunk
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
  // Load article content
  const { data: article, error } = await supabaseAdmin
    .from('articles')
    .select('id, title, content, excerpt')
    .eq('id', articleId)
    .single();

  if (error || !article) throw new Error(`Article not found: ${articleId}`);
  if (!article.content) throw new Error(`Article has no content: ${articleId}`);

  // Delete existing embeddings
  await supabaseAdmin
    .from('article_embeddings')
    .delete()
    .eq('article_id', articleId);

  // Prepend title + excerpt to improve search relevance
  const fullText = `${article.title}\n\n${article.excerpt ?? ''}\n\n${article.content}`;
  const chunks = chunkText(fullText);

  // Embed each chunk and insert
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
): Promise<Array<{
  article_id: string;
  chunk_index: number;
  chunk_text: string;
  similarity: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
}>> {
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabaseAdmin.rpc('search_articles', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit
  });

  if (error) throw error;
  return data ?? [];
}
```

---

## 7. Chat API & Streaming

### `src/routes/api/chat/+server.ts`

```typescript
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
    if (error || !created) return json({ error: 'Failed to create conversation' }, { status: 500 });
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
      contextBlock = '\n\n---\nRelevant content from our knowledge base:\n\n' +
        results.map(r =>
          `Article: "${r.title}" (/insights/${r.slug})\n${r.chunk_text}`
        ).join('\n\n---\n\n');
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
    ...(history ?? []).map(m => ({
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
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const text = chunk.delta.text;
            fullResponse += text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        // Save assistant response
        await supabaseAdmin.from('messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: fullResponse
        });

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
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
      'Connection': 'keep-alive'
    }
  });
};
```

### `src/routes/api/chat/history/+server.ts`

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ locals }) => {
  const sessionToken = locals.sessionToken;

  const { data: conversation } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('session_token', sessionToken)
    .single();

  if (!conversation) return json({ messages: [] });

  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true })
    .limit(50);

  return json({ messages: messages ?? [] });
};
```

### `src/routes/api/search/+server.ts`

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { searchSimilar } from '$lib/server/embeddings';

export const POST: RequestHandler = async ({ request }) => {
  const { query, limit = 5 } = await request.json();
  if (!query?.trim()) return json({ error: 'Query required' }, { status: 400 });

  const results = await searchSimilar(query, limit);
  return json({ results });
};
```

---

## 8. Chat UI Components

### Component Hierarchy

```
src/lib/components/chat/
├── ChatContainer.svelte    — orchestrator: state, API calls, session
├── MessageList.svelte      — scrollable list of MessageBubble components
├── MessageBubble.svelte    — single message (user or assistant styling)
├── ChatInput.svelte        — textarea + send button, handles Enter key
└── StreamingText.svelte    — renders streaming text with cursor animation
```

### `src/lib/components/chat/ChatContainer.svelte`

```svelte
<script lang="ts">
  import MessageList from './MessageList.svelte';
  import ChatInput from './ChatInput.svelte';

  type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    streaming?: boolean;
  };

  let messages = $state<Message[]>([]);
  let isStreaming = $state(false);

  // Load history on mount
  $effect(() => {
    fetch('/api/chat/history')
      .then(r => r.json())
      .then(({ messages: history }) => {
        if (history?.length) {
          messages = history.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content
          }));
        }
      });
  });

  async function sendMessage(text: string) {
    if (isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text
    };
    messages = [...messages, userMessage];

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      streaming: true
    };
    messages = [...messages, assistantMessage];
    isStreaming = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const { text, error } = JSON.parse(data);
            if (error) throw new Error(error);
            if (text) {
              messages = messages.map(m =>
                m.id === assistantMessage.id
                  ? { ...m, content: m.content + text }
                  : m
              );
            }
          } catch {
            // malformed SSE line — skip
          }
        }
      }
    } finally {
      messages = messages.map(m =>
        m.id === assistantMessage.id ? { ...m, streaming: false } : m
      );
      isStreaming = false;
    }
  }
</script>

<div class="chat-container">
  <div class="chat-header">
    <span class="chat-label">Ask anything about AI systems</span>
  </div>
  <MessageList {messages} />
  <ChatInput onSend={sendMessage} disabled={isStreaming} />
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    height: 520px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
    background: var(--color-bg);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }

  .chat-header {
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
  }

  .chat-label {
    font-family: var(--font-ui);
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
```

### `src/lib/components/chat/MessageList.svelte`

```svelte
<script lang="ts">
  import MessageBubble from './MessageBubble.svelte';

  type Message = { id: string; role: 'user' | 'assistant'; content: string; streaming?: boolean };
  let { messages }: { messages: Message[] } = $props();

  let listEl = $state<HTMLElement>();

  // Auto-scroll to bottom when messages change
  $effect(() => {
    messages; // dependency
    if (listEl) {
      listEl.scrollTop = listEl.scrollHeight;
    }
  });
</script>

<div class="message-list" bind:this={listEl}>
  {#if messages.length === 0}
    <div class="empty-state">
      <p>What are you working on? Ask about AI workflows, agent systems, or how we can help.</p>
    </div>
  {/if}
  {#each messages as message (message.id)}
    <MessageBubble {message} />
  {/each}
</div>

<style>
  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    scroll-behavior: smooth;
  }

  .empty-state {
    text-align: center;
    color: var(--color-text-secondary);
    font-family: var(--font-body);
    font-size: 0.9rem;
    margin: auto;
    max-width: 380px;
    line-height: 1.6;
  }
</style>
```

### `src/lib/components/chat/MessageBubble.svelte`

```svelte
<script lang="ts">
  import StreamingText from './StreamingText.svelte';

  type Message = { id: string; role: 'user' | 'assistant'; content: string; streaming?: boolean };
  let { message }: { message: Message } = $props();
</script>

<div class="bubble-wrapper" class:user={message.role === 'user'}>
  <div class="bubble" class:user={message.role === 'user'} class:assistant={message.role === 'assistant'}>
    {#if message.streaming}
      <StreamingText text={message.content} />
    {:else}
      <div class="content">{@html renderMarkdown(message.content)}</div>
    {/if}
  </div>
</div>

<script lang="ts" context="module">
  // Simple inline markdown renderer — headings, bold, italic, links, code
  // For a proper solution, use marked or micromark as a dev dependency
  function renderMarkdown(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n/g, '<br>');
  }
</script>

<style>
  .bubble-wrapper {
    display: flex;
    justify-content: flex-start;
  }

  .bubble-wrapper.user {
    justify-content: flex-end;
  }

  .bubble {
    max-width: 78%;
    padding: var(--space-sm) var(--space-md);
    border-radius: 12px;
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.65;
  }

  .bubble.user {
    background: var(--color-accent);
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .bubble.assistant {
    background: #f3f4f6;
    color: var(--color-text);
    border-bottom-left-radius: 4px;
  }

  .content :global(a) {
    color: var(--color-accent);
    text-decoration: underline;
  }

  .content :global(code) {
    font-family: var(--font-mono);
    font-size: 0.85em;
    background: rgba(0, 0, 0, 0.08);
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }
</style>
```

### `src/lib/components/chat/StreamingText.svelte`

```svelte
<script lang="ts">
  let { text }: { text: string } = $props();
</script>

<span class="streaming">{text}<span class="cursor">▋</span></span>

<style>
  .streaming {
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.65;
    white-space: pre-wrap;
  }

  .cursor {
    display: inline-block;
    animation: blink 1s step-end infinite;
    color: var(--color-accent);
    margin-left: 1px;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
</style>
```

### `src/lib/components/chat/ChatInput.svelte`

```svelte
<script lang="ts">
  let {
    onSend,
    disabled = false
  }: {
    onSend: (text: string) => void;
    disabled?: boolean;
  } = $props();

  let inputValue = $state('');

  function handleSubmit() {
    const text = inputValue.trim();
    if (!text || disabled) return;
    inputValue = '';
    onSend(text);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }
</script>

<div class="input-area">
  <textarea
    bind:value={inputValue}
    onkeydown={handleKeydown}
    placeholder="Ask about AI systems, workflows, or how we can help…"
    rows="1"
    {disabled}
    class:disabled
  ></textarea>
  <button onclick={handleSubmit} {disabled} class:disabled aria-label="Send message">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  </button>
</div>

<style>
  .input-area {
    display: flex;
    align-items: flex-end;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
  }

  textarea {
    flex: 1;
    resize: none;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.6rem 0.8rem;
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.5;
    background: #fff;
    color: var(--color-text);
    max-height: 120px;
    overflow-y: auto;
    transition: border-color 0.15s;
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  button {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--color-accent);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.15s;
  }

  button:hover:not(.disabled) {
    opacity: 0.85;
  }

  button.disabled,
  textarea.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

### Homepage Integration

In `src/routes/+page.svelte`, add the chat section between the Hero and the next section:

```svelte
<script lang="ts">
  // existing imports...
  import ChatContainer from '$lib/components/chat/ChatContainer.svelte';
</script>

<!-- Hero section (existing) -->
<Hero ... />

<!-- Chat section -->
<section class="chat-section">
  <div class="container">
    <div class="chat-intro">
      <h2>Talk to our AI assistant</h2>
      <p>Get instant answers about AI systems, our approach, and how we work with clients.</p>
    </div>
    <ChatContainer />
  </div>
</section>

<!-- rest of existing page content... -->
```

Add to the `<style>` block:

```css
.chat-section {
  padding: var(--space-xl) var(--space-md);
  background: var(--color-bg-alt, #f8f9fa);
}

.chat-intro {
  text-align: center;
  margin-bottom: var(--space-md);
}

.chat-intro h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.chat-intro p {
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}
```

---

## 9. Admin CMS

### Auth Guard

`src/routes/admin/+layout.server.ts`:

```typescript
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const { session } = await locals.safeGetSession();
  if (!session) throw redirect(303, '/admin/login');
  return { session };
};
```

### `src/routes/admin/+layout.svelte`

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  let { children, data } = $props();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/content', label: 'Content' },
    { href: '/admin/subscribers', label: 'Subscribers' },
    { href: '/admin/emails', label: 'Emails' }
  ];
</script>

<div class="admin-shell">
  <aside class="sidebar">
    <div class="logo">BIL Admin</div>
    <nav>
      {#each navItems as item}
        <a
          href={item.href}
          class:active={$page.url.pathname === item.href}
        >{item.label}</a>
      {/each}
    </nav>
    <form method="POST" action="/admin?/logout">
      <button type="submit">Sign out</button>
    </form>
  </aside>
  <main class="admin-main">
    {@render children()}
  </main>
</div>

<style>
  .admin-shell {
    display: flex;
    min-height: 100vh;
    font-family: var(--font-ui);
  }

  .sidebar {
    width: 220px;
    background: #1a1a2e;
    color: #e2e8f0;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
  }

  .logo {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--color-accent);
    padding: 0 0.5rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    margin-bottom: 0.5rem;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  nav a {
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    transition: background 0.15s, color 0.15s;
  }

  nav a:hover,
  nav a.active {
    background: rgba(255,255,255,0.08);
    color: #fff;
  }

  button[type="submit"] {
    background: none;
    border: 1px solid rgba(255,255,255,0.15);
    color: #94a3b8;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    width: 100%;
  }

  .admin-main {
    margin-left: 220px;
    flex: 1;
    padding: 2rem;
    background: #f8fafc;
    min-height: 100vh;
  }
</style>
```

### `src/routes/admin/login/+page.svelte`

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<div class="login-wrap">
  <div class="login-card">
    <h1>Admin Login</h1>
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}
    <form method="POST" use:enhance>
      <label>Email <input type="email" name="email" required /></label>
      <label>Password <input type="password" name="password" required /></label>
      <button type="submit">Sign in</button>
    </form>
  </div>
</div>
```

### `src/routes/admin/login/+page.server.ts`

```typescript
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (error) return fail(400, { error: 'Invalid credentials' });

    throw redirect(303, '/admin');
  }
};
```

### Content Pipeline — Kanban Board

`src/routes/admin/content/+page.svelte` renders a kanban view:

- Columns: `idea | researching | drafting | review | approved | published`
- Each card shows: title, category badge, date
- Click card → navigate to `/admin/content/[id]`
- "New article" button → `/admin/content/new`
- Status change buttons on each card (not drag-and-drop for v1)

`src/routes/admin/content/+page.server.ts`:

```typescript
import type { PageServerLoad, Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const load: PageServerLoad = async () => {
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('id, title, slug, category, status, featured, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false });

  return { articles: articles ?? [] };
};

export const actions: Actions = {
  updateStatus: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;

    await supabaseAdmin
      .from('articles')
      .update({ status })
      .eq('id', id);

    return { success: true };
  }
};
```

### Article Editor

`src/routes/admin/content/[id]/+page.svelte`:
- Left panel: form fields (title, slug, category, tags, excerpt, read_time, featured toggle)
- Center: markdown textarea for `content`
- Right panel: research notes (read-only display of `research_notes`)
- Bottom bar: status control buttons + save + publish
- "Trigger Research" button → POST to `/api/admin/content/[id]/trigger-research`
- "Trigger Draft" button → POST to `/api/admin/content/[id]/trigger-draft`
- "Publish" button → POST to `/api/admin/content/[id]/publish`

`src/routes/admin/content/[id]/+page.server.ts`:

```typescript
import type { PageServerLoad, Actions } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!article) throw new Error('Not found');
  return { article };
};

export const actions: Actions = {
  save: async ({ request, params }) => {
    const data = Object.fromEntries(await request.formData());
    const { error } = await supabaseAdmin
      .from('articles')
      .update({
        title: data.title as string,
        slug: data.slug as string,
        content: data.content as string,
        excerpt: data.excerpt as string,
        category: data.category as string,
        tags: (data.tags as string).split(',').map(t => t.trim()).filter(Boolean),
        read_time: data.read_time as string,
        featured: data.featured === 'on'
      })
      .eq('id', params.id);

    if (error) return fail(500, { error: error.message });
    return { success: true };
  }
};
```

---

## 10. Agentic Content Workflow

### `src/lib/server/content-agent.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { supabaseAdmin } from './supabase';
import { embedArticle } from './embeddings';

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

/**
 * Phase 1: Research an article idea.
 * Sets status: researching → drafting after completion.
 */
export async function researchArticle(articleId: string): Promise<void> {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('title, excerpt, category')
    .eq('id', articleId)
    .single();

  if (!article) throw new Error('Article not found');

  await supabaseAdmin
    .from('articles')
    .update({ status: 'researching' })
    .eq('id', articleId);

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
 * Sets status: drafting → review after completion.
 */
export async function draftArticle(articleId: string): Promise<void> {
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
- Structure: Introduction hook → core argument → practical section (3-4 points) → conclusion with clear takeaway
- Format: Markdown with ## and ### headings. No H1 (the title is handled separately)
- Avoid: Buzzword overload, vague promises, "AI will transform everything" clichés
- Include: At least one concrete example or pattern. End with a specific actionable insight.
- Do NOT include author bylines, dates, or metadata — just the article body in markdown.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }]
  });

  const draftContent = message.content[0].type === 'text' ? message.content[0].text : '';

  // Estimate read time (average 200 words/minute)
  const wordCount = draftContent.split(/\s+/).length;
  const readTime = `${Math.ceil(wordCount / 200)} min read`;

  await supabaseAdmin
    .from('articles')
    .update({
      draft_content: draftContent,
      content: draftContent,       // populate content for human editing
      read_time: readTime,
      status: 'review'
    })
    .eq('id', articleId);
}

/**
 * Phase 3: Publish — set published_at, generate slug, embed article.
 */
export async function publishArticle(articleId: string): Promise<void> {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('title, slug, status')
    .eq('id', articleId)
    .single();

  if (!article) throw new Error('Article not found');

  // Auto-generate slug from title if not set
  const slug = article.slug || article.title
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

  // Generate and store embeddings
  await embedArticle(articleId);
}
```

### Admin API Endpoints

**`src/routes/api/admin/content/[id]/trigger-research/+server.ts`:**

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { researchArticle } from '$lib/server/content-agent';

export const POST: RequestHandler = async ({ params, locals }) => {
  if (!locals.session) return json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await researchArticle(params.id);
    return json({ success: true });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
};
```

**`src/routes/api/admin/content/[id]/trigger-draft/+server.ts`:**

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { draftArticle } from '$lib/server/content-agent';

export const POST: RequestHandler = async ({ params, locals }) => {
  if (!locals.session) return json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await draftArticle(params.id);
    return json({ success: true });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
};
```

**`src/routes/api/admin/content/[id]/publish/+server.ts`:**

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { publishArticle } from '$lib/server/content-agent';

export const POST: RequestHandler = async ({ params, locals }) => {
  if (!locals.session) return json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await publishArticle(params.id);
    return json({ success: true });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
};
```

---

## 11. Email Marketing System

### `src/lib/server/email.ts`

```typescript
import { SESClient, SendEmailCommand, SendBulkTemplatedEmailCommand } from '@aws-sdk/client-ses';
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_SES_FROM_ADDRESS,
  AWS_SES_REPLY_TO
} from '$env/static/private';
import { supabaseAdmin } from './supabase';

const ses = new SESClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

/**
 * Send a single transactional email.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  await ses.send(new SendEmailCommand({
    Source: AWS_SES_FROM_ADDRESS,
    ReplyToAddresses: [AWS_SES_REPLY_TO],
    Destination: { ToAddresses: [params.to] },
    Message: {
      Subject: { Data: params.subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: params.html, Charset: 'UTF-8' },
        Text: { Data: params.text, Charset: 'UTF-8' }
      }
    }
  }));
}

/**
 * Send a campaign to all active subscribers.
 * Marks campaign as 'sent' when complete.
 */
export async function sendCampaign(campaignId: string): Promise<void> {
  const { data: campaign } = await supabaseAdmin
    .from('email_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (!campaign) throw new Error('Campaign not found');

  const { data: subscribers } = await supabaseAdmin
    .from('subscribers')
    .select('id, email, name')
    .eq('status', 'active');

  if (!subscribers?.length) {
    await supabaseAdmin
      .from('email_campaigns')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', campaignId);
    return;
  }

  await supabaseAdmin
    .from('email_campaigns')
    .update({ status: 'sending' })
    .eq('id', campaignId);

  // Send in batches of 50 to avoid SES rate limits
  const BATCH_SIZE = 50;
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (subscriber) => {
        const unsubUrl = `${process.env.PUBLIC_SITE_URL}/api/email/unsubscribe?id=${subscriber.id}`;
        const html = campaign.body_html.replace('{{unsubscribe_url}}', unsubUrl);
        const text = campaign.body_text.replace('{{unsubscribe_url}}', unsubUrl);

        try {
          await sendEmail({
            to: subscriber.email,
            subject: campaign.subject,
            html,
            text
          });

          await supabaseAdmin.from('email_events').insert({
            campaign_id: campaignId,
            subscriber_id: subscriber.id,
            event_type: 'sent'
          });
        } catch {
          // Log failure but don't abort the whole campaign
        }
      })
    );
  }

  await supabaseAdmin
    .from('email_campaigns')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', campaignId);
}

/**
 * Send a welcome email to a new subscriber.
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<void> {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #0D9488;">${greeting}</h2>
      <p>You're now subscribed to Brighter Intelligence Labs — practical insights on AI systems, agents, and building AI that actually works in production.</p>
      <p>We publish when we have something worth saying. Expect 1–2 emails per month.</p>
      <p style="margin-top: 2rem;">— Richard</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0;" />
      <p style="font-size: 0.8rem; color: #6b7280;">
        You subscribed at brighterintelligence.com.<br>
        <a href="{{unsubscribe_url}}" style="color: #6b7280;">Unsubscribe</a>
      </p>
    </div>
  `;
  const text = `${greeting}\n\nYou're now subscribed to Brighter Intelligence Labs.\n\nWe publish practical insights on AI systems and agents 1-2x per month.\n\n— Richard\n\nUnsubscribe: {{unsubscribe_url}}`;

  await sendEmail({ to: email, subject: 'Welcome to Brighter Intelligence Labs', html, text });
}
```

### Email Subscription Endpoints

**`src/routes/api/email/subscribe/+server.ts`:**

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';
import { sendWelcomeEmail } from '$lib/server/email';

export const POST: RequestHandler = async ({ request }) => {
  const { email, name } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Valid email required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('subscribers')
    .upsert(
      { email: email.toLowerCase(), name: name || null, status: 'active' },
      { onConflict: 'email', ignoreDuplicates: false }
    );

  if (error) return json({ error: 'Failed to subscribe' }, { status: 500 });

  // Fire and forget — don't block the response
  sendWelcomeEmail(email, name).catch(() => {});

  return json({ success: true });
};
```

**`src/routes/api/email/unsubscribe/+server.ts`:**

```typescript
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  if (!id) return new Response('Missing subscriber ID', { status: 400 });

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
```

### SES Webhook Handler

**`src/routes/api/webhooks/ses/+server.ts`:**

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

// AWS SNS sends JSON with a Message field that itself is JSON
export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  // Handle SNS subscription confirmation
  if (body.Type === 'SubscriptionConfirmation') {
    await fetch(body.SubscribeURL);
    return json({ ok: true });
  }

  if (body.Type !== 'Notification') return json({ ok: true });

  const message = JSON.parse(body.Message);
  const eventType = message.notificationType?.toLowerCase(); // 'bounce', 'complaint', 'delivery'

  if (!eventType) return json({ ok: true });

  // Map SES event types to our schema
  const typeMap: Record<string, string> = {
    bounce: 'bounced',
    complaint: 'complained',
    delivery: 'delivered'
  };

  const mappedType = typeMap[eventType];
  if (!mappedType) return json({ ok: true });

  // Extract email addresses from the event
  const addresses: string[] = eventType === 'bounce'
    ? message.bounce?.bouncedRecipients?.map((r: any) => r.emailAddress) ?? []
    : eventType === 'complaint'
    ? message.complaint?.complainedRecipients?.map((r: any) => r.emailAddress) ?? []
    : message.delivery?.recipients ?? [];

  for (const email of addresses) {
    const { data: subscriber } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (!subscriber) continue;

    // Mark bounced/complained subscribers as inactive
    if (mappedType === 'bounced' || mappedType === 'complained') {
      await supabaseAdmin
        .from('subscribers')
        .update({ status: 'bounced' })
        .eq('id', subscriber.id);
    }

    // Log the event (look up campaign by message ID if available)
    // Simplified: just log without campaign linkage for now
    await supabaseAdmin.from('email_events').insert({
      campaign_id: message.mail?.tags?.campaignId?.[0] ?? null,
      subscriber_id: subscriber.id,
      event_type: mappedType,
      event_data: message
    }).match({});
  }

  return json({ ok: true });
};
```

---

## 12. Public Site Updates

### Update `/insights` to read from Supabase

Replace `src/routes/insights/+page.server.ts` (currently uses `import.meta.glob`):

```typescript
import type { PageServerLoad } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const load: PageServerLoad = async () => {
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('id, title, slug, category, excerpt, author, tags, read_time, featured, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const categories = [...new Set((articles ?? []).map(a => a.category))];

  return {
    articles: articles ?? [],
    categories
  };
};
```

Replace `src/routes/insights/[slug]/+page.ts`:

```typescript
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export const load: PageLoad = async ({ params }) => {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!article) throw error(404, 'Article not found');
  return { article };
};
```

Note: This file becomes `+page.server.ts` (not `+page.ts`) because it now uses server-side imports.

### Fix Contact Form

Replace `src/routes/api/contact/+server.ts` (new file — replaces Formspree):

```typescript
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email';
import { AWS_SES_REPLY_TO } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
  const { name, email, company, message } = await request.json();

  if (!name || !email || !message) {
    return json({ error: 'Name, email, and message are required' }, { status: 400 });
  }

  await sendEmail({
    to: AWS_SES_REPLY_TO,
    subject: `New contact form submission from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
    text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\nMessage:\n${message}`
  });

  return json({ success: true });
};
```

Update `src/routes/contact/+page.svelte` to POST to `/api/contact` instead of Formspree.

### Add Subscribe Component

`src/lib/components/SubscribeForm.svelte`:

```svelte
<script lang="ts">
  let email = $state('');
  let name = $state('');
  let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function subscribe() {
    status = 'loading';
    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      status = res.ok ? 'success' : 'error';
    } catch {
      status = 'error';
    }
  }
</script>

{#if status === 'success'}
  <p class="success-msg">You're in. Check your inbox for a welcome email.</p>
{:else}
  <form onsubmit={(e) => { e.preventDefault(); subscribe(); }} class="subscribe-form">
    <input type="text" bind:value={name} placeholder="Your name (optional)" />
    <input type="email" bind:value={email} placeholder="Email address" required />
    <button type="submit" disabled={status === 'loading'}>
      {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
    </button>
    {#if status === 'error'}
      <p class="error-msg">Something went wrong. Try again.</p>
    {/if}
  </form>
{/if}
```

Add `<SubscribeForm />` to `src/lib/components/Footer.svelte`.

### Sitemap & Robots

**`src/routes/sitemap.xml/+server.ts`:**

```typescript
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { PUBLIC_SITE_URL } from '$env/static/public';

export const GET: RequestHandler = async () => {
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published');

  const staticPages = ['', '/about', '/systems', '/contact', '/insights'];

  const urls = [
    ...staticPages.map(path => `
      <url>
        <loc>${PUBLIC_SITE_URL}${path}</loc>
        <changefreq>weekly</changefreq>
        <priority>${path === '' ? '1.0' : '0.8'}</priority>
      </url>`),
    ...(articles ?? []).map(a => `
      <url>
        <loc>${PUBLIC_SITE_URL}/insights/${a.slug}</loc>
        <lastmod>${a.updated_at?.split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>`)
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
};
```

**`static/robots.txt`:**

```
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://brighterintelligence.com/sitemap.xml
```

---

## 13. Content Migration Script

**`scripts/migrate-content.ts`:**

```typescript
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
import matter from 'gray-matter'; // npm install gray-matter

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env manually (not SvelteKit context)
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

  // Insert article
  const { data: article, error } = await supabase
    .from('articles')
    .upsert({
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
    }, { onConflict: 'slug' })
    .select('id')
    .single();

  if (error || !article) {
    console.error(`  Failed to insert: ${error?.message}`);
    return;
  }

  // Delete existing embeddings
  await supabase.from('article_embeddings').delete().eq('article_id', article.id);

  // Generate embeddings
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
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} articles to migrate\n`);

  for (const file of files) {
    await migrateArticle(path.join(CONTENT_DIR, file));
  }

  console.log('\nMigration complete.');
}

main().catch(console.error);
```

Add to `package.json` scripts:

```json
"migrate": "npx tsx scripts/migrate-content.ts"
```

Additional migration dependencies:

```bash
npm install --save-dev tsx dotenv gray-matter
```

---

## 14. Implementation Order

Work through phases in strict order. Each phase is independently deployable.

### Phase 1 — Foundation

**Goal:** Supabase connected, admin login working, no public-facing changes.

1. Create Supabase project at supabase.com. Enable pgvector extension in the dashboard.
2. Run `supabase/migrations/001_initial_schema.sql` → `002_rls_policies.sql` → `003_search_function.sql` (in order, via SQL editor or `supabase db push`).
3. Generate TypeScript types: `npx supabase gen types typescript --project-id <id> > src/lib/types/database.types.ts`
4. Install dependencies: `npm install @supabase/supabase-js @supabase/ssr openai @anthropic-ai/sdk @aws-sdk/client-ses uuid`
5. Create `.env` with Supabase credentials. Create `.env.example`.
6. Write `src/lib/server/supabase.ts` and `src/lib/supabase.ts`.
7. Write `src/hooks.server.ts` (Supabase handle + session token handle).
8. Update `src/app.d.ts` with new `Locals` types.
9. Create admin auth: `src/routes/admin/+layout.svelte`, `+layout.server.ts`, `login/+page.svelte`, `login/+page.server.ts`.
10. Create a Supabase Auth user for Richard via the Supabase dashboard.
11. Smoke test: can log in at `/admin`, redirects to dashboard.

### Phase 2 — Content Pipeline

**Goal:** Articles manageable in CMS, public insights page reads from Supabase.

12. Build `src/routes/admin/content/+page.svelte` + `+page.server.ts` (kanban board).
13. Build `src/routes/admin/content/new/+page.svelte` (create article form).
14. Build `src/routes/admin/content/[id]/+page.svelte` + `+page.server.ts` (editor).
15. Build `src/routes/admin/+page.svelte` (dashboard with article counts by status).
16. Run migration script: `npm run migrate` (installs `gray-matter`, `tsx`, `dotenv` first).
17. Update `src/routes/insights/+page.server.ts` to read from Supabase.
18. Update `src/routes/insights/[slug]/+page.ts` → rename to `+page.server.ts`, read from Supabase.
19. Smoke test: 3 existing articles visible at `/insights`, article detail pages work.
20. Deploy and verify Vercel build succeeds (add env vars to Vercel dashboard).

### Phase 3 — Agentic Workflow

**Goal:** Research and draft pipeline working end-to-end.

21. Add `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` to `.env` and Vercel.
22. Write `src/lib/server/embeddings.ts`.
23. Write `src/lib/server/content-agent.ts`.
24. Write the 3 admin API endpoints: `trigger-research`, `trigger-draft`, `publish`.
25. Wire up buttons in the article editor UI to call these endpoints.
26. Test: create a new article idea → trigger research → trigger draft → review in editor → publish → verify it appears in `/insights`.
27. Verify embeddings appear in `article_embeddings` table after publish.

### Phase 4 — Chat Interface

**Goal:** Chat working on homepage with vector search context.

28. Write `src/routes/api/chat/+server.ts`.
29. Write `src/routes/api/chat/history/+server.ts`.
30. Write `src/routes/api/search/+server.ts`.
31. Build chat components: `ChatContainer`, `MessageList`, `MessageBubble`, `StreamingText`, `ChatInput`.
32. Add `<ChatContainer />` to `src/routes/+page.svelte`.
33. Test locally: send messages, verify streaming works, verify vector context is included, verify history persists across page reloads.
34. Note: if the app is prerendered, the homepage needs `export const prerender = false` OR move to SSR. Since chat requires server interaction, set `export const ssr = true; export const prerender = false` in the root `+layout.server.ts` (or just the homepage).

### Phase 5 — Email Marketing

**Goal:** Subscribers can sign up, campaigns can be sent, contact form works.

35. Set up AWS SES: verify sending domain, configure DKIM/SPF/DMARC, move out of sandbox.
36. Create SNS topic → subscribe the webhook URL `/api/webhooks/ses` → confirm subscription.
37. Add AWS credentials to `.env` and Vercel.
38. Write `src/lib/server/email.ts`.
39. Write subscribe/unsubscribe endpoints.
40. Write SES webhook handler.
41. Write contact form API endpoint, update contact page form action.
42. Build subscriber management UI: `src/routes/admin/subscribers/+page.svelte`.
43. Build email campaign UI: `src/routes/admin/emails/` (list, new, detail).
44. Add `<SubscribeForm />` to `Footer.svelte`.
45. Test: subscribe, receive welcome email, send a test campaign, receive it, click unsubscribe link.

### Phase 6 — Polish

46. Add `src/routes/sitemap.xml/+server.ts`.
47. Add `static/robots.txt`.
48. Remove prerendering from layout if not compatible with dynamic routes — or selectively enable per-route.
49. Audit `prerender` settings: static marketing pages stay prerendered; `/insights/[slug]`, `/api/*`, `/admin/*` are server-rendered.
50. Review and test mobile layout of chat component.

---

## 15. Estimated Costs

| Service | Tier | Monthly Cost |
|---|---|---|
| Supabase | Pro | $25 |
| Anthropic API | Chat ~50k tokens/day + content gen | ~$15–35 |
| OpenAI API | Embeddings (text-embedding-3-small) | ~$1–5 |
| AWS SES | ~1000 emails/mo | <$1 |
| Vercel | Pro (optional — Hobby works for now) | $0–20 |
| **Total** | | **~$41–66/mo** |

### Scaling Notes
- Supabase Pro includes 8GB database, 250GB bandwidth, 500MB pgvector storage — adequate for years at this traffic level.
- Switch from Vercel to AWS Amplify/CloudFront if hosting costs become a concern (SvelteKit adapter-aws available).
- If chat volume spikes significantly, add rate limiting to `/api/chat` (by session token, max N requests/hour) using a simple Supabase counter or Upstash Redis.

---

## Appendix: File Tree (Post-Implementation)

```
├── scripts/
│   └── migrate-content.ts
├── src/
│   ├── app.d.ts                      (updated)
│   ├── hooks.server.ts               (new)
│   ├── content/insights/             (kept for reference, superseded by Supabase)
│   ├── lib/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatContainer.svelte
│   │   │   │   ├── MessageList.svelte
│   │   │   │   ├── MessageBubble.svelte
│   │   │   │   ├── ChatInput.svelte
│   │   │   │   └── StreamingText.svelte
│   │   │   ├── SubscribeForm.svelte  (new)
│   │   │   └── [existing components]
│   │   ├── server/
│   │   │   ├── supabase.ts           (new)
│   │   │   ├── embeddings.ts         (new)
│   │   │   ├── content-agent.ts      (new)
│   │   │   └── email.ts              (new)
│   │   ├── supabase.ts               (new — browser client)
│   │   └── types/
│   │       └── database.types.ts     (generated)
│   └── routes/
│       ├── +layout.server.ts         (updated — disable prerender for dynamic routes)
│       ├── +page.svelte              (updated — add ChatContainer)
│       ├── contact/+page.svelte      (updated — POST to /api/contact)
│       ├── insights/
│       │   ├── +page.server.ts       (updated — Supabase)
│       │   └── [slug]/+page.server.ts (updated — Supabase, was +page.ts)
│       ├── admin/
│       │   ├── +layout.svelte
│       │   ├── +layout.server.ts
│       │   ├── +page.svelte
│       │   ├── login/
│       │   │   ├── +page.svelte
│       │   │   └── +page.server.ts
│       │   ├── content/
│       │   │   ├── +page.svelte
│       │   │   ├── +page.server.ts
│       │   │   ├── new/+page.svelte
│       │   │   └── [id]/
│       │   │       ├── +page.svelte
│       │   │       └── +page.server.ts
│       │   ├── subscribers/
│       │   │   ├── +page.svelte
│       │   │   └── +page.server.ts
│       │   └── emails/
│       │       ├── +page.svelte
│       │       ├── new/+page.svelte
│       │       └── [id]/+page.svelte
│       ├── api/
│       │   ├── chat/
│       │   │   ├── +server.ts
│       │   │   └── history/+server.ts
│       │   ├── search/+server.ts
│       │   ├── contact/+server.ts
│       │   ├── email/
│       │   │   ├── subscribe/+server.ts
│       │   │   └── unsubscribe/+server.ts
│       │   ├── webhooks/
│       │   │   └── ses/+server.ts
│       │   └── admin/
│       │       └── content/
│       │           └── [id]/
│       │               ├── trigger-research/+server.ts
│       │               ├── trigger-draft/+server.ts
│       │               └── publish/+server.ts
│       └── sitemap.xml/+server.ts
├── static/
│   └── robots.txt                    (new)
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_rls_policies.sql
│       └── 003_search_function.sql
└── .env.example                      (new)
```
