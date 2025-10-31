# Resend Domain DNS Configuration Guide

**Domain:** proposifyai.com
**Email Service:** Resend
**Status:** ⚠️ DNS Records Not Yet Configured

---

## 📋 Overview

To ensure high email deliverability and avoid spam folders, you need to verify your domain with Resend by adding DNS records to your domain registrar.

---

## 🔍 Current Status Check

Run this command to check DNS configuration:
```bash
cd /Users/murali/1\ imp\ backups/headz23oct25/proposalai
node check-resend-dns.js
```

---

## ✅ Step-by-Step Setup Instructions

### Step 1: Log in to Resend Dashboard

1. Go to https://resend.com/domains
2. Log in with your Resend account credentials
3. You should see `proposifyai.com` listed in your domains

### Step 2: Get DNS Records from Resend

In the Resend dashboard for proposifyai.com, you'll find the exact DNS records you need to add:

**Expected Records:**

1. **DKIM Record (Domain Keys)**
   - Type: `TXT`
   - Name: `resend._domainkey` or `resend._domainkey.proposifyai.com`
   - Value: `v=DKIM1; k=rsa; p=...` (long string provided by Resend)

2. **DMARC Record**
   - Type: `TXT`
   - Name: `_dmarc` or `_dmarc.proposifyai.com`
   - Value: `v=DMARC1; p=none; rua=mailto:dmarc@proposifyai.com`

3. **SPF Record (Optional but Recommended)**
   - Type: `TXT`
   - Name: `@` or `proposifyai.com`
   - Value: `v=spf1 include:_spf.resend.com ~all`

### Step 3: Add DNS Records to Your Domain Registrar

**Where to add DNS records:**

The location depends on where your domain `proposifyai.com` is registered:

#### Option A: If using Vercel DNS
1. Go to https://vercel.com/chatgptnotes-6366s-projects/proposifyai/settings/domains
2. Click on `proposifyai.com`
3. Scroll to DNS Records section
4. Click "Add Record"
5. Add each record from Resend:
   - For DKIM: Type=TXT, Name=resend._domainkey, Value=(from Resend)
   - For DMARC: Type=TXT, Name=_dmarc, Value=(from Resend)
   - For SPF: Type=TXT, Name=@, Value=(from Resend)

#### Option B: If using Cloudflare
1. Log in to Cloudflare dashboard
2. Select `proposifyai.com`
3. Go to DNS settings
4. Click "Add record"
5. Add each record from Resend

#### Option C: If using GoDaddy
1. Log in to GoDaddy account
2. Go to My Products → Domains
3. Click DNS next to proposifyai.com
4. Add records in DNS Management

#### Option D: If using Namecheap
1. Log in to Namecheap
2. Go to Domain List
3. Click Manage next to proposifyai.com
4. Go to Advanced DNS tab
5. Add new records

#### Option E: Other Registrars
- Check your domain registrar's documentation for DNS management
- Look for "DNS Settings", "DNS Management", or "Zone Editor"
- Add TXT records as provided by Resend

### Step 4: Wait for DNS Propagation

After adding the DNS records:

1. **Wait Time:** 5 minutes to 48 hours (typically 15-30 minutes)
2. **Check Status:** Use online tools to verify propagation
   - https://dnschecker.org
   - Enter: `resend._domainkey.proposifyai.com`
   - Select: TXT record
   - Check if it appears globally

### Step 5: Verify in Resend Dashboard

1. Return to https://resend.com/domains
2. Click on `proposifyai.com`
3. Click the "Verify" button
4. If DNS has propagated, you'll see a **green checkmark ✓**
5. Status will change from "Pending" to "Verified"

---

## 🧪 Testing DNS Records

### Using dig Command
```bash
# Check DKIM record
dig TXT resend._domainkey.proposifyai.com +short

# Check DMARC record
dig TXT _dmarc.proposifyai.com +short

# Check SPF record (if added)
dig TXT proposifyai.com +short | grep spf
```

### Using Online Tools

**Option 1: DNSChecker.org**
1. Go to https://dnschecker.org
2. Enter: `resend._domainkey.proposifyai.com`
3. Select: TXT
4. Click Search
5. Verify the record appears in multiple locations

**Option 2: MXToolbox**
1. Go to https://mxtoolbox.com/SuperTool.aspx
2. Enter: `resend._domainkey.proposifyai.com`
3. Select: TXT Lookup
4. Check results

**Option 3: Google Admin Toolbox**
1. Go to https://toolbox.googleapps.com/apps/dig/
2. Enter domain: `resend._domainkey.proposifyai.com`
3. Select: TXT
4. Click "Dig"

---

## ✅ Verification Checklist

Use this checklist to track your progress:

- [ ] Logged into Resend dashboard
- [ ] Found proposifyai.com in domains list
- [ ] Copied DKIM record value from Resend
- [ ] Copied DMARC record value from Resend
- [ ] Identified domain registrar
- [ ] Logged into domain registrar DNS settings
- [ ] Added DKIM TXT record (resend._domainkey)
- [ ] Added DMARC TXT record (_dmarc)
- [ ] Added SPF TXT record (optional but recommended)
- [ ] Saved DNS changes
- [ ] Waited 15-30 minutes for propagation
- [ ] Checked DNS with dnschecker.org
- [ ] Records appear globally
- [ ] Clicked "Verify" in Resend dashboard
- [ ] Resend shows green checkmark ✓
- [ ] Sent test email successfully
- [ ] Test email received (not in spam)

---

## 🚨 Troubleshooting

### Issue: Records Not Appearing in DNS Checker

**Possible Causes:**
1. DNS propagation not complete (wait longer)
2. Incorrect record name or value
3. TTL (Time To Live) set too high

**Solutions:**
1. Wait an additional 30 minutes
2. Double-check record names exactly match Resend
3. Verify no typos in TXT record values
4. Check TTL is set to 300 or automatic

### Issue: Resend Shows "Failed to Verify"

**Possible Causes:**
1. DNS records not propagated yet
2. Record value doesn't match exactly
3. Extra spaces in TXT value

**Solutions:**
1. Wait for full DNS propagation (up to 48 hours)
2. Copy-paste values directly from Resend (no manual typing)
3. Remove any extra spaces or line breaks
4. Ensure quotes are not included in the value field

### Issue: Emails Still Going to Spam

**Possible Causes:**
1. Domain newly verified (needs reputation building)
2. Missing SPF or DMARC records
3. Email content triggers spam filters

**Solutions:**
1. Wait 24-48 hours for reputation to build
2. Add all three records (DKIM, DMARC, SPF)
3. Send to yourself first to test
4. Ask recipients to whitelist proposals@proposifyai.com
5. Avoid spam trigger words in email content

---

## 📊 Expected DNS Records (After Configuration)

Once properly configured, your DNS should show:

```bash
# DKIM Record
$ dig TXT resend._domainkey.proposifyai.com +short
"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."

# DMARC Record
$ dig TXT _dmarc.proposifyai.com +short
"v=DMARC1; p=none; rua=mailto:dmarc@proposifyai.com"

# SPF Record (if added)
$ dig TXT proposifyai.com +short
"v=spf1 include:_spf.resend.com ~all"
```

---

## 📧 Testing Email After DNS Verification

Once DNS is verified, test email sending:

### Option 1: Send Test Proposal
1. Log in to https://proposifyai.com
2. Create a new proposal
3. Make it public
4. Click "Send via Email"
5. Send to your own email address
6. Check inbox (and spam folder)

### Option 2: Use Test Script
```bash
cd /Users/murali/1\ imp\ backups/headz23oct25/proposalai
node test-email.js
```

### Option 3: Manual API Test
```bash
curl -X POST https://api.resend.com/emails \\
  -H "Authorization: Bearer YOUR_RESEND_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "Proposify AI <proposals@proposifyai.com>",
    "to": "your-email@example.com",
    "subject": "DNS Verification Test",
    "html": "<p>If you receive this, your DNS is configured correctly!</p>"
  }'
```

---

## 📈 Email Deliverability Best Practices

### Immediate Actions
1. ✅ Verify domain with all three DNS records (DKIM, DMARC, SPF)
2. ✅ Send test emails to yourself first
3. ✅ Monitor Resend dashboard for delivery stats

### Short-term (First Week)
1. Whitelist proposals@proposifyai.com in your email client
2. Ask initial recipients to whitelist the sender
3. Monitor bounce rates in Resend dashboard
4. Keep email content professional and spam-free

### Long-term (Ongoing)
1. Monitor sender reputation in Resend
2. Keep bounce rate < 5%
3. Keep spam complaint rate < 0.1%
4. Maintain consistent sending volume
5. Use email engagement data to improve content

---

## 🔗 Helpful Links

**Resend Documentation:**
- Dashboard: https://resend.com/domains
- Domain Verification Guide: https://resend.com/docs/dashboard/domains/introduction
- DNS Setup: https://resend.com/docs/dashboard/domains/dns-records

**DNS Testing Tools:**
- DNSChecker: https://dnschecker.org
- MXToolbox: https://mxtoolbox.com
- Google Dig: https://toolbox.googleapps.com/apps/dig/
- What's My DNS: https://www.whatsmydns.net

**Email Testing Tools:**
- Mail Tester: https://www.mail-tester.com
- Email on Acid: https://www.emailonacid.com

---

## 📞 Support

**Resend Support:**
- Email: support@resend.com
- Documentation: https://resend.com/docs
- Status Page: https://resend.statuspage.io

**DNS Support:**
- Depends on your domain registrar
- Check their help documentation for DNS management

---

## ✅ Success Criteria

You'll know DNS is properly configured when:

1. ✅ Resend dashboard shows green checkmark next to proposifyai.com
2. ✅ DNS checker shows TXT records globally
3. ✅ Test emails arrive in inbox (not spam)
4. ✅ Email headers show DKIM and SPF passing
5. ✅ Mail tester score is 10/10

---

**Document Version:** 1.0
**Last Updated:** October 26, 2025
**Status:** Awaiting DNS Configuration

---

## Quick Start Checklist

Copy this to track your progress:

```
[ ] 1. Log into Resend (https://resend.com/domains)
[ ] 2. Find proposifyai.com and copy DNS records
[ ] 3. Log into domain registrar
[ ] 4. Add DKIM TXT record
[ ] 5. Add DMARC TXT record
[ ] 6. Add SPF TXT record (optional)
[ ] 7. Save changes
[ ] 8. Wait 15-30 minutes
[ ] 9. Check with dnschecker.org
[ ] 10. Verify in Resend dashboard
[ ] 11. Send test email
[ ] 12. Celebrate! 🎉
```

**Estimated Time:** 15-30 minutes (plus DNS propagation wait time)
