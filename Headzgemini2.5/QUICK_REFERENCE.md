# ProposifyAI - Quick Reference Card

## Live URLs

### Production
- https://proposifyai.com (requires DNS setup)
- https://www.proposifyai.com (requires DNS setup)
- https://proposifyai-app.vercel.app (active now)

### Preview
- https://proposifyai-jk5qef0ha-chatgptnotes-6366s-projects.vercel.app

---

## Critical DNS Setup Required

Your domain is configured in Vercel but NOT live yet. Update nameservers at your registrar:

**Point to**:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

**Current (incorrect)**:
- dns1.registrar-servers.com
- dns2.registrar-servers.com

---

## Quick Commands

### Deploy
```bash
cd "/Users/murali/1 imp backups/headz23oct25/Headzgemini2.5/proposifyai-app"

# Preview deployment
vercel

# Production deployment
vercel --prod
```

### Update API Keys
```bash
# Replace placeholders with actual keys
echo "your-actual-openai-key" | vercel env add OPENAI_API_KEY production
echo "your-actual-elevenlabs-key" | vercel env add ELEVENLABS_API_KEY production
```

### View Logs
```bash
vercel logs proposifyai-app --prod
```

### Environment Variables
```bash
# List all
vercel env ls

# Pull to local
vercel env pull
```

---

## Dashboard Access

**Vercel Dashboard**: https://vercel.com/chatgptnotes-6366s-projects/proposifyai-app

---

## Project Info

- **Framework**: Next.js 14.2.33
- **Node**: 22.x
- **Region**: iad1 (Washington DC)
- **Build Time**: ~31 seconds
- **Build Command**: npm run build
- **Output Directory**: .next

---

## Environment Variables Configured

All environments have:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY (PLACEHOLDER - UPDATE NEEDED)
- ELEVENLABS_API_KEY (PLACEHOLDER - UPDATE NEEDED)
- NEXT_PUBLIC_APP_URL

---

## Security Features Enabled

- HTTPS enforced via HSTS
- X-Frame-Options: DENY
- XSS Protection enabled
- Content-Type sniffing disabled
- DNS prefetch enabled

---

## Status Check

Build: PASSING
Production: DEPLOYED
Preview: DEPLOYED
Custom Domain: CONFIGURED (awaiting DNS)
Environment Vars: CONFIGURED
Analytics: ENABLED

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Deployment Summary: See DEPLOYMENT_SUMMARY.md
