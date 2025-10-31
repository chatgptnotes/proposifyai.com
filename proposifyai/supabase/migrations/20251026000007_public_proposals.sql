-- Public Proposal Viewing & Sharing
-- Version: 1.0.0
-- Date: 2025-10-26
-- Description: Add fields for public proposal viewing and tracking

-- Add public sharing fields to proposals table
ALTER TABLE proposals
ADD COLUMN IF NOT EXISTS share_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS share_password TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS public_url TEXT,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS accepted_by_name TEXT,
ADD COLUMN IF NOT EXISTS accepted_by_email TEXT,
ADD COLUMN IF NOT EXISTS rejected_reason TEXT;

-- Create index for share_id lookups
CREATE INDEX IF NOT EXISTS idx_proposals_share_id ON proposals(share_id) WHERE share_id IS NOT NULL;

-- Function to generate unique share ID
CREATE OR REPLACE FUNCTION generate_share_id()
RETURNS TEXT AS $$
DECLARE
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(characters, floor(random() * length(characters) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_proposal_view_count(p_proposal_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE proposals
  SET
    view_count = COALESCE(view_count, 0) + 1,
    last_viewed_at = NOW(),
    -- Update status to 'viewed' if currently 'sent'
    status = CASE
      WHEN status = 'sent' THEN 'viewed'
      ELSE status
    END
  WHERE id = p_proposal_id;
END;
$$ LANGUAGE plpgsql;

-- Create table for proposal view analytics
CREATE TABLE IF NOT EXISTS proposal_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,

  -- Viewer information
  viewer_ip TEXT,
  viewer_user_agent TEXT,
  viewer_location JSONB DEFAULT '{}',
  viewer_device JSONB DEFAULT '{}',

  -- View details
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_seconds INTEGER,
  sections_viewed TEXT[],
  referrer TEXT,

  -- Session tracking
  session_id TEXT,
  is_unique_view BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_proposal_views_proposal ON proposal_views(proposal_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposal_views_session ON proposal_views(session_id);

-- Row Level Security for proposal_views
-- Public can insert (for tracking), but only proposal owner can read
ALTER TABLE proposal_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can track views"
  ON proposal_views FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view analytics for own proposals"
  ON proposal_views FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_views.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- Create table for proposal actions (accept/reject tracking)
CREATE TABLE IF NOT EXISTS proposal_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,

  -- Action details
  action_type TEXT NOT NULL CHECK (action_type IN ('accepted', 'rejected', 'downloaded', 'shared', 'commented')),
  action_data JSONB DEFAULT '{}',

  -- Actor information
  actor_name TEXT,
  actor_email TEXT,
  actor_ip TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for actions
CREATE INDEX IF NOT EXISTS idx_proposal_actions_proposal ON proposal_actions(proposal_id, created_at DESC);

-- Row Level Security for proposal_actions
ALTER TABLE proposal_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create proposal actions"
  ON proposal_actions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view actions for own proposals"
  ON proposal_actions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM proposals
    WHERE proposals.id = proposal_actions.proposal_id
    AND proposals.user_id = auth.uid()
  ));

-- Function to handle proposal acceptance
CREATE OR REPLACE FUNCTION accept_proposal(
  p_proposal_id UUID,
  p_accepted_by_name TEXT,
  p_accepted_by_email TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE proposals
  SET
    status = 'accepted',
    accepted_at = NOW(),
    accepted_by_name = p_accepted_by_name,
    accepted_by_email = p_accepted_by_email
  WHERE id = p_proposal_id;

  -- Record action
  INSERT INTO proposal_actions (proposal_id, action_type, actor_name, actor_email)
  VALUES (p_proposal_id, 'accepted', p_accepted_by_name, p_accepted_by_email);
END;
$$ LANGUAGE plpgsql;

-- Function to handle proposal rejection
CREATE OR REPLACE FUNCTION reject_proposal(
  p_proposal_id UUID,
  p_rejected_by_name TEXT,
  p_rejected_by_email TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE proposals
  SET
    status = 'rejected',
    rejected_at = NOW(),
    rejected_reason = p_reason
  WHERE id = p_proposal_id;

  -- Record action
  INSERT INTO proposal_actions (
    proposal_id,
    action_type,
    actor_name,
    actor_email,
    action_data
  )
  VALUES (
    p_proposal_id,
    'rejected',
    p_rejected_by_name,
    p_rejected_by_email,
    jsonb_build_object('reason', p_reason)
  );
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE proposal_views IS 'Tracks all proposal views for analytics';
COMMENT ON TABLE proposal_actions IS 'Tracks proposal actions (accept, reject, download, etc.)';
COMMENT ON FUNCTION generate_share_id IS 'Generates a unique 12-character share ID for proposals';
COMMENT ON FUNCTION increment_proposal_view_count IS 'Increments view count and updates last viewed timestamp';
COMMENT ON FUNCTION accept_proposal IS 'Marks a proposal as accepted';
COMMENT ON FUNCTION reject_proposal IS 'Marks a proposal as rejected with optional reason';
