-- pgvector semantic search function
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
