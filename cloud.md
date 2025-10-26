# ProposalAI - Complete Project Plan & Setup Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Third-Party Services Setup](#third-party-services-setup)
5. [Development Phases](#development-phases)
6. [Timeline & Milestones](#timeline--milestones)
7. [Team Structure](#team-structure)
8. [Deployment Strategy](#deployment-strategy)

---

## Project Overview

**Product Name:** ProposalAI
**Type:** AI-Powered Proposal Management SaaS
**Target Market:** B2B Sales Teams (5-500 employees)
**Business Model:** Subscription (Starter $49, Professional $99, Enterprise Custom)
**MVP Timeline:** 4-6 months
**Tech Stack:** Next.js 14, Supabase, OpenAI, ElevenLabs, Vercel

---

## Local Development Setup

### Prerequisites

Before running `npm run dev`, you need to have these installed and configured:

#### 1. System Requirements

**Operating System:**
- macOS 10.15+
- Windows 10/11 (with WSL2)
- Linux (Ubuntu 20.04+)

**Software Dependencies:**
```bash
# Node.js & npm (required)
node -v  # Should be v18.17.0 or higher
npm -v   # Should be v9.0.0 or higher

# Alternative: Use pnpm (recommended for speed)
npm install -g pnpm
pnpm -v  # Should be v8.0.0 or higher

# Git
git --version  # Should be v2.0.0 or higher

# Docker (optional, for local database)
docker --version  # Should be v20.0.0 or higher
```

---

### 2. Project Setup Steps

#### Step 1: Clone Repository
```bash
# Clone the repo
git clone https://github.com/your-org/proposalai.git
cd proposalai

# Checkout to development branch
git checkout develop
```

#### Step 2: Install Dependencies
```bash
# Using npm
npm install

# OR using pnpm (faster)
pnpm install

# Expected time: 2-5 minutes depending on internet speed
```

#### Step 3: Environment Configuration
```bash
# Copy example environment file
cp .env.example .env.local

# Open and fill in the environment variables
code .env.local  # or use your preferred editor
```

#### Step 4: Database Setup

**Option A: Use Supabase Cloud (Recommended for Development)**
```bash
# No local setup needed - just configure .env.local with Supabase credentials
# See "Third-Party Services Setup" section below
```

**Option B: Local PostgreSQL with Docker**
```bash
# Run Supabase locally
npx supabase init
npx supabase start

# This will output:
# - API URL: http://localhost:54321
# - DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# - anon key: eyJhbG...
# - service_role key: eyJhbG...

# Run migrations
npx supabase db push
```

#### Step 5: Seed Database (Optional)
```bash
# Seed with sample data for development
npm run db:seed

# This will create:
# - 5 sample users
# - 10 sample prospects
# - 20 sample proposals
# - 50 content library items
# - 10 templates
```

#### Step 6: Run Development Server
```bash
npm run dev

# Server will start at http://localhost:3000
# Expected startup time: 5-10 seconds
```

#### Step 7: Access the Application
```
Open browser: http://localhost:3000

Default login (from seed data):
Email: admin@proposalai.com
Password: admin123
```

---

### What Happens When You Run `npm run dev`?

Behind the scenes, the following processes start:

1. **Next.js Development Server** (Port 3000)
   - Compiles React components
   - Enables Hot Module Replacement (HMR)
   - Serves pages with Fast Refresh

2. **TypeScript Type Checking**
   - Runs in watch mode
   - Shows type errors in real-time

3. **Tailwind CSS Compilation**
   - Watches for CSS changes
   - Generates utility classes

4. **Supabase Client Connection**
   - Connects to database
   - Establishes realtime subscriptions

5. **API Routes**
   - Starts Next.js API handlers
   - Connects to third-party services (if configured)

---

### Common Issues & Solutions

#### Issue 1: Port 3000 Already in Use
```bash
# Solution 1: Kill process on port 3000
npx kill-port 3000

# Solution 2: Use different port
PORT=3001 npm run dev
```

#### Issue 2: Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue 3: Database Connection Error
```bash
# Check if Supabase is running (for local setup)
npx supabase status

# Restart Supabase
npx supabase stop
npx supabase start
```

#### Issue 4: Environment Variables Not Loading
```bash
# Ensure file is named .env.local (not .env)
# Restart dev server after changing .env.local
# Variables must start with NEXT_PUBLIC_ to be accessible in browser
```

#### Issue 5: Type Errors
```bash
# Regenerate TypeScript types from Supabase
npm run types:generate

# Or manually:
npx supabase gen types typescript --local > types/supabase.ts
```

---

## Environment Configuration

### Required Environment Variables

Create `.env.local` file in project root with these variables:

```env
# ==========================
# CORE APPLICATION
# ==========================
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ProposalAI

# ==========================
# SUPABASE (Required)
# ==========================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# For local development:
# NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>

# ==========================
# OPENAI (Required for AI Features)
# ==========================
OPENAI_API_KEY=sk-...your-key
OPENAI_ORG_ID=org-...your-org  # Optional

# ==========================
# ANTHROPIC CLAUDE (Required for AI Features)
# ==========================
ANTHROPIC_API_KEY=sk-ant-...your-key

# ==========================
# ELEVENLABS (Required for Voice Features)
# ==========================
ELEVENLABS_API_KEY=...your-key
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=...default-voice-id

# ==========================
# STRIPE (Required for Payments)
# ==========================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...

# ==========================
# EMAIL (Required for Notifications)
# ==========================
# Option 1: SendGrid (Recommended)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@proposalai.com
SENDGRID_FROM_NAME=ProposalAI

# Option 2: Resend (Alternative)
# RESEND_API_KEY=re_...
# RESEND_FROM_EMAIL=noreply@proposalai.com

# ==========================
# SMS (Optional - for High-Value Deal Alerts)
# ==========================
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# ==========================
# FILE STORAGE (Optional - Supabase Storage is default)
# ==========================
# Cloudflare R2 (for production - cheaper than S3)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=proposalai-files

# ==========================
# INTEGRATIONS - CRMs (Optional)
# ==========================
# HubSpot
HUBSPOT_CLIENT_ID=...
HUBSPOT_CLIENT_SECRET=...
HUBSPOT_REDIRECT_URI=http://localhost:3000/api/integrations/hubspot/callback

# Salesforce
SALESFORCE_CLIENT_ID=...
SALESFORCE_CLIENT_SECRET=...
SALESFORCE_REDIRECT_URI=http://localhost:3000/api/integrations/salesforce/callback

# Pipedrive
PIPEDRIVE_API_KEY=...

# ==========================
# INTEGRATIONS - Communication (Optional)
# ==========================
# Slack
SLACK_CLIENT_ID=...
SLACK_CLIENT_SECRET=...
SLACK_SIGNING_SECRET=...

# ==========================
# INTEGRATIONS - Meeting Intelligence (Optional)
# ==========================
# Fireflies.ai
FIREFLIES_API_KEY=...

# Gong
GONG_API_KEY=...
GONG_SECRET=...

# ==========================
# SEARCH & ANALYTICS (Optional)
# ==========================
# Algolia (for content library search)
NEXT_PUBLIC_ALGOLIA_APP_ID=...
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=...
ALGOLIA_ADMIN_KEY=...

# PostHog (for product analytics)
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ==========================
# MONITORING & ERROR TRACKING (Production)
# ==========================
# Sentry
NEXT_PUBLIC_SENTRY_DSN=...
SENTRY_AUTH_TOKEN=...

# Better Stack (Logging)
BETTERSTACK_SOURCE_TOKEN=...

# ==========================
# AUTOMATION (Optional)
# ==========================
# Make.com Webhooks
MAKE_WEBHOOK_URL=https://hook.make.com/...
MAKE_API_KEY=...

# ==========================
# RATE LIMITING & SECURITY
# ==========================
# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# ==========================
# FEATURE FLAGS (Optional)
# ==========================
NEXT_PUBLIC_ENABLE_VOICE_FEATURES=true
NEXT_PUBLIC_ENABLE_AI_RESEARCH=true
NEXT_PUBLIC_ENABLE_PAYMENT_INTEGRATION=true
```

---

### Environment Variable Checklist

Before running the app, ensure you have at minimum:

**Essential (App won't run without these):**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

**Core Features (App will run but features won't work):**
- [ ] `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (AI features)
- [ ] `SENDGRID_API_KEY` or `RESEND_API_KEY` (Email notifications)
- [ ] `STRIPE_SECRET_KEY` (Payment processing)

**Optional (Can be added later):**
- [ ] `ELEVENLABS_API_KEY` (Voice features)
- [ ] `HUBSPOT_CLIENT_ID` (CRM integration)
- [ ] `SLACK_CLIENT_ID` (Slack notifications)

---

## Third-Party Services Setup

### 1. Supabase Setup (Required)

**Time Required:** 15 minutes

**Steps:**
1. Go to [supabase.com](https://supabase.com)
2. Create account → New Project
3. Name: `proposalai-dev`
4. Database Password: (Generate strong password)
5. Region: Choose closest to your location
6. Wait 2-3 minutes for project to be ready

**Get Credentials:**
```
Project Settings → API
- Project URL → NEXT_PUBLIC_SUPABASE_URL
- anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
- service_role → SUPABASE_SERVICE_ROLE_KEY
```

**Run Database Migrations:**
```bash
# Link local project to Supabase
npx supabase link --project-ref your-project-ref

# Push database schema
npx supabase db push

# Verify tables created
# Go to Supabase Dashboard → Table Editor
# Should see: users, organizations, proposals, templates, etc.
```

**Enable Realtime:**
```sql
-- In Supabase SQL Editor, run:
alter publication supabase_realtime add table proposals;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table proposal_analytics;
```

**Setup Storage Buckets:**
```bash
# In Supabase Dashboard → Storage
1. Create bucket: "proposals" (Public)
2. Create bucket: "avatars" (Public)
3. Create bucket: "content-library" (Private)
4. Create bucket: "signed-contracts" (Private)
```

**Setup Row Level Security (RLS):**
```sql
-- Example RLS policy for proposals table
create policy "Users can view proposals in their organization"
  on proposals for select
  using (
    organization_id = (
      select organization_id from users
      where id = auth.uid()
    )
  );

create policy "Users can create proposals"
  on proposals for insert
  with check (
    created_by = auth.uid()
  );
```

---

### 2. OpenAI Setup (Required)

**Time Required:** 5 minutes

**Steps:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account → API Keys
3. Create new secret key
4. Copy key → Add to `.env.local` as `OPENAI_API_KEY`

**Set Usage Limits (Recommended):**
- Billing → Usage limits
- Set monthly limit: $50 for development
- Enable email alerts at $40

**Models Used:**
- `gpt-4-turbo-preview` - Main proposal generation
- `gpt-3.5-turbo` - Quick content suggestions
- `text-embedding-3-small` - Semantic search

**Estimated Costs (Development):**
- Per proposal generation: ~$0.10
- 100 proposals/month: ~$10
- With testing: ~$30-50/month

---

### 3. Anthropic Claude Setup (Required)

**Time Required:** 5 minutes

**Steps:**
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account → API Keys
3. Generate key → Add to `.env.local` as `ANTHROPIC_API_KEY`

**Models Used:**
- `claude-3-5-sonnet-20241022` - Long-context proposal analysis
- `claude-3-haiku-20240307` - Quick responses

**Why Claude + OpenAI?**
- Claude: Better for long-context (100K tokens) - used for analyzing full proposals
- OpenAI: Better for structured output - used for generating sections

---

### 4. ElevenLabs Setup (Optional - Voice Features)

**Time Required:** 10 minutes

**Steps:**
1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Create account
3. Profile → API Key → Generate
4. Add to `.env.local` as `ELEVENLABS_API_KEY`

**Voice Cloning Setup:**
1. VoiceLab → Add Voice
2. Upload 5-minute audio sample
3. Train voice (takes ~10 minutes)
4. Copy Voice ID → Add as `NEXT_PUBLIC_ELEVENLABS_VOICE_ID`

**Pricing:**
- Free tier: 10K characters/month
- Creator: $5/month - 30K characters
- Pro: $22/month - 100K characters

---

### 5. Stripe Setup (Required for Payments)

**Time Required:** 20 minutes

**Steps:**
1. Go to [stripe.com](https://stripe.com)
2. Create account → Developers → API Keys
3. Get test keys (pk_test_... and sk_test_...)
4. Add to `.env.local`

**Create Products & Prices:**
```bash
# Use Stripe CLI or Dashboard

# Starter Plan
stripe products create \
  --name="ProposalAI Starter" \
  --description="Perfect for solo consultants"

stripe prices create \
  --product=prod_xxx \
  --unit-amount=4900 \
  --currency=usd \
  --recurring[interval]=month

# Professional Plan
stripe products create \
  --name="ProposalAI Professional" \
  --description="For growing sales teams"

stripe prices create \
  --product=prod_yyy \
  --unit-amount=9900 \
  --currency=usd \
  --recurring[interval]=month
```

**Setup Webhooks:**
```
Dashboard → Developers → Webhooks → Add Endpoint
URL: http://localhost:3000/api/webhooks/stripe
Events to listen:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed
```

**Test Payments:**
Use Stripe test cards:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002

---

### 6. SendGrid Setup (Required for Emails)

**Time Required:** 15 minutes

**Steps:**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account
3. Settings → API Keys → Create API Key
4. Full Access → Create & Review
5. Copy key → Add to `.env.local`

**Email Setup:**
1. Settings → Sender Authentication
2. Verify domain (proposalai.com)
3. Add DNS records to your domain provider
4. Wait for verification (~10 minutes)

**Create Email Templates:**
```bash
# In SendGrid Dashboard → Email API → Dynamic Templates

1. Welcome Email (d-xxx)
2. Proposal Sent (d-xxx)
3. Proposal Opened (d-xxx)
4. Proposal Signed (d-xxx)
5. Daily Digest (d-xxx)
```

**Free Tier:**
- 100 emails/day
- Upgrade to Essentials ($19.95/mo) for 50K emails/month

---

### 7. HubSpot Integration (Optional)

**Time Required:** 30 minutes

**Steps:**
1. Go to [developers.hubspot.com](https://developers.hubspot.com)
2. Create app → Name: "ProposalAI"
3. Auth → Set scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
4. Copy Client ID & Secret
5. Set Redirect URI: `http://localhost:3000/api/integrations/hubspot/callback`

**OAuth Flow:**
```typescript
// User clicks "Connect HubSpot" in app
// → Redirects to HubSpot for authorization
// → HubSpot redirects back with code
// → Exchange code for access token
// → Store token in database
```

---

### 8. Slack Integration (Optional)

**Time Required:** 20 minutes

**Steps:**
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create New App → From Scratch
3. Name: "ProposalAI", Workspace: Your workspace
4. OAuth & Permissions → Scopes:
   - `chat:write`
   - `chat:write.public`
   - `incoming-webhook`
5. Install to Workspace
6. Copy credentials

**Setup Slash Command (Optional):**
```
/proposal-status [proposal_id]
Returns: Live proposal analytics
```

---

## Development Phases

### Phase 0: Project Setup (Week 1)
**Duration:** 1 week
**Team:** 1 developer

**Tasks:**
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Setup Tailwind CSS + Shadcn UI
- [ ] Configure ESLint + Prettier
- [ ] Setup Supabase project
- [ ] Create initial database schema
- [ ] Setup authentication (email + OAuth)
- [ ] Create basic dashboard layout
- [ ] Setup Git workflow (main, develop, feature branches)
- [ ] Configure Vercel deployment

**Deliverables:**
- Running Next.js app
- User can sign up/login
- Basic dashboard with navigation

---

### Phase 1: Core Proposal Editor (Weeks 2-4)
**Duration:** 3 weeks
**Team:** 2 developers

**User Stories:**
- As a user, I can create a proposal from a blank canvas
- As a user, I can add text, images, and pricing tables
- As a user, I can drag and drop sections to reorder
- As a user, I can preview my proposal
- As a user, I can save drafts

**Technical Tasks:**
- [ ] Build block-based editor using TipTap
- [ ] Implement drag-and-drop with React DnD
- [ ] Create block types: text, image, pricing table, video
- [ ] Build real-time auto-save (Supabase realtime)
- [ ] Create proposal preview mode
- [ ] Mobile-responsive editor
- [ ] Version history

**Database Schema:**
```sql
proposals (id, organization_id, created_by, title, status, blocks, created_at, updated_at)
proposal_blocks (id, proposal_id, type, content, order, settings)
proposal_versions (id, proposal_id, blocks, created_at, created_by)
```

**API Endpoints:**
- `POST /api/proposals` - Create proposal
- `GET /api/proposals/:id` - Get proposal
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal
- `GET /api/proposals/:id/versions` - Get version history

---

### Phase 2: Template System (Week 5)
**Duration:** 1 week
**Team:** 1 developer + 1 designer

**User Stories:**
- As a user, I can create proposals from pre-built templates
- As a user, I can save my proposals as templates
- As a user, I can browse templates by category

**Tasks:**
- [ ] Build template library UI
- [ ] Create 10 starter templates (designer)
- [ ] Implement "Save as template" feature
- [ ] Template preview thumbnails
- [ ] Template categorization & tagging
- [ ] Template search

**Deliverables:**
- Template gallery
- 10 professional templates
- Template creation flow

---

### Phase 3: AI Integration - Basic (Weeks 6-7)
**Duration:** 2 weeks
**Team:** 2 developers (1 backend AI specialist)

**User Stories:**
- As a user, I can generate proposal sections with AI
- As a user, I can adjust the tone of AI-generated content
- As a user, I can regenerate sections I don't like

**Tasks:**
- [ ] Integrate OpenAI API
- [ ] Build prompt engineering system
- [ ] Create AI generation UI (loading states, regenerate)
- [ ] Implement tone adjustment (professional, casual, technical)
- [ ] Build content library for AI to reference
- [ ] Error handling for AI failures

**Technical Implementation:**
```typescript
// AI Service
const generateSection = async (type: SectionType, context: ProposalContext) => {
  const prompt = buildPrompt(type, context);
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });
  return response.choices[0].message.content;
};
```

**Deliverables:**
- AI generates executive summary, problem statement, solution
- Users can adjust tone
- Content is contextually relevant

---

### Phase 4: Proposal Sending & Tracking (Week 8)
**Duration:** 1 week
**Team:** 2 developers

**User Stories:**
- As a user, I can send proposals via email
- As a user, I can see when proposals are opened
- As a user, I receive notifications when prospects engage

**Tasks:**
- [ ] Build proposal sending flow
- [ ] Integrate SendGrid for email delivery
- [ ] Create public proposal view (shareable link)
- [ ] Implement view tracking (pixel tracking)
- [ ] Build analytics dashboard
- [ ] Setup notification system (email, in-app)

**Tracking Implementation:**
```typescript
// Embed tracking pixel in email
<img src="https://proposalai.com/api/track/pixel/prop_xxx" width="1" height="1" />

// API endpoint records view
app.get('/api/track/pixel/:proposalId', async (req, res) => {
  await recordView(req.params.proposalId, req.ip);
  res.sendFile('1x1.png');
});
```

---

### Phase 5: AI Research Agent (Weeks 9-10)
**Duration:** 2 weeks
**Team:** 2 developers

**User Stories:**
- As a user, I can paste a company URL and get AI research
- As a user, I see pain points, competitors, and recent news
- As a user, AI uses research to personalize my proposal

**Tasks:**
- [ ] Build web scraping service (Puppeteer)
- [ ] Integrate Firecrawl API
- [ ] Implement AI analysis (Claude for long context)
- [ ] Create research brief UI
- [ ] Store research in database
- [ ] Connect research to proposal generation

**Scraping Workflow:**
```typescript
const researchCompany = async (url: string) => {
  // 1. Scrape website
  const websiteContent = await scrapeWebsite(url);

  // 2. Get LinkedIn data
  const linkedinData = await scrapeLinkedIn(url);

  // 3. Get news
  const news = await getNews(companyName);

  // 4. AI analysis
  const analysis = await claude.analyze({
    website: websiteContent,
    linkedin: linkedinData,
    news: news
  });

  return analysis;
};
```

---

### Phase 6: Voice-to-Proposal (Weeks 11-12)
**Duration:** 2 weeks
**Team:** 2 developers

**User Stories:**
- As a user, I can upload a call recording
- As a user, AI transcribes and extracts requirements
- As a user, AI generates a proposal from the call

**Tasks:**
- [ ] Integrate Whisper AI for transcription
- [ ] Build audio upload interface
- [ ] Implement extraction logic (requirements, pain points, budget hints)
- [ ] Connect to proposal generator
- [ ] Support multiple audio formats (mp3, wav, m4a)
- [ ] Meeting platform integrations (Zoom, Google Meet webhooks)

**Integration Example:**
```typescript
// Webhook from Fireflies.ai when meeting ends
app.post('/webhooks/fireflies', async (req) => {
  const { transcript, summary, meetingId } = req.body;

  // Extract proposal data
  const insights = await extractInsights(transcript);

  // Generate proposal
  const proposal = await generateProposal(insights);

  // Notify user
  await notify(user, `Proposal draft ready from ${meetingId}`);
});
```

---

### Phase 7: Pricing Intelligence (Week 13)
**Duration:** 1 week
**Team:** 1 ML engineer + 1 developer

**User Stories:**
- As a user, I get AI-recommended pricing
- As a user, I see win probability based on my price
- As a user, I can simulate different price points

**Tasks:**
- [ ] Build ML model for pricing (Python, scikit-learn)
- [ ] Train on historical data
- [ ] Create API endpoint for predictions
- [ ] Build pricing UI (interactive sliders)
- [ ] Display win probability
- [ ] Show margin impact of discounts

**ML Model:**
```python
# Training script
def train_pricing_model(historical_data):
    features = ['deal_size', 'industry', 'company_size', 'urgency', 'services']
    X = historical_data[features]
    y_win = historical_data['won']
    y_price = historical_data['price_paid']

    # Win probability model
    win_model = RandomForestClassifier()
    win_model.fit(X, y_win)

    # Optimal price model
    price_model = GradientBoostingRegressor()
    price_model.fit(X, y_price)

    return win_model, price_model
```

---

### Phase 8: E-Signature (Week 14)
**Duration:** 1 week
**Team:** 2 developers

**User Stories:**
- As a user, I can add signature fields to proposals
- As a prospect, I can sign on any device
- As a user, I get notified when signed

**Tasks:**
- [ ] Build signature field placement UI
- [ ] Create public signing page
- [ ] Implement signature capture (canvas drawing)
- [ ] Generate signed PDF
- [ ] Email signed copy to all parties
- [ ] Trigger "Closed Won" in CRM

---

### Phase 9: CRM Integrations (Weeks 15-16)
**Duration:** 2 weeks
**Team:** 2 developers

**Priority CRMs:**
1. HubSpot (most requested)
2. Salesforce (enterprise)
3. Pipedrive (mid-market)

**User Stories:**
- As a user, I can connect my CRM
- As a user, prospects auto-populate from CRM
- As a user, proposal events sync back to CRM

**Tasks:**
- [ ] Build OAuth flow for each CRM
- [ ] Implement data sync (contacts, deals)
- [ ] Create mapping interface (CRM fields → ProposalAI fields)
- [ ] Setup webhooks for real-time sync
- [ ] Handle rate limits & errors
- [ ] Build integration settings UI

---

### Phase 10: Team Collaboration (Week 17)
**Duration:** 1 week
**Team:** 2 developers

**User Stories:**
- As a manager, I can review proposals before they're sent
- As a team, we can comment on proposals
- As a user, I see who's viewing/editing in real-time

**Tasks:**
- [ ] Build approval workflow engine
- [ ] Implement commenting system
- [ ] Add real-time presence (Supabase realtime)
- [ ] Create notification rules
- [ ] Build approval dashboard

---

### Phase 11: Mobile App (Weeks 18-20)
**Duration:** 3 weeks
**Team:** 1 React Native developer

**User Stories:**
- As a user, I can view proposal analytics on mobile
- As a user, I receive push notifications
- As a user, I can quickly create proposals from templates

**Tasks:**
- [ ] Setup React Native project
- [ ] Build core screens (dashboard, proposal list, detail)
- [ ] Implement push notifications (Expo)
- [ ] Offline mode
- [ ] App Store & Play Store submission

---

### Phase 12: Landing Page & Marketing Site (Week 21)
**Duration:** 1 week
**Team:** 1 developer + 1 designer

**Tasks:**
- [ ] Build landing page (use landing-page-design.md)
- [ ] SEO optimization
- [ ] Create pricing page
- [ ] Build demo request form
- [ ] Implement analytics (PostHog)
- [ ] A/B testing setup

---

### Phase 13: Polish & Beta Testing (Weeks 22-24)
**Duration:** 3 weeks
**Team:** Full team

**Tasks:**
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Security audit
- [ ] Onboarding flow
- [ ] Help documentation
- [ ] Video tutorials
- [ ] Beta user testing (20 companies)
- [ ] Iterate based on feedback

---

## Timeline & Milestones

### Total Timeline: 6 Months (24 weeks)

**Month 1 (Weeks 1-4):** Foundation
- ✅ Milestone 1: Users can create and edit proposals
- **Demo:** Show drag-and-drop editor

**Month 2 (Weeks 5-8):** Core Features
- ✅ Milestone 2: AI-powered proposal generation
- ✅ Milestone 3: Send and track proposals
- **Demo:** Generate a proposal with AI, send, track views

**Month 3 (Weeks 9-12):** AI Advanced Features
- ✅ Milestone 4: Company research agent
- ✅ Milestone 5: Voice-to-proposal
- **Demo:** Upload call recording → Auto-generate proposal

**Month 4 (Weeks 13-16):** Business Logic
- ✅ Milestone 6: Pricing intelligence & e-signature
- ✅ Milestone 7: CRM integrations
- **Demo:** Show HubSpot sync, pricing recommendations

**Month 5 (Weeks 17-20):** Scale & Extend
- ✅ Milestone 8: Team collaboration
- ✅ Milestone 9: Mobile app
- **Demo:** Real-time collaboration, mobile app

**Month 6 (Weeks 21-24):** Launch Prep
- ✅ Milestone 10: Marketing site + Beta launch
- **Demo:** Public landing page, 20 beta customers

---

## Team Structure

### Minimum Viable Team (MVP - 6 months)

**Total Team Size:** 6-8 people

#### 1. Technical Team (5 people)

**Full-Stack Developer (Lead)** x 1
- Role: Technical lead, architecture decisions
- Skills: Next.js, TypeScript, Supabase, System design
- Responsibilities:
  - Project setup & architecture
  - Code reviews
  - Deployment & DevOps
- **You?** (Given your experience with hospital management system)

**Full-Stack Developer** x 2
- Skills: React, Next.js, API development
- Responsibilities:
  - Feature development
  - UI components
  - API endpoints

**AI/ML Engineer** x 1
- Skills: Python, OpenAI/Claude APIs, Prompt engineering
- Responsibilities:
  - AI integrations
  - Pricing model
  - Voice features

**Mobile Developer** x 1 (Part-time, Month 5-6)
- Skills: React Native, Expo
- Responsibilities:
  - Mobile app development

#### 2. Design Team (1 person)

**Product Designer**
- Skills: Figma, UI/UX, User research
- Responsibilities:
  - UI/UX design
  - Template design
  - User testing

#### 3. Product & Business (2 people)

**Product Manager**
- Responsibilities:
  - Feature prioritization
  - User research
  - Roadmap planning
  - Beta user management

**Founder/CEO**
- Responsibilities:
  - Vision & strategy
  - Fundraising
  - Sales & partnerships
  - Marketing

---

### Team Allocation by Phase

| Phase | Developers | Designer | PM |
|-------|-----------|----------|-----|
| Phase 0-1 | 2 | 0.5 | 0.5 |
| Phase 2-3 | 3 | 1 | 0.5 |
| Phase 4-8 | 3 | 0.5 | 0.5 |
| Phase 9-10 | 3 | 0.5 | 1 |
| Phase 11 | 4 (+ Mobile) | 0.5 | 1 |
| Phase 12-13 | 4 | 1 | 1 |

---

### Budget Estimate

**Total Budget (6 months MVP):** $250K - $350K

**Breakdown:**

**1. Team Salaries (6 months):**
- Lead Developer: $15K/mo x 6 = $90K
- Full-Stack Devs (2): $12K/mo x 2 x 6 = $144K
- AI/ML Engineer: $15K/mo x 6 = $90K
- Mobile Dev (part-time): $10K/mo x 2 = $20K
- Designer: $8K/mo x 6 = $48K
- Product Manager: $10K/mo x 6 = $60K
- **Subtotal:** $452K

**Alternative (Bootstrapped):**
- You (Founder/Lead Dev): Sweat equity
- 2 Full-stack devs: $144K
- 1 Designer (contractor): $24K (part-time)
- **Subtotal:** $168K

**2. Infrastructure & Tools (6 months):**
- Supabase Pro: $25/mo x 6 = $150
- Vercel Pro: $20/mo x 6 = $120
- OpenAI API: $500/mo x 6 = $3,000
- Anthropic API: $300/mo x 6 = $1,800
- ElevenLabs Pro: $22/mo x 6 = $132
- SendGrid: $20/mo x 6 = $120
- Stripe: Free
- Domain & SSL: $50
- Misc SaaS (Figma, GitHub, etc.): $100/mo x 6 = $600
- **Subtotal:** $5,972 (~$6K)

**3. Third-Party Integrations:**
- CRM API access: Mostly free
- Meeting intelligence (Fireflies): $20/mo x 6 = $120
- **Subtotal:** $120

**4. Marketing & Launch:**
- Landing page content: $2,000
- Beta user incentives: $5,000
- **Subtotal:** $7,000

**Total (Bootstrapped):** ~$180K for 6 months

---

## Deployment Strategy

### Development Environment
- **Hosting:** Vercel (Preview branches)
- **Database:** Supabase (Development project)
- **Domain:** dev.proposalai.com
- **Purpose:** Internal testing, feature demos

### Staging Environment
- **Hosting:** Vercel (Staging branch)
- **Database:** Supabase (Staging project)
- **Domain:** staging.proposalai.com
- **Purpose:** QA testing, client demos, beta users

### Production Environment
- **Hosting:** Vercel (Production branch)
- **Database:** Supabase (Production project with backups)
- **Domain:** app.proposalai.com
- **CDN:** Cloudflare
- **Monitoring:** Sentry, Better Stack
- **Uptime:** 99.9% SLA

---

### Git Workflow

**Branch Strategy:**
```
main (production)
  └── develop (staging)
        ├── feature/ai-research
        ├── feature/voice-integration
        ├── feature/crm-hubspot
        └── bugfix/editor-drag-drop
```

**Process:**
1. Create feature branch from `develop`
2. Develop feature
3. Open PR to `develop`
4. Code review + CI checks pass
5. Merge to `develop` → Auto-deploy to staging
6. QA testing on staging
7. Weekly release: Merge `develop` to `main` → Deploy to production

---

### CI/CD Pipeline

**GitHub Actions:**
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

**Vercel Auto-Deploy:**
- Push to `develop` → Deploy to staging.proposalai.com
- Push to `main` → Deploy to app.proposalai.com
- Feature branches → Deploy to unique preview URLs

---

## Testing Strategy

### Unit Tests
- **Framework:** Jest + React Testing Library
- **Coverage Target:** >80%
- **What to test:**
  - Utility functions
  - React hooks
  - API route handlers

```bash
npm run test
npm run test:coverage
```

### Integration Tests
- **Framework:** Playwright
- **What to test:**
  - User flows (signup, create proposal, send, sign)
  - API integrations
  - Payment flows

```bash
npm run test:e2e
```

### Manual QA Checklist
- [ ] Can create account
- [ ] Can create proposal from template
- [ ] AI generation works
- [ ] Can send proposal
- [ ] Tracking works (open email, check analytics)
- [ ] Can sign proposal
- [ ] CRM sync works
- [ ] Payment processing works
- [ ] Mobile app works

---

## Launch Checklist

### Pre-Launch (1 month before)
- [ ] Feature freeze
- [ ] Security audit
- [ ] Performance testing (load test with 1000 concurrent users)
- [ ] Backup & disaster recovery plan
- [ ] Legal: Terms of Service, Privacy Policy, GDPR compliance
- [ ] Pricing finalized in Stripe
- [ ] Help documentation complete
- [ ] Video tutorials recorded
- [ ] Landing page live
- [ ] Beta users giving feedback

### Launch Week
- [ ] Final bug fixes
- [ ] Deploy to production
- [ ] Monitor for errors (Sentry)
- [ ] Support team ready (Intercom/email)
- [ ] Social media announcements
- [ ] Product Hunt launch
- [ ] Press outreach
- [ ] LinkedIn posts

### Post-Launch (First month)
- [ ] Daily monitoring of metrics
- [ ] User feedback surveys
- [ ] Fix critical bugs within 24 hours
- [ ] Onboarding calls with new customers
- [ ] Iterate based on feedback
- [ ] Plan next features

---

## Success Metrics (First 6 Months Post-Launch)

**User Acquisition:**
- 500 signups
- 100 paying customers
- $10K MRR (Monthly Recurring Revenue)

**Product Metrics:**
- 10,000 proposals created
- 70% of proposals use AI generation
- 35% average win rate
- 4.5/5 customer satisfaction

**Technical Metrics:**
- <2s page load time
- 99.9% uptime
- <500ms API response time
- <5% error rate

---

## Risk Mitigation

### Technical Risks

**Risk 1: AI API Costs Spiral Out of Control**
- Mitigation: Implement rate limiting, caching, usage quotas per plan
- Fallback: Use cheaper models (GPT-3.5) for non-critical features

**Risk 2: Supabase Downtime**
- Mitigation: Daily backups, have migration plan to self-hosted PostgreSQL
- Fallback: Read-only mode during downtime

**Risk 3: Performance Issues at Scale**
- Mitigation: Implement Redis caching, database indexing, CDN for assets
- Load testing before launch

### Business Risks

**Risk 4: Low User Adoption**
- Mitigation: Beta test with 20 companies, iterate on feedback
- Have clear onboarding flow, video tutorials

**Risk 5: Competitors (PandaDoc, Proposify)**
- Mitigation: Focus on AI differentiation, faster implementation, better UX
- Build moat with proprietary AI models

**Risk 6: Burn Rate Too High**
- Mitigation: Start with bootstrapped budget ($180K)
- Get to revenue before raising external funding

---

## Next Steps (Week 1)

**Immediate Actions:**

1. **Setup Development Environment (Day 1):**
   - [ ] Create Supabase project
   - [ ] Get OpenAI API key
   - [ ] Initialize Next.js project
   - [ ] Setup Git repository

2. **Database Schema (Day 2-3):**
   - [ ] Design tables (users, organizations, proposals, etc.)
   - [ ] Write migration scripts
   - [ ] Setup Row Level Security

3. **Authentication (Day 4-5):**
   - [ ] Implement Supabase Auth
   - [ ] Create login/signup pages
   - [ ] Setup OAuth (Google, Microsoft)

4. **Dashboard Layout (Day 6-7):**
   - [ ] Create navigation
   - [ ] Build dashboard skeleton
   - [ ] Setup routing

---

## Conclusion

This project plan provides a complete roadmap from local setup to production launch. By following these phases, you'll build a competitive AI-powered proposal management platform in 6 months.

**Key Takeaways:**
- Start simple: Get proposal editor working first
- Layer AI features progressively
- Test with real users early (Phase 13)
- Keep infrastructure costs low with Supabase + Vercel
- Focus on HubSpot integration first (highest demand)

**Your Advantage:**
With your experience building hospital management systems with Supabase + AI, you're well-positioned to build this. The core tech stack is the same, just applied to proposal management.

**Questions to Answer Before Starting:**
1. Solo founder or building a team?
2. Bootstrapped or raising funds?
3. Full-time or side project?
4. Target launch date?

Ready to start building? Begin with Phase 0 and let's create something amazing! 🚀
