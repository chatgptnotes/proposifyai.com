# Header & Footer Customization - Database Migration Guide

This guide will help you add header and footer customization columns to your Supabase database.

## 🎯 What This Adds

### Header Customization (11 columns)
- `header_logo` - Base64 encoded company logo
- `header_company_name` - Company name
- `header_tagline` - Company tagline/slogan
- `header_bg_color` - Background color (default: #DC2626)
- `header_text_color` - Text color (default: #FFFFFF)
- `header_layout` - Layout orientation (horizontal/vertical)
- `header_show_contact` - Show contact info (default: true)
- `header_contact_phone` - Phone number
- `header_contact_email` - Email address
- `header_contact_website` - Website URL
- `header_contact_address` - Physical address

### Footer Customization (7 columns)
- `footer_text` - Footer text content
- `footer_bg_color` - Background color (default: #1F2937)
- `footer_text_color` - Text color (default: #FFFFFF)
- `footer_font_size` - Font size in pixels (default: 12)
- `footer_alignment` - Text alignment (left/center/right)
- `footer_show_border` - Show top border (default: true)
- `footer_border_color` - Border color (default: #DC2626)

## 📋 Migration Methods

### Method 1: Using Supabase CLI (Recommended for Production)

```bash
# Navigate to your project directory
cd /Users/apple/Music/Poposifyai.com/proposifyai

# Apply the migration
supabase db push

# Or apply a specific migration
supabase migration up
```

### Method 2: Using Supabase SQL Editor (Quick & Easy)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `ADD_HEADER_FOOTER_COLUMNS.sql`
4. Copy all the SQL content
5. Paste it into the SQL Editor
6. Click **Run**

## 🔍 Verify Migration

After running the migration, verify it worked:

```sql
-- Check if columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name LIKE 'header_%' OR column_name LIKE 'footer_%'
ORDER BY column_name;
```

## 📊 Example Usage

### Save Header/Footer Data

The data is automatically saved when you click "Save Header & Footer Settings" button in the settings page. The API route at `/api/user/profile` handles this.

### Query User's Customization

```sql
-- Get specific user's header/footer settings
SELECT
  id as user_id,
  email,
  header_company_name,
  header_tagline,
  header_bg_color,
  header_text_color,
  footer_text,
  footer_bg_color,
  footer_alignment
FROM profiles
WHERE id = 'YOUR_USER_ID';
```

### Update Header/Footer via API

```javascript
// Frontend code (already implemented in settings page)
const response = await fetch('/api/user/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    header_logo: 'data:image/png;base64,...',
    header_company_name: 'DRMHOPE SOFTWARE',
    header_tagline: 'Empowering businesses with intelligent AI agents',
    header_bg_color: '#DC2626',
    header_text_color: '#FFFFFF',
    header_layout: 'horizontal',
    header_show_contact: true,
    header_contact_phone: '+91 937-3111-709',
    header_contact_email: 'murali@drmhope.com',
    header_contact_website: 'www.drmhope.com',
    header_contact_address: 'Nagpur, Maharashtra, India',
    footer_text: 'DRMHOPE SOFTWARE | Empowering businesses with intelligent AI agents',
    footer_bg_color: '#1F2937',
    footer_text_color: '#FFFFFF',
    footer_font_size: 12,
    footer_alignment: 'center',
    footer_show_border: true,
    footer_border_color: '#DC2626'
  })
});
```

## 🔐 Row Level Security (RLS)

The migration automatically inherits RLS policies from the `profiles` table:

- ✅ Users can only view their own header/footer settings
- ✅ Users can only update their own header/footer settings
- ✅ Data is automatically linked to `user_id` via the profiles table's `id` column

## 📁 Files Created

1. **`supabase/migrations/20251101000001_header_footer_customization.sql`**
   - Full migration file for Supabase CLI
   - Includes comments and documentation

2. **`ADD_HEADER_FOOTER_COLUMNS.sql`**
   - Quick copy-paste SQL for Supabase SQL Editor
   - Same functionality, simpler format

3. **`app/api/user/profile/route.ts`** (updated)
   - Now properly handles header/footer columns
   - Stores data in dedicated columns instead of JSONB preferences

## 🚀 Next Steps

After migration is complete:

1. ✅ Test the settings page at `http://localhost:3000/settings`
2. ✅ Upload a logo and customize header/footer
3. ✅ Click "Save Header & Footer Settings"
4. ✅ Verify data is saved by checking the database
5. ✅ Create a proposal to see header/footer in action

## 🐛 Troubleshooting

### Error: relation "profiles" does not exist
- Make sure you've run the initial schema migration first
- Check that you're connected to the correct Supabase project

### Error: column already exists
- The migration uses `IF NOT EXISTS`, so this shouldn't happen
- If it does, the columns are already there - you're good to go!

### Data not saving
- Check browser console for errors
- Verify the API route is working: `curl http://localhost:3000/api/user/profile`
- Check Supabase logs in the dashboard

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify your `.env.local` has correct Supabase credentials
4. Make sure you're authenticated (logged in)

---

**Migration Version**: 1.0.0
**Created**: 2025-11-01
**Database**: Supabase PostgreSQL
