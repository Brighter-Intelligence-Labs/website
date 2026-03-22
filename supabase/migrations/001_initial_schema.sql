-- Enable pgvector extension
create extension if not exists vector;

-- articles
create table articles (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  content       text,
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
  read_time     text,
  featured      boolean default false,
  research_notes text,
  draft_content  text,
  published_at  timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

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

-- article_embeddings
create table article_embeddings (
  id            uuid primary key default gen_random_uuid(),
  article_id    uuid not null references articles(id) on delete cascade,
  chunk_index   int not null,
  chunk_text    text not null,
  embedding     vector(1536) not null,
  created_at    timestamptz default now()
);

create index article_embeddings_embedding_idx
  on article_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);

create index article_embeddings_article_id_idx
  on article_embeddings(article_id);

-- conversations
create table conversations (
  id            uuid primary key default gen_random_uuid(),
  session_token text unique not null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create trigger conversations_updated_at
  before update on conversations
  for each row execute function set_updated_at();

-- messages
create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz default now()
);

create index messages_conversation_id_idx on messages(conversation_id);
create index messages_created_at_idx on messages(created_at);

-- subscribers
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

-- email_campaigns
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

-- email_events
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
