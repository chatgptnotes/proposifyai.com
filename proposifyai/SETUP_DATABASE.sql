-- ProposifyAI Database Schema Migration
-- Version: 1.0.0
-- Date: 2025-10-26
-- Description: Initial schema for AI-powered proposal platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- PROFILES & AUTHENTICATION
-- ============================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'team_lead')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'professional', 'business', 'enterprise')),
  onboarding_completed BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- TEMPLATES
-- ============================================================================

CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'custom', -- bettroi-professional, bettroi-fashion, custom
  is_public BOOLEAN DEFAULT false,
  structure JSONB NOT NULL DEFAULT '{}',
  default_content JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  usage_count INTEGER DEFAULT 0,
  performance_score DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT usage_count_positive CHECK (usage_count >= 0),
  CONSTRAINT performance_score_range CHECK (performance_score >= 0.00 AND performance_score <= 1.00)
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON templates FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON templates FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- PROPOSALS
-- ============================================================================

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  content JSONB DEFAULT '{}',
  pricing JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  ai_confidence_score DECIMAL(3,2) DEFAULT 0.00,
  win_probability DECIMAL(3,2) DEFAULT 0.00,
  total_value DECIMAL(12,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ai_confidence_range CHECK (ai_confidence_score >= 0.00 AND ai_confidence_score <= 1.00),
  CONSTRAINT win_probability_range CHECK (win_probability >= 0.00 AND win_probability <= 1.00),
  CONSTRAINT total_value_positive CHECK (total_value >= 0.00)
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own proposals"
  ON proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create proposals"
  ON proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own proposals"
  ON proposals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own proposals"
  ON proposals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- CONTENT LIBRARY (with vector embeddings)
-- ============================================================================

CREATE TABLE content_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('case_study', 'testimonial', 'service_description', 'template_section', 'pricing_table')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI text-embedding-3-large
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  performance_score DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT usage_count_positive CHECK (usage_count >= 0),
  CONSTRAINT performance_score_range CHECK (performance_score >= 0.00 AND performance_score <= 1.00)
);

ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content"
  ON content_library FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create content"
  ON content_library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content"
  ON content_library FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content"
  ON content_library FOR DELETE
  USING (auth.uid() = user_id);

-- Vector similarity search index
CREATE INDEX content_library_embedding_idx ON content_library
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================================
-- CLIENT INTELLIGENCE
-- ============================================================================

CREATE TABLE client_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  company_data JSONB DEFAULT '{}',
  stakeholders JSONB DEFAULT '[]',
  competitors JSONB DEFAULT '[]',
  pain_points TEXT[] DEFAULT '{}',
  recent_news JSONB DEFAULT '[]',
  ai_insights TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 0.00,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT confidence_score_range CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00)
);

ALTER TABLE client_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view client intelligence for own proposals"
  ON client_intelligence FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = client_intelligence.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- ============================================================================
-- PROPOSAL ANALYTICS
-- ============================================================================

CREATE TABLE proposal_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('opened', 'section_viewed', 'time_spent', 'downloaded', 'shared', 'link_clicked')),
  event_data JSONB DEFAULT '{}',
  viewer_ip TEXT,
  viewer_location JSONB DEFAULT '{}',
  device_info JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE proposal_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics for own proposals"
  ON proposal_analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_analytics.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- Index for fast analytics queries
CREATE INDEX idx_analytics_proposal_timestamp ON proposal_analytics(proposal_id, timestamp DESC);

-- ============================================================================
-- AI INTERACTIONS (for tracking and billing)
-- ============================================================================

CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN (
    'content_gen', 'pricing_opt', 'research', 'voice', 'design',
    'analytics', 'compliance', 'predictive', 'agentic'
  )),
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  ai_model TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  latency_ms INTEGER,
  cost DECIMAL(10,4) DEFAULT 0.00,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT tokens_used_positive CHECK (tokens_used >= 0),
  CONSTRAINT cost_positive CHECK (cost >= 0.00)
);

ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI interactions"
  ON ai_interactions FOR SELECT
  USING (auth.uid() = user_id);

-- Index for usage analytics
CREATE INDEX idx_ai_interactions_user_date ON ai_interactions(user_id, created_at DESC);

-- ============================================================================
-- PRICING INTELLIGENCE
-- ============================================================================

CREATE TABLE pricing_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  suggested_price DECIMAL(12,2) NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  factors JSONB DEFAULT '{}',
  discount_analysis JSONB DEFAULT '{}',
  win_probability DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT suggested_price_positive CHECK (suggested_price >= 0.00),
  CONSTRAINT confidence_score_range CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
  CONSTRAINT win_probability_range CHECK (win_probability IS NULL OR (win_probability >= 0.00 AND win_probability <= 1.00))
);

ALTER TABLE pricing_intelligence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pricing intelligence for own proposals"
  ON pricing_intelligence FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = pricing_intelligence.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- ============================================================================
-- VOICE RECORDINGS
-- ============================================================================

CREATE TABLE voice_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
  audio_url TEXT NOT NULL,
  transcription TEXT,
  summary TEXT,
  extracted_requirements JSONB DEFAULT '{}',
  speaker_labels JSONB DEFAULT '[]',
  duration_seconds INTEGER,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT duration_positive CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
);

ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voice recordings"
  ON voice_recordings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create voice recordings"
  ON voice_recordings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- WORKFLOW AUTOMATIONS
-- ============================================================================

CREATE TABLE workflow_automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'proposal_created', 'proposal_sent', 'proposal_viewed',
    'proposal_accepted', 'proposal_rejected', 'scheduled'
  )),
  conditions JSONB DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT execution_count_positive CHECK (execution_count >= 0)
);

ALTER TABLE workflow_automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workflows"
  ON workflow_automations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- CRM INTEGRATIONS
-- ============================================================================

CREATE TABLE crm_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  crm_type TEXT NOT NULL CHECK (crm_type IN ('hubspot', 'salesforce', 'pipedrive', 'zoho', 'activecampaign')),
  credentials JSONB NOT NULL, -- Encrypted
  field_mappings JSONB DEFAULT '{}',
  sync_enabled BOOLEAN DEFAULT true,
  last_sync TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'idle' CHECK (sync_status IN ('idle', 'syncing', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, crm_type)
);

ALTER TABLE crm_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own CRM integrations"
  ON crm_integrations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- PROPOSAL COMMENTS (Team Collaboration)
-- ============================================================================

CREATE TABLE proposal_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  comment TEXT NOT NULL,
  section_id TEXT,
  parent_id UUID REFERENCES proposal_comments(id) ON DELETE CASCADE,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE proposal_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on accessible proposals"
  ON proposal_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_comments.proposal_id
    AND proposals.user_id = auth.uid()
  ));

CREATE POLICY "Users can create comments on accessible proposals"
  ON proposal_comments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_comments.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- ============================================================================
-- COMPLIANCE CHECKS
-- ============================================================================

CREATE TABLE compliance_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('gdpr', 'hipaa', 'legal_clauses', 'accessibility', 'brand_consistency')),
  status TEXT NOT NULL CHECK (status IN ('passed', 'warning', 'failed')),
  issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view compliance checks for own proposals"
  ON compliance_checks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = compliance_checks.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Proposals
CREATE INDEX idx_proposals_user_status ON proposals(user_id, status);
CREATE INDEX idx_proposals_created ON proposals(created_at DESC);
CREATE INDEX idx_proposals_user_created ON proposals(user_id, created_at DESC);

-- Full-text search on proposals
CREATE INDEX idx_proposals_search ON proposals
  USING GIN(to_tsvector('english', title || ' ' || COALESCE(client_name, '') || ' ' || COALESCE(client_company, '')));

-- Templates
CREATE INDEX idx_templates_user ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_templates_public ON templates(is_public) WHERE is_public = true;

-- Content library
CREATE INDEX idx_content_library_user ON content_library(user_id);
CREATE INDEX idx_content_library_type ON content_library(content_type);
CREATE INDEX idx_content_library_tags ON content_library USING GIN(tags);

-- AI interactions (for usage tracking)
CREATE INDEX idx_ai_interactions_user_type ON ai_interactions(user_id, interaction_type, created_at DESC);

-- Voice recordings
CREATE INDEX idx_voice_recordings_user ON voice_recordings(user_id, created_at DESC);
CREATE INDEX idx_voice_recordings_status ON voice_recordings(processing_status) WHERE processing_status != 'completed';

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_library_updated_at BEFORE UPDATE ON content_library
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_automations_updated_at BEFORE UPDATE ON workflow_automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_integrations_updated_at BEFORE UPDATE ON crm_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default templates (Bettroi Professional and Fashion)
INSERT INTO templates (name, description, category, is_public, structure) VALUES
  ('Bettroi Professional - Hairstyling', 'Professional template for hairstyling and beauty industry proposals', 'bettroi-professional', true, '{"sections": ["header", "client_details", "executive_summary", "scope_of_work", "features", "pricing", "timeline", "terms", "signatures"]}'),
  ('Bettroi Fashion - Try-On Platform', 'Fashion e-commerce and virtual try-on platform template', 'bettroi-fashion', true, '{"sections": ["header", "client_details", "executive_summary", "scope_of_work", "features", "pricing", "timeline", "terms", "signatures"]}');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles and subscription information';
COMMENT ON TABLE proposals IS 'Core proposals with AI-generated content and analytics';
COMMENT ON TABLE templates IS 'Proposal templates (Bettroi and custom)';
COMMENT ON TABLE content_library IS 'Reusable content with vector embeddings for semantic search';
COMMENT ON TABLE client_intelligence IS 'AI-gathered intelligence about clients and prospects';
COMMENT ON TABLE proposal_analytics IS 'Real-time tracking of proposal engagement';
COMMENT ON TABLE ai_interactions IS 'Log of all AI API calls for billing and analytics';
COMMENT ON TABLE pricing_intelligence IS 'AI-powered pricing recommendations';
COMMENT ON TABLE voice_recordings IS 'Voice-to-proposal recordings and transcriptions';
COMMENT ON TABLE workflow_automations IS 'User-defined automation rules';
COMMENT ON TABLE crm_integrations IS 'CRM integration credentials and settings';
COMMENT ON TABLE proposal_comments IS 'Team collaboration comments on proposals';
COMMENT ON TABLE compliance_checks IS 'Automated compliance and legal checks';
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
-- Auto-create profile trigger
-- This ensures that when a user signs up, a profile is automatically created

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, subscription_tier, onboarding_completed)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'free',
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
