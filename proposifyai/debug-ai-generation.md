# AI Generation Debug Report

## Date: November 13, 2025

## Issue
User reports: "there is still an error whenever I try to generate a proposal document from the template"

## System Check

### 1. Environment Variables ✅
- OPENAI_API_KEY: Present in .env.local
- SUPABASE_URL: Present
- SUPABASE_ANON_KEY: Present

### 2. Dev Server Status ✅
- Running on: http://localhost:3000
- Build Status: Compiling successfully

### 3. Code Review

#### A. AI Generation Flow (app/proposals/new/page.tsx)
**Lines 81-227:**
```typescript
// Sequential generation with retry logic
for (let i = 0; i < sections.length; i++) {
  const sectionType = sections[i];
  // Retry logic with exponential backoff
  // Generates one section at a time
  // 2-second delay between sections
}
```
**Status:** ✅ Correct implementation (sequential, not parallel)

#### B. AI Content Generation API (app/api/ai/generate-content/route.ts)
**Lines 12-170:**
- Authentication check: ✅
- User validation: ✅
- Request body parsing: ✅
- OpenAI API call: ✅
- Error handling: ✅

#### C. Content Save Endpoint (app/api/proposals/[id]/route.ts - PATCH)
**Lines 162-233:**
- Content merging: ✅ `{...(existingProposal.content || {}), ...(body.content || {})}`
- Database update: ✅

#### D. Content Display (app/proposals/[id]/page.tsx)
**Lines 478-507:**
- Renders: executive_summary, scope_of_work, pricing_breakdown, timeline, terms
- **CRITICAL CHECK:** Content is rendered as HTML directly
- Expects content object with section keys

## Potential Issues Identified

### Issue 1: HTML Escaping
**Problem:** AI-generated content contains HTML (tables, divs, etc.)
**Where:**
- OpenAI generates HTML in prompts (lib/ai/openai.ts lines 272-435)
- Content is inserted directly: `html += ${content.executive_summary}`

**Impact:** If HTML is being escaped, tables/formatting won't display

### Issue 2: Content Object Structure
**Problem:** Mismatch between how content is saved vs retrieved
**Check needed:**
1. When saving: `content: { executive_summary: "...", scope_of_work: "..." }`
2. When retrieving: Does Supabase return the same structure?

### Issue 3: Empty or Null Content
**Problem:** Content sections might be null/undefined
**Where:** proposal/[id]/page.tsx checks `if (content.executive_summary)`
**Impact:** Sections won't render if content is missing

## Next Steps - User Testing Required

Since I cannot authenticate to test the full flow, please help identify the error by:

### Step 1: Create a Test Proposal
1. Go to: http://localhost:3000/proposals/new
2. Fill in:
   - Client: "Test Company"
   - Email: "test@example.com"
   - Project Title: "Test Project"
   - Budget: "50000"
3. Enable "Use AI to generate proposal content"
4. Click "Generate with AI (Bettroi Professional)"

### Step 2: Monitor Browser Console
**Open Developer Tools (F12) → Console Tab**
Look for:
- ❌ Network errors (red text)
- ⚠️ Warnings
- 🔍 Look for logs starting with: `[OpenAI]`, `[1/5]`, `✓ [1/5]`

### Step 3: Check Network Tab
**Open Developer Tools → Network Tab**
1. Filter by: "Fetch/XHR"
2. Look for requests to:
   - `/api/proposals` (POST) - Should be 200 OK
   - `/api/ai/generate-content` (POST x5) - Should ALL be 200 OK
   - `/api/proposals/{id}` (PATCH) - Should be 200 OK

3. **If any requests are RED (failed):**
   - Click on the failed request
   - Go to "Response" tab
   - Copy the error message

### Step 4: Check Server Terminal
**In the terminal where `npm run dev` is running:**
Look for error messages with:
- `[OpenAI]` prefix
- Error stack traces
- `Failed to generate content`

### Step 5: Check the Generated Proposal
If proposal is created (even with errors):
1. Go to `/proposals/{id}` (should redirect automatically)
2. Check if ANY content is displayed
3. Open browser console
4. Run: `console.log(document.querySelector('.proposal-content').innerHTML)`
5. Copy the HTML output

## Most Likely Causes

### 1. Rate Limiting (429 Error)
**Symptom:** "terms" or last section fails
**Solution:** Already implemented (sequential + delays)
**Check:** Look for "429" in network tab

### 2. Invalid API Key (401 Error)
**Symptom:** All sections fail
**Solution:** Verify OpenAI API key
**Check:** Test with: `node test-ai-endpoint.js` (won't work due to auth, but can test locally)

### 3. Content Not Saving
**Symptom:** Generation succeeds but proposal is empty
**Solution:** Check PATCH request response
**Check:** Network tab → PATCH `/api/proposals/{id}` → Response

### 4. HTML Rendering Issue
**Symptom:** Content saves but doesn't display
**Solution:** Check if HTML is escaped
**Check:** View page source → Look for `&lt;table&gt;` instead of `<table>`

## Quick Fix Candidates

### If content is escaping HTML:
```typescript
// In app/proposals/[id]/page.tsx line 481
// Change from:
html += `<div>${content.executive_summary}</div>`;
// To:
html += `<div dangerouslySetInnerHTML={{__html: content.executive_summary}}></div>`;
```

### If content structure is wrong:
```typescript
// Check what's actually in the database
// Run in Supabase SQL Editor:
SELECT id, title, content FROM proposals WHERE id = 'YOUR_PROPOSAL_ID';
```

## Request for User

Please provide:
1. **Screenshot** of browser console with errors
2. **Screenshot** of network tab showing failed requests
3. **Copy-paste** of any error messages
4. **Result** of accessing a generated proposal

Then I can provide the exact fix needed!
