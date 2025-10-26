-- ============================================================================
-- SAVED CONTENT LIBRARY
-- ============================================================================
-- Description: Allows users to save frequently used content snippets like
-- bank details, company info, payment terms, clauses, and images

CREATE TABLE saved_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'bank_details',
    'company_info',
    'payment_terms',
    'standard_clause',
    'image'
  )),
  metadata JSONB DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT usage_count_positive CHECK (usage_count >= 0)
);

-- Row Level Security
ALTER TABLE saved_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved content"
  ON saved_content FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved content"
  ON saved_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved content"
  ON saved_content FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved content"
  ON saved_content FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_saved_content_user_category ON saved_content(user_id, category);
CREATE INDEX idx_saved_content_favorites ON saved_content(user_id) WHERE is_favorite = true;

-- Trigger for updated_at
CREATE TRIGGER update_saved_content_updated_at BEFORE UPDATE ON saved_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE saved_content IS 'Reusable content snippets for quick insertion into proposals';
COMMENT ON COLUMN saved_content.category IS 'Type of content: bank_details, company_info, payment_terms, standard_clause, or image';
COMMENT ON COLUMN saved_content.usage_count IS 'Number of times this content has been inserted into proposals';
