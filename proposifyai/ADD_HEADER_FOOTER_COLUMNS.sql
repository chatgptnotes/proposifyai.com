-- ============================================================================
-- QUICK SQL: Add Header & Footer Customization to Profiles Table
-- ============================================================================
-- Run this in Supabase SQL Editor to add header/footer columns
-- These columns store customization data linked to user_id via the profiles table
-- ============================================================================

-- HEADER CUSTOMIZATION COLUMNS
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS header_logo TEXT,
ADD COLUMN IF NOT EXISTS header_client_logo TEXT,
ADD COLUMN IF NOT EXISTS header_show_client_logo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS header_company_name TEXT,
ADD COLUMN IF NOT EXISTS header_tagline TEXT,
ADD COLUMN IF NOT EXISTS header_bg_color TEXT DEFAULT '#DC2626',
ADD COLUMN IF NOT EXISTS header_text_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS header_layout TEXT DEFAULT 'horizontal' CHECK (header_layout IN ('horizontal', 'vertical')),
ADD COLUMN IF NOT EXISTS header_show_contact BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS header_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS header_contact_email TEXT,
ADD COLUMN IF NOT EXISTS header_contact_website TEXT,
ADD COLUMN IF NOT EXISTS header_contact_address TEXT;

-- FOOTER CUSTOMIZATION COLUMNS
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS footer_text TEXT,
ADD COLUMN IF NOT EXISTS footer_bg_color TEXT DEFAULT '#1F2937',
ADD COLUMN IF NOT EXISTS footer_text_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS footer_font_size INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS footer_alignment TEXT DEFAULT 'center' CHECK (footer_alignment IN ('left', 'center', 'right')),
ADD COLUMN IF NOT EXISTS footer_show_border BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS footer_border_color TEXT DEFAULT '#DC2626';

-- ============================================================================
-- DONE! ✓
-- ============================================================================
-- Your profiles table now has all the header & footer customization columns
-- Each user's customization is automatically linked via their user_id (profile id)
--
-- Example query to view a user's header/footer settings:
-- SELECT
--   id as user_id,
--   header_company_name,
--   header_tagline,
--   header_bg_color,
--   footer_text,
--   footer_bg_color
-- FROM profiles
-- WHERE id = 'YOUR_USER_ID';
-- ============================================================================
