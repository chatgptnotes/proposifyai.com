-- ProposifyAI Database Schema Migration
-- This migration creates all tables, indexes, and RLS policies for the proposal management platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    company_name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- WORKSPACES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    logo_url TEXT,
    brand_colors JSONB DEFAULT '{"primary": "#3B82F6", "secondary": "#10B981", "accent": "#8B5CF6"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Policies for workspaces
CREATE POLICY "Users can view their own workspaces"
    ON workspaces FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can create workspaces"
    ON workspaces FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can update their workspaces"
    ON workspaces FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Workspace owners can delete their workspaces"
    ON workspaces FOR DELETE
    USING (auth.uid() = owner_id);

-- =====================================================
-- PROPOSALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'declined')),
    content JSONB DEFAULT '{"sections": []}'::jsonb,
    total_amount NUMERIC(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    signed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_proposals_workspace_id ON proposals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_proposals_created_by ON proposals(created_by);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_client_email ON proposals(client_email);

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Policies for proposals
CREATE POLICY "Users can view proposals in their workspaces"
    ON proposals FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = proposals.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Proposal recipients can view sent proposals"
    ON proposals FOR SELECT
    USING (
        status IN ('sent', 'viewed', 'signed', 'declined')
        AND client_email IS NOT NULL
    );

CREATE POLICY "Users can create proposals in their workspaces"
    ON proposals FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = proposals.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
        AND auth.uid() = created_by
    );

CREATE POLICY "Users can update proposals in their workspaces"
    ON proposals FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = proposals.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete proposals in their workspaces"
    ON proposals FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = proposals.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

-- =====================================================
-- TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    content JSONB DEFAULT '{"sections": []}'::jsonb,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_templates_workspace_id ON templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policies for templates
CREATE POLICY "Users can view templates in their workspaces"
    ON templates FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = templates.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
        OR is_public = true
    );

CREATE POLICY "Users can create templates in their workspaces"
    ON templates FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = templates.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
        AND auth.uid() = created_by
    );

CREATE POLICY "Users can update templates in their workspaces"
    ON templates FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = templates.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete templates in their workspaces"
    ON templates FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = templates.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

-- =====================================================
-- CONTENT_BLOCKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'pricing_table')),
    tags TEXT[] DEFAULT '{}',
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_blocks_workspace_id ON content_blocks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_created_by ON content_blocks(created_by);
CREATE INDEX IF NOT EXISTS idx_content_blocks_type ON content_blocks(type);
CREATE INDEX IF NOT EXISTS idx_content_blocks_tags ON content_blocks USING GIN(tags);

-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Policies for content_blocks
CREATE POLICY "Users can view content blocks in their workspaces"
    ON content_blocks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = content_blocks.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create content blocks in their workspaces"
    ON content_blocks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = content_blocks.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
        AND auth.uid() = created_by
    );

CREATE POLICY "Users can update content blocks in their workspaces"
    ON content_blocks FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = content_blocks.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete content blocks in their workspaces"
    ON content_blocks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = content_blocks.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

-- =====================================================
-- PRICING_TABLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pricing_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Pricing',
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12, 2) DEFAULT 0,
    tax NUMERIC(12, 2) DEFAULT 0,
    discount NUMERIC(12, 2) DEFAULT 0,
    total NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pricing_tables_proposal_id ON pricing_tables(proposal_id);

-- Enable RLS
ALTER TABLE pricing_tables ENABLE ROW LEVEL SECURITY;

-- Policies for pricing_tables
CREATE POLICY "Users can view pricing tables for proposals in their workspaces"
    ON pricing_tables FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM proposals
            JOIN workspaces ON workspaces.id = proposals.workspace_id
            WHERE proposals.id = pricing_tables.proposal_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Proposal recipients can view pricing tables"
    ON pricing_tables FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM proposals
            WHERE proposals.id = pricing_tables.proposal_id
            AND proposals.status IN ('sent', 'viewed', 'signed', 'declined')
        )
    );

CREATE POLICY "Users can create pricing tables for proposals in their workspaces"
    ON pricing_tables FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM proposals
            JOIN workspaces ON workspaces.id = proposals.workspace_id
            WHERE proposals.id = pricing_tables.proposal_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update pricing tables for proposals in their workspaces"
    ON pricing_tables FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM proposals
            JOIN workspaces ON workspaces.id = proposals.workspace_id
            WHERE proposals.id = pricing_tables.proposal_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete pricing tables for proposals in their workspaces"
    ON pricing_tables FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM proposals
            JOIN workspaces ON workspaces.id = proposals.workspace_id
            WHERE proposals.id = pricing_tables.proposal_id
            AND workspaces.owner_id = auth.uid()
        )
    );

-- =====================================================
-- ANALYTICS_EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('viewed', 'section_viewed', 'time_spent', 'link_clicked', 'downloaded')),
    event_data JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_proposal_id ON analytics_events(proposal_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_events
CREATE POLICY "Users can view analytics for proposals in their workspaces"
    ON analytics_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM proposals
            JOIN workspaces ON workspaces.id = proposals.workspace_id
            WHERE proposals.id = analytics_events.proposal_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create analytics events for sent proposals"
    ON analytics_events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM proposals
            WHERE proposals.id = analytics_events.proposal_id
            AND proposals.status IN ('sent', 'viewed', 'signed', 'declined')
        )
    );

-- =====================================================
-- AI_GENERATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    model TEXT NOT NULL DEFAULT 'gpt-4',
    tokens_used INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_generations_workspace_id ON ai_generations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_by ON ai_generations(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at DESC);

-- Enable RLS
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Policies for ai_generations
CREATE POLICY "Users can view AI generations in their workspaces"
    ON ai_generations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = ai_generations.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can create AI generations in their workspaces"
    ON ai_generations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = ai_generations.workspace_id
            AND workspaces.owner_id = auth.uid()
        )
        AND auth.uid() = created_by
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
    BEFORE UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at
    BEFORE UPDATE ON content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_tables_updated_at
    BEFORE UPDATE ON pricing_tables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create a default workspace when a profile is created
CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO workspaces (name, owner_id)
    VALUES (
        COALESCE(NEW.company_name, NEW.full_name || '''s Workspace', 'My Workspace'),
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default workspace
CREATE TRIGGER on_profile_created
    AFTER INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_default_workspace();

-- Function to update proposal total when pricing table changes
CREATE OR REPLACE FUNCTION update_proposal_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE proposals
    SET total_amount = NEW.total
    WHERE id = NEW.proposal_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update proposal total
CREATE TRIGGER update_proposal_total_on_pricing_change
    AFTER INSERT OR UPDATE ON pricing_tables
    FOR EACH ROW
    EXECUTE FUNCTION update_proposal_total();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for proposal analytics summary
CREATE OR REPLACE VIEW proposal_analytics AS
SELECT
    p.id,
    p.title,
    p.client_name,
    p.status,
    p.created_at,
    p.sent_at,
    p.viewed_at,
    p.signed_at,
    COUNT(DISTINCT CASE WHEN ae.event_type = 'viewed' THEN ae.id END) as view_count,
    COUNT(DISTINCT CASE WHEN ae.event_type = 'section_viewed' THEN ae.id END) as section_views,
    SUM(CASE WHEN ae.event_type = 'time_spent' THEN (ae.event_data->>'duration')::int ELSE 0 END) as total_time_spent
FROM proposals p
LEFT JOIN analytics_events ae ON ae.proposal_id = p.id
GROUP BY p.id, p.title, p.client_name, p.status, p.created_at, p.sent_at, p.viewed_at, p.signed_at;

-- View for workspace statistics
CREATE OR REPLACE VIEW workspace_stats AS
SELECT
    w.id,
    w.name,
    COUNT(DISTINCT p.id) as total_proposals,
    COUNT(DISTINCT CASE WHEN p.status = 'draft' THEN p.id END) as draft_proposals,
    COUNT(DISTINCT CASE WHEN p.status = 'sent' THEN p.id END) as sent_proposals,
    COUNT(DISTINCT CASE WHEN p.status = 'signed' THEN p.id END) as signed_proposals,
    COUNT(DISTINCT t.id) as total_templates,
    COUNT(DISTINCT cb.id) as total_content_blocks,
    SUM(CASE WHEN p.status = 'signed' THEN p.total_amount ELSE 0 END) as total_revenue
FROM workspaces w
LEFT JOIN proposals p ON p.workspace_id = w.id
LEFT JOIN templates t ON t.workspace_id = w.id
LEFT JOIN content_blocks cb ON cb.workspace_id = w.id
GROUP BY w.id, w.name;

-- =====================================================
-- SAMPLE DATA (Optional - commented out)
-- =====================================================

-- Uncomment below to insert sample data for testing
/*
-- Insert sample profile (must match auth.users)
-- INSERT INTO profiles (id, email, full_name, company_name, role)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'demo@proposify.ai', 'Demo User', 'Demo Company', 'admin');
*/
