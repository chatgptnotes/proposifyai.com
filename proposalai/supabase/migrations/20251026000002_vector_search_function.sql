-- Vector Similarity Search Function
-- Searches content library using cosine similarity

CREATE OR REPLACE FUNCTION search_content_by_similarity(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  filter_user_id UUID
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  content_type TEXT,
  similarity FLOAT,
  metadata JSONB,
  tags TEXT[],
  performance_score DECIMAL(3,2),
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    content_library.id,
    content_library.title,
    content_library.content,
    content_library.content_type,
    1 - (content_library.embedding <=> query_embedding) AS similarity,
    content_library.metadata,
    content_library.tags,
    content_library.performance_score,
    content_library.created_at
  FROM content_library
  WHERE
    content_library.user_id = filter_user_id
    AND 1 - (content_library.embedding <=> query_embedding) > match_threshold
  ORDER BY content_library.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_content_by_similarity TO authenticated;

COMMENT ON FUNCTION search_content_by_similarity IS 'Semantic search for content library using vector embeddings';
