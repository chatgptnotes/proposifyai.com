# Database Migration Instructions

## 🚨 IMPORTANT: Fix "Failed to fetch" Errors

The errors you're seeing in Settings (Saved Content and Formatting tabs) occur because the database tables don't exist yet. Follow these steps to fix them:

## Step-by-Step Instructions

### 1. Open Supabase SQL Editor
Click this link to open your Supabase SQL Editor:
**https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor**

### 2. Copy the Migration SQL
Open the file `APPLY_MIGRATIONS.sql` in this project folder and copy ALL the contents.

### 3. Paste and Execute
1. In the Supabase SQL Editor, paste the entire SQL content
2. Click the "RUN" button (or press Cmd/Ctrl + Enter)
3. Wait for the success message

### 4. Verify Tables Created
After running the SQL, you should see these new tables in your database:
- `saved_content`
- `formatting_preferences`

### 5. Refresh Your Application
1. Go back to your ProposifyAI application
2. Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Navigate to Settings → Saved Content
4. Navigate to Settings → Formatting

### 6. Test the Features
- Try adding a saved content item (e.g., bank details)
- Try changing formatting preferences (e.g., primary color)
- Click "Save" and verify no errors appear

## What the Migrations Do

### Migration 1: Saved Content Table
Creates a table to store reusable content snippets:
- Bank details
- Company information
- Payment terms
- Standard clauses
- Images/logos

### Migration 2: Formatting Preferences Table
Creates a table to store formatting settings:
- Typography (fonts, sizes, line height)
- Colors (primary, secondary, text, heading)
- Spacing (margins, sections, paragraphs)
- Section preferences (which sections to include)
- Content length preferences
- Styling options

### Auto-Created Features
- Row Level Security (RLS) policies for data protection
- Indexes for fast queries
- Triggers for automatic timestamp updates
- Auto-create default formatting for new users

## Troubleshooting

### If you see "function update_updated_at_column does not exist"
This function should exist from previous migrations. If not, add this before running the migrations:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### If you see "relation profiles does not exist"
Make sure you've run the initial schema migration first:
`supabase/migrations/20251026000001_initial_schema.sql`

### Still Having Issues?
1. Check the Supabase logs for detailed error messages
2. Verify you're logged into the correct Supabase project
3. Ensure you have admin/owner permissions on the project

## Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois
- **SQL Editor**: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor
- **Table Editor**: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor
- **Application**: https://proposifyai-dsfto2uwc-chatgptnotes-6366s-projects.vercel.app

## Need Help?

If migrations fail or you encounter issues, please:
1. Copy the error message from Supabase
2. Check which line number the error occurred on
3. The SQL is idempotent - it's safe to run multiple times

---

**After successful migration, your Settings pages will work perfectly!** ✨
