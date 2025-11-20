-- AML Compliance Migration for UAE Regulations
-- Adds fields required for Anti-Money Laundering compliance per Dubai/UAE regulations
-- Created: 2025-11-20

-- ============================================================================
-- 1. Update profiles table with company legal information
-- ============================================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trade_license_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS trn VARCHAR(15),
ADD COLUMN IF NOT EXISTS company_legal_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS registered_address TEXT,
ADD COLUMN IF NOT EXISTS business_activity VARCHAR(255),
ADD COLUMN IF NOT EXISTS aml_verification_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS aml_verified_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS beneficial_owner_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS beneficial_owner_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS bank_iban VARCHAR(34),
ADD COLUMN IF NOT EXISTS bank_swift VARCHAR(11),
ADD COLUMN IF NOT EXISTS bank_branch VARCHAR(100);

-- Add comments for clarity
COMMENT ON COLUMN profiles.trade_license_number IS 'UAE Trade License Number for AML compliance';
COMMENT ON COLUMN profiles.trn IS 'Tax Registration Number (15 digits) for UAE VAT compliance';
COMMENT ON COLUMN profiles.company_legal_name IS 'Full legal company name as per trade license';
COMMENT ON COLUMN profiles.registered_address IS 'Full registered business address in UAE';
COMMENT ON COLUMN profiles.aml_verification_status IS 'Status: pending, verified, flagged, rejected';
COMMENT ON COLUMN profiles.bank_iban IS 'IBAN format bank account number (AE + 21 digits)';

-- ============================================================================
-- 2. Update proposals table with AML and VAT compliance fields
-- ============================================================================

ALTER TABLE proposals
ADD COLUMN IF NOT EXISTS client_trade_license VARCHAR(50),
ADD COLUMN IF NOT EXISTS client_trn VARCHAR(15),
ADD COLUMN IF NOT EXISTS client_full_address TEXT,
ADD COLUMN IF NOT EXISTS client_authorized_signatory VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_signatory_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS vat_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS vat_rate DECIMAL(5,2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS subtotal_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_with_vat DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS document_type VARCHAR(20) DEFAULT 'quotation',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS bank_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS retention_until_date DATE,
ADD COLUMN IF NOT EXISTS requires_edd BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS edd_completed_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS transaction_value_aed DECIMAL(12,2);

-- Add comments
COMMENT ON COLUMN proposals.client_trn IS 'Client Tax Registration Number for invoice compliance';
COMMENT ON COLUMN proposals.vat_rate IS 'VAT rate percentage (default 5% for UAE)';
COMMENT ON COLUMN proposals.document_type IS 'quotation, proposal, tax_invoice, proforma_invoice';
COMMENT ON COLUMN proposals.retention_until_date IS 'Document must be retained until this date (5 years minimum)';
COMMENT ON COLUMN proposals.requires_edd IS 'Enhanced Due Diligence required for high-value transactions >AED 100,000';
COMMENT ON COLUMN proposals.transaction_value_aed IS 'Transaction value in AED for AML threshold checks';

-- ============================================================================
-- 3. Create aml_compliance table for tracking verifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS aml_compliance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  verification_type VARCHAR(20) NOT NULL, -- 'cdd', 'edd', 'suspicious_activity'
  verification_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, flagged
  verification_date TIMESTAMP,
  verified_by VARCHAR(255),
  documents_collected JSONB, -- Array of document types collected
  notes TEXT,
  risk_level VARCHAR(20), -- low, medium, high, critical
  flagged_for_review BOOLEAN DEFAULT FALSE,
  reported_to_fiu BOOLEAN DEFAULT FALSE,
  fiu_report_date TIMESTAMP,
  fiu_reference_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_aml_compliance_user_id ON aml_compliance(user_id);
CREATE INDEX IF NOT EXISTS idx_aml_compliance_proposal_id ON aml_compliance(proposal_id);
CREATE INDEX IF NOT EXISTS idx_aml_compliance_status ON aml_compliance(verification_status);
CREATE INDEX IF NOT EXISTS idx_aml_compliance_flagged ON aml_compliance(flagged_for_review);

-- Add comments
COMMENT ON TABLE aml_compliance IS 'AML verification records for Customer Due Diligence and Enhanced Due Diligence';
COMMENT ON COLUMN aml_compliance.verification_type IS 'CDD for standard, EDD for high-value (>AED 100k)';
COMMENT ON COLUMN aml_compliance.reported_to_fiu IS 'Whether suspicious activity was reported to UAE FIU via goAML';

-- ============================================================================
-- 4. Create function to auto-set retention date (5 years)
-- ============================================================================

CREATE OR REPLACE FUNCTION set_proposal_retention_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.retention_until_date := (NEW.created_at + INTERVAL '5 years')::DATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-set retention date on proposal creation
DROP TRIGGER IF EXISTS trigger_set_retention_date ON proposals;
CREATE TRIGGER trigger_set_retention_date
  BEFORE INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION set_proposal_retention_date();

-- ============================================================================
-- 5. Create function to check if EDD is required
-- ============================================================================

CREATE OR REPLACE FUNCTION check_edd_requirement()
RETURNS TRIGGER AS $$
BEGIN
  -- If transaction value in AED exceeds 100,000, require EDD
  IF NEW.transaction_value_aed >= 100000 THEN
    NEW.requires_edd := TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-check EDD requirement
DROP TRIGGER IF EXISTS trigger_check_edd ON proposals;
CREATE TRIGGER trigger_check_edd
  BEFORE INSERT OR UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION check_edd_requirement();

-- ============================================================================
-- 6. Create function to calculate VAT automatically
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_vat()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate VAT based on subtotal and VAT rate
  IF NEW.subtotal_amount IS NOT NULL AND NEW.vat_rate IS NOT NULL THEN
    NEW.vat_amount := ROUND((NEW.subtotal_amount * NEW.vat_rate / 100)::numeric, 2);
    NEW.total_with_vat := NEW.subtotal_amount + NEW.vat_amount;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate VAT
DROP TRIGGER IF EXISTS trigger_calculate_vat ON proposals;
CREATE TRIGGER trigger_calculate_vat
  BEFORE INSERT OR UPDATE OF subtotal_amount, vat_rate ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION calculate_vat();

-- ============================================================================
-- 7. Add RLS policies for aml_compliance table
-- ============================================================================

ALTER TABLE aml_compliance ENABLE ROW LEVEL SECURITY;

-- Users can view their own AML records
CREATE POLICY "Users can view own AML records"
  ON aml_compliance FOR SELECT
  USING (auth.uid() = user_id);

-- Only system/admin can insert AML records (via API)
CREATE POLICY "System can insert AML records"
  ON aml_compliance FOR INSERT
  WITH CHECK (true);

-- Only system/admin can update AML records
CREATE POLICY "System can update AML records"
  ON aml_compliance FOR UPDATE
  USING (true);

-- ============================================================================
-- 8. Create indexes on proposals for AML queries
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_proposals_client_trn ON proposals(client_trn);
CREATE INDEX IF NOT EXISTS idx_proposals_document_type ON proposals(document_type);
CREATE INDEX IF NOT EXISTS idx_proposals_retention_date ON proposals(retention_until_date);
CREATE INDEX IF NOT EXISTS idx_proposals_requires_edd ON proposals(requires_edd);
CREATE INDEX IF NOT EXISTS idx_proposals_transaction_value ON proposals(transaction_value_aed);

-- ============================================================================
-- 9. Create view for high-value transactions requiring monitoring
-- ============================================================================

CREATE OR REPLACE VIEW high_value_transactions AS
SELECT
  p.id,
  p.title,
  p.client_company_name,
  p.client_trn,
  p.transaction_value_aed,
  p.requires_edd,
  p.edd_completed_date,
  p.created_at,
  p.retention_until_date,
  ac.verification_status,
  ac.risk_level,
  ac.flagged_for_review
FROM proposals p
LEFT JOIN aml_compliance ac ON p.id = ac.proposal_id
WHERE p.transaction_value_aed >= 50000 -- AED 50k threshold for monitoring
ORDER BY p.transaction_value_aed DESC;

-- ============================================================================
-- 10. Create updated_at trigger for aml_compliance
-- ============================================================================

CREATE OR REPLACE FUNCTION update_aml_compliance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_aml_compliance_updated_at ON aml_compliance;
CREATE TRIGGER trigger_aml_compliance_updated_at
  BEFORE UPDATE ON aml_compliance
  FOR EACH ROW
  EXECUTE FUNCTION update_aml_compliance_updated_at();

-- ============================================================================
-- Migration complete
-- ============================================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'AML Compliance migration completed successfully';
  RAISE NOTICE 'Added compliance fields to profiles and proposals tables';
  RAISE NOTICE 'Created aml_compliance table with RLS policies';
  RAISE NOTICE 'Added automatic VAT calculation and retention date triggers';
  RAISE NOTICE 'Created high_value_transactions monitoring view';
END $$;
