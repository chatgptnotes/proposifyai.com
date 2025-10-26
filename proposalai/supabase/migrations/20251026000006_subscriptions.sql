-- ProposifyAI Subscriptions & Billing Schema
-- Version: 1.0.0
-- Date: 2025-10-26
-- Description: Stripe subscription management and usage tracking

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Stripe information
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Subscription details
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'professional', 'business', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),

  -- Dates
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one active subscription per user
  UNIQUE(user_id)
);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for Stripe lookups
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);

-- ============================================================================
-- USAGE TRACKING TABLE
-- ============================================================================

CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Usage counters (reset monthly)
  proposals_created INTEGER DEFAULT 0,
  ai_generations INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,

  -- Period tracking
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT proposals_created_positive CHECK (proposals_created >= 0),
  CONSTRAINT ai_generations_positive CHECK (ai_generations >= 0),
  CONSTRAINT emails_sent_positive CHECK (emails_sent >= 0)
);

-- Row Level Security
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

-- Index for usage queries
CREATE INDEX idx_usage_tracking_user_period ON usage_tracking(user_id, period_start, period_end);

-- ============================================================================
-- SUBSCRIPTION TIER LIMITS (Configuration)
-- ============================================================================

CREATE TABLE subscription_tier_limits (
  tier TEXT PRIMARY KEY CHECK (tier IN ('free', 'professional', 'business', 'enterprise')),

  -- Limits
  max_proposals_per_month INTEGER,
  max_ai_generations_per_month INTEGER,
  max_emails_per_month INTEGER,
  max_team_members INTEGER,

  -- Features
  features JSONB DEFAULT '{}',

  -- Pricing (for display)
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make tier limits public (read-only)
ALTER TABLE subscription_tier_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tier limits"
  ON subscription_tier_limits FOR SELECT
  TO public
  USING (true);

-- Insert default tier limits
INSERT INTO subscription_tier_limits (tier, max_proposals_per_month, max_ai_generations_per_month, max_emails_per_month, max_team_members, features, price_monthly, price_yearly) VALUES
  ('free', 3, 10, 5, 1,
   '{"templates": "basic", "analytics": false, "crm_integration": false, "team_collaboration": false, "custom_branding": false}',
   0.00, 0.00),

  ('professional', NULL, 100, 50, 5,
   '{"templates": "all", "analytics": true, "crm_integration": "1_platform", "team_collaboration": true, "custom_branding": false, "ai_coaching": false}',
   49.00, 470.00),

  ('business', NULL, 500, 200, 20,
   '{"templates": "all", "analytics": "advanced", "crm_integration": "3_platforms", "team_collaboration": true, "custom_branding": true, "ai_coaching": true, "approval_workflows": true}',
   149.00, 1430.00),

  ('enterprise', NULL, NULL, NULL, NULL,
   '{"templates": "all", "analytics": "advanced", "crm_integration": "unlimited", "team_collaboration": true, "custom_branding": true, "ai_coaching": true, "approval_workflows": true, "white_label": true, "sso": true, "dedicated_support": true}',
   NULL, NULL);

-- ============================================================================
-- PAYMENT HISTORY TABLE
-- ============================================================================

CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Stripe information
  stripe_invoice_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,

  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),

  -- Description
  description TEXT,
  invoice_url TEXT,
  invoice_pdf TEXT,

  -- Dates
  paid_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT amount_positive CHECK (amount >= 0)
);

-- Row Level Security
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- Index for payment queries
CREATE INDEX idx_payment_history_user ON payment_history(user_id, created_at DESC);
CREATE INDEX idx_payment_history_stripe_invoice ON payment_history(stripe_invoice_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user has reached usage limit
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_usage_type TEXT -- 'proposals', 'ai_generations', 'emails'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier TEXT;
  v_limit INTEGER;
  v_current_usage INTEGER;
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
BEGIN
  -- Get user's subscription tier
  SELECT s.tier INTO v_tier
  FROM subscriptions s
  WHERE s.user_id = p_user_id AND s.status = 'active'
  LIMIT 1;

  -- Default to free tier if no subscription found
  IF v_tier IS NULL THEN
    v_tier := 'free';
  END IF;

  -- Get tier limit
  IF p_usage_type = 'proposals' THEN
    SELECT max_proposals_per_month INTO v_limit
    FROM subscription_tier_limits
    WHERE tier = v_tier;
  ELSIF p_usage_type = 'ai_generations' THEN
    SELECT max_ai_generations_per_month INTO v_limit
    FROM subscription_tier_limits
    WHERE tier = v_tier;
  ELSIF p_usage_type = 'emails' THEN
    SELECT max_emails_per_month INTO v_limit
    FROM subscription_tier_limits
    WHERE tier = v_tier;
  END IF;

  -- NULL limit means unlimited
  IF v_limit IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Get current period
  v_period_start := date_trunc('month', NOW());
  v_period_end := v_period_start + INTERVAL '1 month';

  -- Get current usage
  IF p_usage_type = 'proposals' THEN
    SELECT COALESCE(proposals_created, 0) INTO v_current_usage
    FROM usage_tracking
    WHERE user_id = p_user_id
      AND period_start = v_period_start
      AND period_end = v_period_end;
  ELSIF p_usage_type = 'ai_generations' THEN
    SELECT COALESCE(ai_generations, 0) INTO v_current_usage
    FROM usage_tracking
    WHERE user_id = p_user_id
      AND period_start = v_period_start
      AND period_end = v_period_end;
  ELSIF p_usage_type = 'emails' THEN
    SELECT COALESCE(emails_sent, 0) INTO v_current_usage
    FROM usage_tracking
    WHERE user_id = p_user_id
      AND period_start = v_period_start
      AND period_end = v_period_end;
  END IF;

  -- Default to 0 if no record found
  v_current_usage := COALESCE(v_current_usage, 0);

  -- Return true if under limit
  RETURN v_current_usage < v_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_usage_type TEXT, -- 'proposals', 'ai_generations', 'emails'
  p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  v_period_start TIMESTAMPTZ;
  v_period_end TIMESTAMPTZ;
BEGIN
  v_period_start := date_trunc('month', NOW());
  v_period_end := v_period_start + INTERVAL '1 month';

  -- Insert or update usage tracking
  IF p_usage_type = 'proposals' THEN
    INSERT INTO usage_tracking (user_id, period_start, period_end, proposals_created)
    VALUES (p_user_id, v_period_start, v_period_end, p_increment)
    ON CONFLICT (user_id, period_start)
    DO UPDATE SET proposals_created = usage_tracking.proposals_created + p_increment;

  ELSIF p_usage_type = 'ai_generations' THEN
    INSERT INTO usage_tracking (user_id, period_start, period_end, ai_generations)
    VALUES (p_user_id, v_period_start, v_period_end, p_increment)
    ON CONFLICT (user_id, period_start)
    DO UPDATE SET ai_generations = usage_tracking.ai_generations + p_increment;

  ELSIF p_usage_type = 'emails' THEN
    INSERT INTO usage_tracking (user_id, period_start, period_end, emails_sent)
    VALUES (p_user_id, v_period_start, v_period_end, p_increment)
    ON CONFLICT (user_id, period_start)
    DO UPDATE SET emails_sent = usage_tracking.emails_sent + p_increment;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint for period tracking
ALTER TABLE usage_tracking ADD CONSTRAINT usage_tracking_user_period_unique UNIQUE (user_id, period_start);

-- Trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_tier_limits_updated_at BEFORE UPDATE ON subscription_tier_limits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE subscriptions IS 'User subscription and billing information synced with Stripe';
COMMENT ON TABLE usage_tracking IS 'Monthly usage tracking for enforcing tier limits';
COMMENT ON TABLE subscription_tier_limits IS 'Configuration for subscription tier features and limits';
COMMENT ON TABLE payment_history IS 'Historical record of all payments and invoices';
COMMENT ON FUNCTION check_usage_limit IS 'Check if user has reached their tier usage limit';
COMMENT ON FUNCTION increment_usage IS 'Increment usage counter for a user';
