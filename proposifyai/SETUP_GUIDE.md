# ProposifyAI Setup Guide

## 🎯 Quick Setup Checklist

### ✅ Step 1: Supabase Configuration (DONE)
- [x] Supabase project created
- [x] Project ID: `xmwnlgnfljufviigrois`
- [x] .env.local file created
- [x] Service role key configured correctly
- [x] OpenAI API key configured

### ⏳ Step 2: Database Migrations (REQUIRED)

**Go to**: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/sql

#### Migration 1: Initial Schema
```sql
-- Copy and paste contents of:
supabase/migrations/20251026000001_initial_schema.sql

-- This creates:
-- - 14 tables (profiles, proposals, templates, etc.)
-- - Row Level Security policies
-- - Indexes for performance
-- - Triggers for auto-updates
```

#### Migration 2: Vector Search Function
```sql
-- Copy and paste contents of:
supabase/migrations/20251026000002_vector_search_function.sql

-- This creates:
-- - search_content_by_similarity() function
-- - Grants execute permissions
```

### ⏳ Step 3: OpenAI API Key (REQUIRED)

1. Get your API key from: https://platform.openai.com/api-keys
2. Open `.env.local` in your editor
3. Replace this line:
   ```
   OPENAI_API_KEY=your-openai-key-here
   ```
   With:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
   ```

### ⏳ Step 4: Fix Service Role Key (IMPORTANT)

Your current service role key appears to be the same as your anon key. Fix it:

1. Go to: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/settings/api
2. Look for "**service_role**" secret (not "anon public")
3. Click "Reveal" and copy the key
4. Update `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey... (your actual service role key)
   ```

---

## 🚀 Testing the Setup

### Test 1: Verify Environment Variables
```bash
cd /Users/murali/1\ imp\ backups/headz23oct25/proposalai
npm run dev
# Check console for any errors
```

### Test 2: Test Supabase Connection
```bash
# Create a test file
cat > test-supabase.js << 'EOF'
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('profiles').select('count')
  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    console.log('✅ Supabase connected! Profiles table exists.')
  }
}

test()
EOF

# Run test
node test-supabase.js
```

### Test 3: Test OpenAI Connection
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
# Should return list of models
```

### Test 4: Test AI Content Generation API
```bash
# First, sign up a user in your app
# Then get the JWT token
# Then test the API:

curl -X POST http://localhost:3000/api/ai/generate-content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "sectionType": "executive_summary",
    "clientContext": {
      "name": "Test Client",
      "company": "Test Corp",
      "industry": "Technology",
      "projectType": "Web Application"
    },
    "tone": "professional"
  }'
```

---

## 📊 Expected Database Tables

After running migrations, you should have these 14 tables:

1. ✅ `profiles` - User accounts
2. ✅ `templates` - Proposal templates
3. ✅ `proposals` - User proposals
4. ✅ `content_library` - Reusable content with embeddings
5. ✅ `client_intelligence` - AI-gathered client data
6. ✅ `proposal_analytics` - Engagement tracking
7. ✅ `ai_interactions` - AI usage logging
8. ✅ `pricing_intelligence` - Pricing recommendations
9. ✅ `voice_recordings` - Voice transcriptions
10. ✅ `workflow_automations` - User workflows
11. ✅ `crm_integrations` - CRM connections
12. ✅ `proposal_comments` - Team collaboration
13. ✅ `compliance_checks` - Legal validation

**Verify in Supabase**:
- Go to: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor
- You should see all 14 tables in the left sidebar

---

## 🔧 Troubleshooting

### Issue: "Missing environment variables"
**Solution**: Make sure `.env.local` exists and restart dev server
```bash
# Restart the dev server
npm run dev
```

### Issue: "Supabase connection failed"
**Solution**:
1. Check your Supabase URL and keys
2. Verify project is not paused
3. Check internet connection

### Issue: "OpenAI API error"
**Solution**:
1. Verify API key is correct (starts with `sk-proj-` or `sk-`)
2. Check you have credits in OpenAI account
3. Verify API key has correct permissions

### Issue: "Table doesn't exist"
**Solution**: Run the database migrations in Supabase SQL Editor

### Issue: "Unauthorized" when calling APIs
**Solution**: You need to sign up/login first to get a JWT token

---

## ✅ Setup Complete Checklist

- [ ] Supabase project created
- [ ] Database migrations run (both files)
- [ ] Service role key verified and updated
- [ ] OpenAI API key added to .env.local
- [ ] Dev server running without errors
- [ ] All 14 tables visible in Supabase
- [ ] Can sign up a user
- [ ] Can call AI generation API

---

## 🎉 Once Setup is Complete

You'll be able to:

1. **Generate AI Proposals**
   - Executive summaries
   - Scope of work
   - Pricing breakdowns
   - Timelines
   - Terms & conditions

2. **Search Content Library**
   - Semantic search using vector embeddings
   - Find relevant case studies
   - Discover similar content

3. **Manage Proposals**
   - Create new proposals
   - Edit and update
   - Track status
   - Delete old drafts

4. **Ready for UI Development**
   - Dashboard
   - Proposal editor
   - Analytics

---

## 📞 Need Help?

**Common URLs**:
- Supabase Dashboard: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois
- Supabase SQL Editor: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/sql
- Supabase API Settings: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/settings/api
- OpenAI API Keys: https://platform.openai.com/api-keys

**Documentation**:
- Supabase Docs: https://supabase.com/docs
- OpenAI API Docs: https://platform.openai.com/docs
- Project README: See project root

---

*Last Updated: October 26, 2025*
*Project: ProposifyAI.com*
*By: DRMHOPE Software*
