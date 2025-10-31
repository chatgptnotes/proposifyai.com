# 🔧 Fix: Set Vercel Root Directory

**Issue:** Your repository has the Next.js app in a subdirectory (`proposalai/`) but Vercel might be looking at the root.

**This causes:** 404 errors because Vercel can't find the app.

---

## ✅ SOLUTION: Set Root Directory in Vercel

I've opened the General Settings page for you. Follow these steps:

### Step 1: Find "Root Directory" Setting

In the Vercel dashboard (should be open), scroll down to find:
```
Build & Development Settings
  → Root Directory
```

### Step 2: Check Current Value

**If it shows:**
- ❌ `.` or empty → **THIS IS THE PROBLEM**
- ❌ `/` → **THIS IS THE PROBLEM**
- ✅ `proposalai` → This is correct (but check anyway)

### Step 3: Set to Correct Directory

1. Click "Edit" next to "Root Directory"

2. Enter: `proposalai`
   (exactly like that, no slashes)

3. Click "Save"

### Step 4: Redeploy

After saving:
1. The page will ask to redeploy
2. Click "Redeploy" button
3. Wait for build to complete (~1 minute)

---

## 🧪 After Fix - Test

Once redeployed:

```bash
# Test the site
curl -I https://proposifyai.com
```

**Expected:** HTTP/2 200 (NOT 404)

**Or visit in browser:**
https://proposifyai.com

Should show the landing page!

---

## 📋 Why This Fixes It

Your GitHub repo structure:
```
/
├── Headzgemini2.5/     (unrelated project)
└── proposalai/         ← The Next.js app is HERE
    ├── app/
    ├── package.json
    ├── next.config.js
    └── ...
```

Vercel needs to know to look in `proposalai/` directory, not the root `/`.

Setting Root Directory to `proposalai` tells Vercel:
"The Next.js app is in the proposalai subfolder, build from there."

---

## ⚡ Quick Steps

1. **In the Vercel page I opened**, find "Root Directory"
2. **Change to:** `proposalai`
3. **Save**
4. **Redeploy**
5. **Test:** https://proposifyai.com

**Total time:** 2 minutes

---

This should fix the 404 error! 🚀
