# 🔧 Proposify AI - Manual Setup Guide

**Version:** 2.8.0
**Last Updated:** October 26, 2025

This guide contains the manual steps required to complete the Proposify AI setup after deployment.

---

## ⚠️ CRITICAL: These Steps Are Required

The application is deployed but requires manual configuration to be fully functional:

1. ✅ Database Migrations (Required for all features)
2. ✅ Email Service Setup (Required for sending proposals)
3. ✅ Environment Variables (Required for production)

**Estimated Time:** 15-20 minutes

---

## 1️⃣ Apply Database Migrations (5 minutes)

### Why This Is Required
The new Phase 1 features need additional database tables and functions that must be created manually.

### What Gets Created
- `proposal_views` table (for tracking analytics)
- `proposal_actions` table (for accept/reject history)
- Database functions: `generate_share_id()`, `accept_proposal()`, `reject_proposal()`, `increment_proposal_view_count()`
- Row Level Security policies

### Step-by-Step Instructions

#### Option A: Supabase Dashboard (Recommended)

1. **Open Supabase SQL Editor**
   ```
   Go to: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/sql
   ```

2. **Create New Query**
   - Click "+ New query" button in the SQL Editor

3. **Copy Migration SQL**
   - Open file: `supabase/migrations/20251026000007_public_proposals.sql`
   - Copy the entire contents (all 199 lines)

4. **Paste and Run**
   - Paste into the SQL Editor
   - Click "Run" button (⚡ icon) or press Cmd/Ctrl + Enter
   - Wait for "Success" message

5. **Verify Tables Created**
   Run this query to verify:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('proposal_views', 'proposal_actions');
   ```

   Expected result: Should show both tables

6. **Verify Functions Created**
   Run this query:
   ```sql
   SELECT routine_name
   FROM information_schema.routines
   WHERE routine_schema = 'public'
   AND routine_name IN ('generate_share_id', 'accept_proposal', 'reject_proposal', 'increment_proposal_view_count');
   ```

   Expected result: Should show all 4 functions

#### Option B: Supabase CLI (Alternative)

If you prefer using the CLI:

```bash
# Navigate to project directory
cd /Users/murali/1\ imp\ backups/headz23oct25/proposalai

# Link to Supabase project (requires database password)
supabase link --project-ref xmwnlgnfljufviigrois

# Push migrations
supabase db push

# Verify
supabase db diff
```

### ✅ Verification Checklist
- [ ] No errors when running migration
- [ ] `proposal_views` table exists
- [ ] `proposal_actions` table exists
- [ ] `generate_share_id()` function exists
- [ ] `accept_proposal()` function exists
- [ ] `reject_proposal()` function exists
- [ ] `increment_proposal_view_count()` function exists

---

## 2️⃣ Configure Email Service with Resend (10 minutes)

### Why This Is Required
The email sending functionality needs Resend API to work. Without this, users cannot:
- Send proposals via email
- Receive acceptance/rejection notifications
- Track email opens

### Step-by-Step Instructions

#### Step 1: Create Resend Account

1. **Sign Up**
   ```
   Go to: https://resend.com
   Click "Sign Up" or "Get Started"
   Use your business email
   ```

2. **Verify Email**
   - Check your inbox for verification email
   - Click verification link

#### Step 2: Add Your Domain

1. **Add Domain in Resend**
   ```
   Go to: https://resend.com/domains
   Click "Add Domain"
   Enter: proposifyai.com
   Click "Add"
   ```

2. **Get DNS Records**
   Resend will provide DNS records like:
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [long string provided by Resend]

   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@proposifyai.com
   ```

3. **Add DNS Records to Your Domain Registrar**

   **If using Namecheap:**
   ```
   1. Log in to Namecheap
   2. Go to Domain List → Manage
   3. Advanced DNS tab
   4. Add New Record
   5. Copy Type, Host, and Value from Resend
   6. Set TTL to Automatic
   7. Save
   ```

   **If using GoDaddy:**
   ```
   1. Log in to GoDaddy
   2. My Products → DNS
   3. Add → TXT
   4. Copy Name and Value from Resend
   5. Save
   ```

   **If using Cloudflare:**
   ```
   1. Log in to Cloudflare
   2. Select your domain
   3. DNS → Add record
   4. Type: TXT
   5. Copy Name and Content from Resend
   6. Save
   ```

4. **Verify Domain**
   ```
   Go back to Resend dashboard
   Wait 5-30 minutes for DNS propagation
   Click "Verify" next to your domain
   Status should change to "Verified" ✓
   ```

#### Step 3: Get API Key

1. **Create API Key**
   ```
   Go to: https://resend.com/api-keys
   Click "Create API Key"
   Name: "Proposify AI Production"
   Permission: "Sending access"
   Click "Create"
   ```

2. **Copy API Key**
   ```
   IMPORTANT: Copy the key immediately!
   It starts with: re_
   Example: re_123abc456def789ghi
   Store it securely - it won't be shown again
   ```

#### Step 4: Add to Vercel Environment Variables

1. **Open Vercel Settings**
   ```
   Go to: https://vercel.com/chatgptnotes-6366s-projects/proposifyai/settings/environment-variables
   ```

2. **Add Environment Variables**
   Click "Add New" for each:

   ```bash
   # Variable 1
   Name: RESEND_API_KEY
   Value: re_your_actual_api_key_here
   Environment: Production, Preview, Development

   # Variable 2
   Name: EMAIL_FROM
   Value: Proposify AI <proposals@proposifyai.com>
   Environment: Production, Preview, Development

   # Variable 3
   Name: EMAIL_REPLY_TO
   Value: support@proposifyai.com
   Environment: Production, Preview, Development

   # Variable 4 (if not already set)
   Name: NEXT_PUBLIC_APP_URL
   Value: https://proposifyai.com
   Environment: Production, Preview, Development
   ```

3. **Save Each Variable**
   - Click "Save" after adding each variable

#### Step 5: Redeploy Application

```bash
# From your terminal
cd /Users/murali/1\ imp\ backups/headz23oct25/proposalai

# Trigger redeployment with new environment variables
vercel --prod

# Or use Vercel dashboard:
# Go to Deployments → Three dots → Redeploy
```

### ✅ Verification Checklist
- [ ] Resend account created
- [ ] Domain added to Resend
- [ ] DNS records added to domain registrar
- [ ] Domain verified in Resend (shows green checkmark)
- [ ] API key created and copied
- [ ] All 4 environment variables added to Vercel
- [ ] Application redeployed

---

## 3️⃣ Test Email Functionality (5 minutes)

### Test Sending Email

1. **Create Test Proposal**
   ```
   Go to: https://proposifyai.com
   Log in
   Create a new proposal
   ```

2. **Send Proposal**
   ```
   Open the proposal
   Click "Send Email" or "Share"
   Enter your email as recipient
   Click "Send"
   ```

3. **Check Email Received**
   ```
   Check your inbox
   Email should arrive within 1-2 minutes
   Subject: "New Proposal: [Your Proposal Title]"
   From: Proposify AI <proposals@proposifyai.com>
   ```

4. **Test Tracking Pixel**
   ```
   Open the email
   Click "View Proposal" button
   Go to proposal analytics
   View count should increase
   ```

### Test Accept/Reject Notifications

1. **Accept Proposal**
   ```
   Open shared proposal link
   Click "Accept Proposal"
   Fill in name and email
   Submit
   ```

2. **Check Owner Email**
   ```
   Check the proposal owner's inbox
   Should receive "Proposal Accepted" email
   Subject: "🎉 Proposal Accepted: [Title]"
   ```

### ✅ Email Testing Checklist
- [ ] Proposal invitation email received
- [ ] Email opens correctly in inbox
- [ ] "View Proposal" link works
- [ ] Tracking pixel fires (view count increases)
- [ ] Accept notification email received
- [ ] Reject notification email received
- [ ] All email branding shows "Proposify AI"
- [ ] All links point to proposifyai.com

---

## 4️⃣ Verify All Features Working

### Public Proposal Sharing

1. **Create and Share**
   ```
   Create a proposal
   Make it public
   Copy share URL: /p/[shareId]
   ```

2. **Test Public View**
   ```
   Open in incognito/private window
   Should see proposal without login
   Accept/Reject buttons visible
   ```

3. **Test Password Protection**
   ```
   Set a password on proposal
   Try accessing without password
   Should prompt for password
   ```

### Analytics Dashboard

1. **Generate Views**
   ```
   View proposal from different devices
   Desktop, mobile, tablet
   Different browsers
   ```

2. **Check Analytics**
   ```
   Go to: /proposals/[id]/analytics
   Should show:
   - Total views
   - Unique visitors
   - Device breakdown
   - Browser stats
   - Recent views
   - Timeline chart
   ```

3. **Test Auto-Refresh**
   ```
   Keep analytics page open
   View proposal in another tab
   Wait 30 seconds
   Analytics should update automatically
   ```

### Accept/Reject Workflow

1. **Test Acceptance**
   ```
   Open public proposal
   Click "Accept Proposal"
   Fill in required fields
   Submit
   Should show success message
   Proposal status updates to "Accepted"
   ```

2. **Test Rejection**
   ```
   Open another public proposal
   Click "Reject Proposal"
   Fill in name, email, reason
   Submit
   Should show confirmation
   Proposal status updates to "Rejected"
   ```

### ✅ Feature Testing Checklist
- [ ] Public proposals accessible without login
- [ ] Password protection works
- [ ] Expiration dates enforced
- [ ] Accept workflow completes successfully
- [ ] Reject workflow completes successfully
- [ ] Analytics track all views correctly
- [ ] Device detection accurate
- [ ] Browser detection accurate
- [ ] Timeline chart displays properly
- [ ] Auto-refresh works every 30 seconds

---

## 🐛 Troubleshooting

### Issue: Emails Not Sending

**Symptoms:**
- No email received after sending proposal
- Error message when trying to send

**Solutions:**

1. **Check Resend API Key**
   ```
   Verify key in Vercel environment variables
   Key should start with 're_'
   No extra spaces before/after key
   ```

2. **Verify Domain Status**
   ```
   Go to Resend dashboard
   Domain should show green "Verified" status
   If pending, wait for DNS propagation
   ```

3. **Check DNS Records**
   ```
   Use DNS checker: https://dnschecker.org
   Enter: resend._domainkey.proposifyai.com
   Should return TXT record from Resend
   ```

4. **Review Deployment Logs**
   ```bash
   vercel logs proposifyai --prod

   # Look for errors like:
   # - "Invalid API key"
   # - "Domain not verified"
   # - "Failed to send email"
   ```

5. **Test with Resend Dashboard**
   ```
   Go to Resend dashboard
   Try sending a test email
   If this fails, issue is with Resend setup
   If this works, issue is with app configuration
   ```

### Issue: Database Migrations Failed

**Symptoms:**
- Error when trying to accept/reject proposals
- Analytics page shows errors
- "relation does not exist" errors

**Solutions:**

1. **Verify Tables Exist**
   ```sql
   SELECT * FROM proposal_views LIMIT 1;
   SELECT * FROM proposal_actions LIMIT 1;
   ```

2. **Check Functions Exist**
   ```sql
   SELECT generate_share_id();
   ```

3. **Re-run Migration**
   ```
   Delete any partial tables
   Run migration SQL again
   Verify all tables and functions created
   ```

### Issue: Analytics Not Showing

**Symptoms:**
- Analytics page blank
- No view counts appearing
- Charts not rendering

**Solutions:**

1. **Check Database Schema**
   ```
   Ensure proposal_views table exists
   Ensure RLS policies are set
   ```

2. **Verify Views Being Tracked**
   ```sql
   SELECT * FROM proposal_views
   WHERE proposal_id = 'your-proposal-id'
   ORDER BY viewed_at DESC;
   ```

3. **Check Browser Console**
   ```
   Open DevTools (F12)
   Look for JavaScript errors
   Check Network tab for failed API calls
   ```

### Issue: Accept/Reject Not Working

**Symptoms:**
- Buttons don't respond
- Error message after submitting
- Status not updating

**Solutions:**

1. **Verify Database Functions**
   ```sql
   -- Test accept function
   SELECT accept_proposal(
     'test-proposal-id'::uuid,
     'Test Name',
     'test@email.com'
   );
   ```

2. **Check Proposal Is Public**
   ```sql
   SELECT is_public, status
   FROM proposals
   WHERE share_id = 'your-share-id';
   ```

3. **Review API Logs**
   ```bash
   vercel logs proposifyai --prod --filter="/api/proposals/public"
   ```

---

## 📞 Support Resources

### Documentation
- **Full Guide:** `PHASE1_COMPLETE.md`
- **Quick Start:** `QUICK_START.md`
- **This Guide:** `MANUAL_SETUP_GUIDE.md`

### Dashboards
- **Vercel:** https://vercel.com/chatgptnotes-6366s-projects/proposifyai
- **Supabase:** https://supabase.com/dashboard/project/xmwnlgnfljufviigrois
- **Resend:** https://resend.com/dashboard

### Support Channels
- **Email:** support@proposifyai.com
- **GitHub Issues:** https://github.com/chatgptnotes/proposifyai.com/issues

### External Documentation
- **Resend Docs:** https://resend.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs

---

## ✅ Final Verification

Once you've completed all steps above, verify everything works:

### 1. Database ✓
```sql
-- Run these queries in Supabase SQL Editor
SELECT COUNT(*) FROM proposal_views;
SELECT COUNT(*) FROM proposal_actions;
SELECT generate_share_id(); -- Should return 12-char ID
```

### 2. Email Service ✓
```
- Send yourself a test proposal
- Email arrives within 2 minutes
- All links work
- Branding looks professional
```

### 3. Features ✓
```
- Create proposal
- Make public
- View anonymously
- Accept proposal
- Check analytics
- Verify notifications sent
```

### 4. Production ✓
```
- Visit https://proposifyai.com
- All pages load correctly
- No console errors
- Mobile responsive
- Fast load times
```

---

## 🎉 Completion Checklist

- [ ] Database migrations applied successfully
- [ ] Resend account created and verified
- [ ] Domain DNS records added and verified
- [ ] API key created and added to Vercel
- [ ] Environment variables configured
- [ ] Application redeployed
- [ ] Test email sent and received
- [ ] Tracking pixel working
- [ ] Accept/reject notifications received
- [ ] Public proposals accessible
- [ ] Analytics dashboard displaying data
- [ ] All features tested and working
- [ ] Production site fully functional

**Once all checkboxes are ✓, your Proposify AI installation is complete!**

---

**Need Help?**
If you encounter any issues not covered in this guide, check `PHASE1_COMPLETE.md` for additional troubleshooting or contact support.

**Version:** 2.8.0
**Last Updated:** October 26, 2025
**Status:** Production Ready ✅
