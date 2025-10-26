# 🚀 Proposify AI - Quick Start Guide

## ⚡ Immediate Action Required

### 1. Apply Database Migrations (5 minutes)
```
1. Go to: https://supabase.com/dashboard/project/xmwnlgnfljufviigrois/editor
2. Open SQL Editor (left sidebar)
3. Copy contents of: supabase/migrations/20251026000007_public_proposals.sql
4. Paste and click "Run" (⚡ icon)
5. Verify success message appears
```

### 2. Configure Email Service (10 minutes)
```
1. Sign up: https://resend.com
2. Add domain: proposifyai.com or proposifyai.com
3. Get API key from: https://resend.com/api-keys
4. Add to Vercel: https://vercel.com/chatgptnotes-6366s-projects/proposifyai/settings/environment-variables

   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=Proposify AI <proposals@proposifyai.com>
   EMAIL_REPLY_TO=support@proposifyai.com
   NEXT_PUBLIC_APP_URL=https://proposifyai.com

5. Redeploy: vercel --prod
```

## 🌐 Live URLs

**Production:** https://proposifyai-giz7iyquo-chatgptnotes-6366s-projects.vercel.app
**GitHub:** https://github.com/chatgptnotes/proposifyai.com
**Supabase:** https://supabase.com/dashboard/project/xmwnlgnfljufviigrois

## 🎯 Test Features

### Test Public Proposal Sharing
1. Create a proposal at `/proposals/new`
2. Click "Send Proposal" or "Make Public"
3. Copy share URL: `/p/[shareId]`
4. Open in incognito window
5. Test accept/reject buttons

### Test Email Delivery
1. Open a proposal
2. Click "Send Email"
3. Enter recipient details
4. Send and check email received
5. Open email to trigger tracking pixel

### Test Analytics
1. View a proposal publicly
2. Go to `/proposals/[id]/analytics`
3. Verify metrics display:
   - View count
   - Device breakdown
   - Browser analytics
   - Recent views

## 📊 New Features Overview

| Feature | URL | Status |
|---------|-----|--------|
| Public View | `/p/[shareId]` | ✅ Live |
| Accept/Reject | `/p/[shareId]` (buttons) | ✅ Live |
| Analytics | `/proposals/[id]/analytics` | ✅ Live |
| Send Email | `POST /api/proposals/[id]/send` | ⚠️ Needs Resend |
| Tracking | `GET /p/[shareId]/track` | ✅ Live |

## ⚙️ Environment Variables

**Required in Vercel:**
```bash
# Email (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=Proposify AI <proposals@proposifyai.com>
EMAIL_REPLY_TO=support@proposifyai.com

# App
NEXT_PUBLIC_APP_URL=https://proposifyai.com
```

## 🐛 Troubleshooting

**Email not sending?**
- Check Resend API key in Vercel
- Verify domain in Resend dashboard
- Check Vercel deployment logs

**Analytics not showing?**
- Apply database migrations first
- Check browser console for errors
- Verify proposal has been viewed publicly

**Public view not working?**
- Ensure proposal is marked "public"
- Check share_id exists in database
- Verify database migrations applied

## 📞 Need Help?

**Full Documentation:** See PHASE1_COMPLETE.md
**Support Email:** support@proposifyai.com
**GitHub Issues:** https://github.com/chatgptnotes/proposifyai.com/issues

---

**Version:** 2.8.0
**Last Updated:** October 26, 2025
**Status:** ✅ Production Ready
