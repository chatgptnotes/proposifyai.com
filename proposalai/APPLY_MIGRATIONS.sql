-- ============================================================================
-- ProposifyAI - Database Migrations
-- ============================================================================
-- Execute this entire file in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: SAVED CONTENT LIBRARY
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_content (
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

DROP POLICY IF EXISTS "Users can view own saved content" ON saved_content;
CREATE POLICY "Users can view own saved content"
  ON saved_content FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create saved content" ON saved_content;
CREATE POLICY "Users can create saved content"
  ON saved_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own saved content" ON saved_content;
CREATE POLICY "Users can update own saved content"
  ON saved_content FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved content" ON saved_content;
CREATE POLICY "Users can delete own saved content"
  ON saved_content FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_content_user_category ON saved_content(user_id, category);
CREATE INDEX IF NOT EXISTS idx_saved_content_favorites ON saved_content(user_id) WHERE is_favorite = true;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_saved_content_updated_at ON saved_content;
CREATE TRIGGER update_saved_content_updated_at BEFORE UPDATE ON saved_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION 2: FORMATTING PREFERENCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS formatting_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,

  -- Typography
  font_family TEXT DEFAULT 'Arial, Helvetica, sans-serif',
  font_size_base INTEGER DEFAULT 12 CHECK (font_size_base >= 8 AND font_size_base <= 24),
  font_size_heading_1 INTEGER DEFAULT 24 CHECK (font_size_heading_1 >= 16 AND font_size_heading_1 <= 48),
  font_size_heading_2 INTEGER DEFAULT 20 CHECK (font_size_heading_2 >= 14 AND font_size_heading_2 <= 36),
  font_size_heading_3 INTEGER DEFAULT 16 CHECK (font_size_heading_3 >= 12 AND font_size_heading_3 <= 28),
  line_height DECIMAL(3,2) DEFAULT 1.50 CHECK (line_height >= 1.00 AND line_height <= 3.00),
  letter_spacing DECIMAL(3,2) DEFAULT 0.00 CHECK (letter_spacing >= -0.50 AND letter_spacing <= 0.50),

  -- Colors
  primary_color TEXT DEFAULT '#DC2626',
  secondary_color TEXT DEFAULT '#000000',
  accent_color TEXT DEFAULT '#F3F4F6',
  text_color TEXT DEFAULT '#1F2937',
  heading_color TEXT DEFAULT '#111827',

  -- Spacing & Layout
  page_margin_top INTEGER DEFAULT 20 CHECK (page_margin_top >= 10 AND page_margin_top <= 50),
  page_margin_bottom INTEGER DEFAULT 20 CHECK (page_margin_bottom >= 10 AND page_margin_bottom <= 50),
  page_margin_left INTEGER DEFAULT 20 CHECK (page_margin_left >= 10 AND page_margin_left <= 50),
  page_margin_right INTEGER DEFAULT 20 CHECK (page_margin_right >= 10 AND page_margin_right <= 50),
  section_spacing INTEGER DEFAULT 30 CHECK (section_spacing >= 10 AND section_spacing <= 80),
  paragraph_spacing INTEGER DEFAULT 12 CHECK (paragraph_spacing >= 4 AND paragraph_spacing <= 40),

  -- Section Preferences
  include_cover_page BOOLEAN DEFAULT true,
  include_table_of_contents BOOLEAN DEFAULT true,
  include_executive_summary BOOLEAN DEFAULT true,
  include_project_overview BOOLEAN DEFAULT true,
  include_scope_of_work BOOLEAN DEFAULT true,
  include_methodology BOOLEAN DEFAULT false,
  include_timeline BOOLEAN DEFAULT true,
  include_team BOOLEAN DEFAULT false,
  include_pricing BOOLEAN DEFAULT true,
  include_terms_conditions BOOLEAN DEFAULT true,
  include_payment_schedule BOOLEAN DEFAULT false,
  include_case_studies BOOLEAN DEFAULT false,
  include_testimonials BOOLEAN DEFAULT false,
  include_appendix BOOLEAN DEFAULT false,

  -- Content Size Preferences
  executive_summary_length TEXT DEFAULT 'medium' CHECK (executive_summary_length IN ('short', 'medium', 'long')),
  project_overview_length TEXT DEFAULT 'medium' CHECK (project_overview_length IN ('short', 'medium', 'long')),
  scope_of_work_length TEXT DEFAULT 'detailed' CHECK (scope_of_work_length IN ('brief', 'detailed', 'comprehensive')),

  -- Header & Footer
  show_header BOOLEAN DEFAULT true,
  show_footer BOOLEAN DEFAULT true,
  header_content TEXT,
  footer_content TEXT,
  show_page_numbers BOOLEAN DEFAULT true,

  -- Styling Options
  border_style TEXT DEFAULT 'none' CHECK (border_style IN ('none', 'thin', 'medium', 'thick')),
  heading_style TEXT DEFAULT 'bold' CHECK (heading_style IN ('normal', 'bold', 'underline', 'bold-underline')),
  list_style TEXT DEFAULT 'bullet' CHECK (list_style IN ('bullet', 'number', 'dash', 'checkmark')),
  table_style TEXT DEFAULT 'bordered' CHECK (table_style IN ('borderless', 'bordered', 'striped', 'minimal')),

  -- Metadata
  is_company_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT user_or_proposal CHECK (
    (proposal_id IS NULL AND is_company_default = true) OR
    (proposal_id IS NOT NULL AND is_company_default = false)
  ),
  UNIQUE(user_id, proposal_id)
);

-- Row Level Security
ALTER TABLE formatting_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own formatting preferences" ON formatting_preferences;
CREATE POLICY "Users can view own formatting preferences"
  ON formatting_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create formatting preferences" ON formatting_preferences;
CREATE POLICY "Users can create formatting preferences"
  ON formatting_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own formatting preferences" ON formatting_preferences;
CREATE POLICY "Users can update own formatting preferences"
  ON formatting_preferences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own formatting preferences" ON formatting_preferences;
CREATE POLICY "Users can delete own formatting preferences"
  ON formatting_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_formatting_user_default ON formatting_preferences(user_id) WHERE is_company_default = true;
CREATE INDEX IF NOT EXISTS idx_formatting_user_proposal ON formatting_preferences(user_id, proposal_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_formatting_preferences_updated_at ON formatting_preferences;
CREATE TRIGGER update_formatting_preferences_updated_at BEFORE UPDATE ON formatting_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- AUTO-CREATE DEFAULT FORMATTING FOR NEW USERS
-- ============================================================================

DROP FUNCTION IF EXISTS create_default_formatting_preferences() CASCADE;
CREATE OR REPLACE FUNCTION create_default_formatting_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default company-wide formatting preferences for new users
  INSERT INTO formatting_preferences (
    user_id,
    is_company_default,
    font_family,
    primary_color,
    include_cover_page,
    include_table_of_contents,
    include_executive_summary,
    include_project_overview,
    include_scope_of_work,
    include_timeline,
    include_pricing,
    include_terms_conditions
  ) VALUES (
    NEW.id,
    true,
    'Arial, Helvetica, sans-serif',
    '#DC2626',
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true
  )
  ON CONFLICT (user_id, proposal_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_user_default_formatting ON profiles;
CREATE TRIGGER create_user_default_formatting
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_formatting_preferences();

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- The migrations have been applied successfully!
-- You can now refresh your application to use the new features.
-- ============================================================================
