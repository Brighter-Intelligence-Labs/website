-- Enable RLS on all tables
alter table articles             enable row level security;
alter table article_embeddings   enable row level security;
alter table conversations        enable row level security;
alter table messages             enable row level security;
alter table subscribers          enable row level security;
alter table email_campaigns      enable row level security;
alter table email_events         enable row level security;

-- Public read policies
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

-- Authenticated (admin) full access
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
