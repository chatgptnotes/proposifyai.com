# ProposalAI - Core Functionalities & Features

## 1. User Management & Authentication

### 1.1 Authentication System
**Tech Stack:** Supabase Auth, NextAuth.js

**Features:**
- Email/password authentication
- OAuth (Google, Microsoft, LinkedIn)
- SSO (SAML) for Enterprise
- Two-factor authentication (2FA)
- Magic link login
- Role-based access control (RBAC)

**User Roles:**
- **Super Admin:** Full platform access
- **Admin:** Team management, billing, settings
- **Manager:** View all team proposals, approvals
- **Sales Rep:** Create, edit own proposals
- **Viewer:** Read-only access

**Database Schema:**
```sql
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  full_name text,
  avatar_url text,
  role user_role,
  organization_id uuid REFERENCES organizations,
  settings jsonb,
  created_at timestamp,
  last_login timestamp
)

organizations (
  id uuid PRIMARY KEY,
  name text,
  domain text,
  plan subscription_plan,
  logo_url text,
  brand_settings jsonb,
  created_at timestamp
)
```

---

## 2. AI Research Agent

### 2.1 Company Intelligence Scraper
**Tech Stack:** Puppeteer, OpenAI GPT-4, Firecrawl API

**Workflow:**
1. User inputs company URL or LinkedIn profile
2. AI agent scrapes:
   - Company website (About, Services, Team)
   - LinkedIn profile (size, industry, recent posts)
   - Recent news articles (Google News API)
   - Crunchbase data (funding, competitors)
   - Glassdoor reviews (culture insights)
3. AI summarizes findings into structured brief

**AI Prompts:**
```
Analyze this company data and extract:
1. Company overview (1-2 sentences)
2. Key pain points (3-5 likely challenges)
3. Decision makers (roles, names if available)
4. Competitors (3-5 companies)
5. Recent news/events
6. Recommended positioning angles
```

**API Endpoints:**
```
POST /api/research/company
Body: { url: string, depth: 'quick' | 'deep' }
Response: CompanyIntelligence

GET /api/research/{research_id}
Response: CompanyIntelligence with status
```

**Database Schema:**
```sql
company_research (
  id uuid PRIMARY KEY,
  prospect_id uuid REFERENCES prospects,
  url text,
  scraped_data jsonb,
  ai_summary jsonb,
  pain_points text[],
  competitors text[],
  news jsonb[],
  created_at timestamp,
  updated_at timestamp
)
```

**UI Components:**
- Research input modal
- Live scraping progress indicator
- Structured intelligence brief display
- Export to PDF option

---

### 2.2 Stakeholder Mapping
**Tech Stack:** LinkedIn API, Hunter.io, Clearbit

**Features:**
- Identify decision-makers from LinkedIn
- Extract contact information (email, phone)
- Map organizational hierarchy
- Identify champion vs. blocker signals

**Database Schema:**
```sql
stakeholders (
  id uuid PRIMARY KEY,
  prospect_id uuid REFERENCES prospects,
  name text,
  title text,
  email text,
  linkedin_url text,
  role stakeholder_role, -- champion, influencer, blocker, decision_maker
  notes text,
  created_at timestamp
)
```

---

## 3. AI Proposal Generator

### 3.1 Content Generation Engine
**Tech Stack:** OpenAI GPT-4, Claude 3.5 Sonnet, Anthropic API

**Core Features:**

#### Intelligent Section Writing
- **Executive Summary:** Auto-generated from company research + service offering
- **Problem Statement:** Pulled from pain points identified in research
- **Proposed Solution:** Matched from content library + customized
- **Pricing:** AI-recommended based on deal parameters
- **Case Studies:** Auto-selected relevant examples
- **Timeline:** Generated based on project scope
- **Terms & Conditions:** Template-based with customizations

**AI Generation Workflow:**
```typescript
interface ProposalGenerationRequest {
  prospectId: string;
  templateId: string;
  serviceIds: string[];
  dealValue: number;
  customInstructions?: string;
}

// AI Prompt Structure
const generateProposal = async (request) => {
  const context = await buildContext(request);

  const systemPrompt = `
    You are an expert proposal writer for ${context.industry}.
    Generate a personalized proposal section using:
    - Company research: ${context.research}
    - Services: ${context.services}
    - Tone: ${context.tone}
    - Approved content library: ${context.contentLibrary}
  `;

  return await claude.generate({
    system: systemPrompt,
    prompt: `Write an executive summary that addresses these pain points: ${context.painPoints}`,
    max_tokens: 1000
  });
};
```

**API Endpoints:**
```
POST /api/proposals/generate
Body: ProposalGenerationRequest
Response: { proposalId, sections[], status }

POST /api/proposals/{id}/regenerate-section
Body: { sectionId, customPrompt }
Response: { sectionId, content }

POST /api/proposals/{id}/adjust-tone
Body: { tone: 'professional' | 'casual' | 'technical' }
Response: Updated proposal
```

---

### 3.2 Tone Adjustment Engine
**Tech Stack:** GPT-4, Custom prompt engineering

**Tone Options:**
- **Professional:** Formal, corporate language
- **Casual:** Friendly, conversational tone
- **Technical:** Industry jargon, detailed specs
- **Executive:** High-level, ROI-focused
- **Consultative:** Advisory, problem-solving

**Implementation:**
```typescript
const adjustTone = async (content: string, tone: ToneType) => {
  const tonePrompts = {
    professional: "Rewrite in formal business language...",
    casual: "Make this friendly and conversational...",
    technical: "Add technical depth with industry terminology...",
  };

  return await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: tonePrompts[tone] },
      { role: "user", content }
    ]
  });
};
```

---

### 3.3 Multi-Language Translation
**Tech Stack:** GPT-4 Turbo, DeepL API

**Supported Languages:**
- **Professional Plan:** 10 languages (EN, ES, FR, DE, PT, HI, ZH, JA, AR, NL)
- **Enterprise Plan:** 50+ languages

**Features:**
- Instant proposal translation
- Industry-specific terminology preservation
- Brand voice consistency across languages
- Right-to-left (RTL) support for Arabic/Hebrew

**API Endpoint:**
```
POST /api/proposals/{id}/translate
Body: { targetLanguage: string }
Response: Translated proposal
```

---

## 4. Voice AI Integration

### 4.1 Voice-to-Proposal
**Tech Stack:** ElevenLabs, Whisper AI, Assembly AI

**Workflow:**
1. User records/uploads client call
2. Whisper AI transcribes audio
3. AI extracts key information:
   - Client requirements
   - Pain points mentioned
   - Budget hints
   - Timeline expectations
   - Objections/concerns
4. Auto-generates proposal sections

**Implementation:**
```typescript
const processVoiceToProposal = async (audioFile: File) => {
  // Step 1: Transcribe
  const transcript = await whisper.transcribe(audioFile);

  // Step 2: Extract insights
  const insights = await claude.analyze({
    prompt: `Extract from this sales call:
    1. Client requirements
    2. Pain points
    3. Budget indicators
    4. Objections raised

    Transcript: ${transcript}`
  });

  // Step 3: Generate proposal
  return await generateProposal({
    insights,
    templateId: 'voice-generated'
  });
};
```

**API Endpoints:**
```
POST /api/voice/upload
Body: FormData { audioFile }
Response: { transcriptId, status }

GET /api/voice/transcript/{id}
Response: { transcript, insights }

POST /api/voice/generate-proposal
Body: { transcriptId, templateId }
Response: { proposalId }
```

---

### 4.2 Voice Cloning for Personalized Videos
**Tech Stack:** ElevenLabs Voice Cloning, HeyGen, D-ID

**Features:**
- Clone user's voice from 5-minute sample
- Generate personalized video intros for each proposal
- AI avatar speaks in cloned voice
- Support for multiple languages with voice cloning

**Workflow:**
1. Admin uploads voice sample (one-time setup)
2. ElevenLabs trains voice model (~10 minutes)
3. For each proposal:
   - AI generates personalized script
   - Text-to-speech using cloned voice
   - HeyGen creates video with AI avatar
   - Embed video in proposal header

**Database Schema:**
```sql
voice_models (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  elevenlabs_voice_id text,
  sample_audio_url text,
  status voice_status, -- training, ready, failed
  created_at timestamp
)

proposal_videos (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  script text,
  video_url text,
  duration_seconds integer,
  created_at timestamp
)
```

---

### 4.3 Meeting Intelligence Integration
**Tech Stack:** Gong API, Fireflies.ai API, Zoom SDK

**Features:**
- Auto-import meeting recordings
- Extract client requirements from transcript
- Identify buying signals & objections
- Auto-populate proposal fields

**Integration Flow:**
```typescript
// Webhook from Fireflies when meeting ends
app.post('/webhooks/fireflies/meeting-completed', async (req) => {
  const { meetingId, transcript, summary } = req.body;

  // Extract proposal data
  const proposalData = await extractProposalData(transcript);

  // Create draft proposal
  const proposal = await createDraftProposal({
    ...proposalData,
    source: 'meeting',
    meetingId
  });

  // Notify user
  await notifyUser({
    message: `Draft proposal ready from ${meetingId}`,
    proposalId: proposal.id
  });
});
```

---

## 5. Intelligent Pricing Engine

### 5.1 AI Pricing Recommendations
**Tech Stack:** Python ML models, TensorFlow, Historical data analysis

**Pricing Factors:**
- Deal size category (small, medium, large, enterprise)
- Client industry
- Company size (employees, revenue)
- Geographical region
- Historical win rates at different price points
- Competitor pricing (if available)
- Client budget signals from research

**ML Model:**
```python
# Pricing prediction model
class PricingRecommendationModel:
    def predict_optimal_price(self, features):
        """
        Features:
        - deal_size: int
        - industry: str
        - company_size: int
        - region: str
        - service_ids: list
        - urgency: str

        Returns:
        - recommended_price: float
        - confidence: float (0-1)
        - win_probability: float (0-1)
        """
        pass
```

**API Endpoints:**
```
POST /api/pricing/recommend
Body: {
  prospectId: string,
  serviceIds: string[],
  dealSize: number,
  industry: string
}
Response: {
  recommendedPrice: number,
  confidence: number,
  winProbability: number,
  priceRange: { min, max },
  reasoning: string
}

POST /api/pricing/analyze-discount
Body: { originalPrice, discountPercent }
Response: {
  marginImpact: number,
  winProbabilityChange: number,
  recommendation: string
}
```

**Database Schema:**
```sql
pricing_recommendations (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  recommended_price decimal,
  confidence_score decimal,
  win_probability decimal,
  factors_considered jsonb,
  created_at timestamp
)

pricing_analytics (
  id uuid PRIMARY KEY,
  organization_id uuid,
  service_id uuid,
  price_point decimal,
  win_rate decimal,
  total_proposals integer,
  avg_deal_size decimal,
  period_start date,
  period_end date
)
```

---

### 5.2 Win Probability Scoring
**Tech Stack:** Scikit-learn, Historical win/loss data

**Scoring Factors:**
- Pricing competitiveness
- Proposal personalization score
- Client engagement metrics
- Time to send after meeting
- Stakeholder mapping completeness
- Competitor presence (if known)
- Deal stage

**Implementation:**
```python
def calculate_win_probability(proposal):
    features = {
        'pricing_score': get_pricing_competitiveness(proposal),
        'personalization_score': get_personalization_score(proposal),
        'engagement_score': get_engagement_score(proposal),
        'timing_score': get_timing_score(proposal),
        'stakeholder_coverage': get_stakeholder_coverage(proposal),
        'response_time_hours': get_response_time(proposal)
    }

    # ML model trained on historical wins/losses
    probability = win_probability_model.predict(features)

    return {
        'probability': probability,
        'confidence': calculate_confidence(features),
        'key_factors': get_top_factors(features)
    }
```

**UI Display:**
- Win probability gauge (0-100%)
- Traffic light indicator (red <30%, yellow 30-60%, green >60%)
- Breakdown of contributing factors
- Actionable recommendations to improve score

---

### 5.3 Dynamic Package Bundling
**Tech Stack:** Recommendation engine, Collaborative filtering

**Features:**
- AI suggests service bundles based on:
  - Client industry
  - Historical bundles that converted
  - Complementary services
  - Upsell opportunities
- Dynamic pricing for bundles (volume discounts)
- "Customers like this also bought..." recommendations

**API Endpoint:**
```
POST /api/pricing/recommend-bundles
Body: {
  prospectId: string,
  selectedServices: string[]
}
Response: {
  bundles: [{
    services: Service[],
    bundlePrice: number,
    savings: number,
    reason: string
  }]
}
```

---

## 6. Proposal Editor

### 6.1 Drag-and-Drop Editor
**Tech Stack:** React DnD, TipTap (Rich text editor), Lexical

**Features:**
- Drag sections to reorder
- Block-based editing (text, images, pricing tables, videos)
- Real-time preview
- Mobile-responsive preview mode
- Undo/redo
- Auto-save (every 3 seconds)

**Block Types:**
- Text block (rich text)
- Image block (upload or URL)
- Video block (YouTube, Vimeo, custom)
- Pricing table block
- Timeline/Gantt chart
- Team member showcase
- Case study card
- Testimonial block
- Call-to-action button
- E-signature field

**Database Schema:**
```sql
proposals (
  id uuid PRIMARY KEY,
  organization_id uuid REFERENCES organizations,
  created_by uuid REFERENCES users,
  prospect_id uuid REFERENCES prospects,
  template_id uuid REFERENCES templates,
  title text,
  status proposal_status,
  blocks jsonb, -- Array of block objects
  settings jsonb,
  sent_at timestamp,
  viewed_at timestamp,
  signed_at timestamp,
  created_at timestamp,
  updated_at timestamp
)

proposal_blocks (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  type block_type,
  content jsonb,
  order integer,
  settings jsonb
)
```

---

### 6.2 Template Library
**Tech Stack:** Supabase Storage, Next.js

**Template Categories:**
- Industry-specific (Healthcare, SaaS, Consulting, etc.)
- Purpose-based (Sales, Partnership, Grant, RFP Response)
- Length (1-page, 5-page, 20-page)
- Style (Minimal, Bold, Corporate, Creative)

**Template Structure:**
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  blocks: Block[];
  settings: {
    colorScheme: ColorScheme;
    typography: Typography;
    spacing: SpacingConfig;
  };
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}
```

**Features:**
- 50+ pre-built templates
- Create custom templates
- Save proposal as template
- Share templates with team
- Template analytics (usage, win rates)

**API Endpoints:**
```
GET /api/templates
Query: { category?, search?, sortBy? }
Response: Template[]

POST /api/templates
Body: Template
Response: Created template

POST /api/proposals/{id}/save-as-template
Body: { name, description, isPublic }
Response: Template
```

---

### 6.3 Content Library
**Tech Stack:** Supabase, Algolia Search

**Content Types:**
- Service descriptions
- Case studies
- Testimonials
- Team bios
- Pricing tables
- Terms & conditions
- Company overview
- Value propositions

**Features:**
- Centralized approved content
- Content versioning
- Tag-based organization
- Smart search (semantic)
- Usage tracking
- Content locking (prevent edits in proposals)
- AI-suggested content insertion

**Database Schema:**
```sql
content_library (
  id uuid PRIMARY KEY,
  organization_id uuid REFERENCES organizations,
  type content_type,
  title text,
  content text,
  tags text[],
  is_approved boolean,
  is_locked boolean,
  version integer,
  usage_count integer,
  created_by uuid REFERENCES users,
  created_at timestamp,
  updated_at timestamp
)

content_usage (
  id uuid PRIMARY KEY,
  content_id uuid REFERENCES content_library,
  proposal_id uuid REFERENCES proposals,
  inserted_at timestamp
)
```

---

### 6.4 Brand Consistency Controls
**Tech Stack:** Custom design system, Color palette validator

**Features:**
- Upload brand guidelines
- Lock colors, fonts, logos
- Enforce brand templates
- Auto-detect off-brand elements
- Preview in brand colors

**Brand Settings:**
```typescript
interface BrandSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSizes: Record<string, string>;
  };
  logos: {
    primary: string;
    secondary?: string;
    favicon: string;
  };
  spacing: SpacingSystem;
  borderRadius: string;
  locked: boolean; // Prevent overrides
}
```

---

## 7. Engagement Tracking & Analytics

### 7.1 Real-Time Tracking
**Tech Stack:** PostHog, Custom analytics, WebSocket

**Tracked Events:**
- Proposal opened
- Time spent per section
- Sections re-visited
- Scroll depth
- Downloads (PDF export)
- Links clicked
- Videos played
- Pricing table interactions

**Implementation:**
```typescript
// Client-side tracking
const trackProposalView = () => {
  const tracker = new ProposalTracker(proposalId);

  // Track opens
  tracker.track('proposal_opened', { timestamp: Date.now() });

  // Track scroll depth
  window.addEventListener('scroll', debounce(() => {
    tracker.track('scroll_depth', {
      percentage: getScrollPercentage(),
      section: getCurrentSection()
    });
  }, 1000));

  // Track time per section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tracker.startTimer(entry.target.id);
      } else {
        tracker.stopTimer(entry.target.id);
      }
    });
  });
};
```

**Database Schema:**
```sql
proposal_analytics (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  event_type analytics_event,
  event_data jsonb,
  session_id text,
  ip_address inet,
  user_agent text,
  created_at timestamp
)

proposal_summaries (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  total_views integer,
  unique_viewers integer,
  avg_time_spent interval,
  sections_viewed jsonb,
  last_viewed_at timestamp,
  updated_at timestamp
)
```

---

### 7.2 Notifications
**Tech Stack:** Twilio SendGrid, Slack API, Push notifications

**Notification Types:**
- **Instant:**
  - Proposal opened for first time
  - Proposal signed
  - Comment left by prospect

- **Digest:**
  - Daily summary of proposal activity
  - Weekly win/loss report
  - Monthly team performance

**Notification Channels:**
- Email
- Slack message
- In-app notification
- SMS (for high-value deals)
- Browser push notification

**Implementation:**
```typescript
const sendNotification = async (event: AnalyticsEvent) => {
  const proposal = await getProposal(event.proposalId);
  const user = await getUser(proposal.createdBy);

  // Determine notification channels based on user preferences
  const channels = user.notificationSettings[event.type];

  if (channels.includes('email')) {
    await sendEmail({
      to: user.email,
      subject: `${proposal.title} was just opened!`,
      template: 'proposal-opened',
      data: { proposal, event }
    });
  }

  if (channels.includes('slack')) {
    await sendSlackMessage({
      channel: user.slackChannelId,
      text: `:eyes: ${proposal.title} opened by ${event.ipAddress}`,
      blocks: buildSlackBlocks(proposal, event)
    });
  }
};
```

---

### 7.3 Deal Health Scoring
**Tech Stack:** ML model, Predictive analytics

**Health Score Factors:**
- Time since sent
- Engagement level (views, time spent)
- Section completion rate
- Pricing table views
- Stakeholder views (if multiple)
- Follow-up response time
- Win probability score

**Score Categories:**
- 🟢 **Hot (80-100):** High engagement, likely to close
- 🟡 **Warm (50-79):** Moderate interest, needs follow-up
- 🔴 **Cold (0-49):** Low engagement, at risk

**UI Display:**
- Deal health dashboard
- Pipeline view with color-coded health
- Alerts for deals turning cold
- Recommended actions (e.g., "Send follow-up now")

---

### 7.4 AI Follow-Up Suggestions
**Tech Stack:** GPT-4, Engagement pattern analysis

**Features:**
- Suggest optimal follow-up time (based on engagement patterns)
- Generate personalized follow-up messages
- Identify sections that need clarification
- Recommend next best action

**Example:**
```
Deal Health: 🟡 Warm (65)

Insights:
- Opened 3 times but spent only 2 mins
- Skipped pricing section
- Viewed case studies thoroughly

AI Recommendation:
"Follow up tomorrow at 10 AM. Address pricing concerns and offer a quick call to discuss budget. Mention Case Study #2 they viewed."

Suggested Message:
"Hi [Name], I noticed you reviewed our case study with [Company]. Would you like to discuss how we can achieve similar results for [Their Company]? Happy to jump on a quick call to address any questions, especially around pricing options."
```

---

## 8. E-Signature & Closing

### 8.1 Integrated E-Signature
**Tech Stack:** Custom e-signature (DocuSign API alternative), PDF.js

**Features:**
- Drag-and-drop signature fields
- Type, draw, or upload signature
- Multi-signer support
- Signing order enforcement
- Witness signatures
- Mobile-friendly signing
- Audit trail

**Workflow:**
1. User adds signature fields to proposal
2. Marks fields as required/optional
3. Sends proposal with signature request
4. Prospect receives email with "Sign Now" link
5. Prospect signs on any device
6. All parties receive signed PDF
7. Auto-update CRM with "Closed Won"

**Database Schema:**
```sql
signatures (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  signer_email text,
  signer_name text,
  signature_data text, -- Base64 encoded
  ip_address inet,
  signed_at timestamp,
  audit_trail jsonb
)

signature_fields (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  field_type signature_field_type, -- signature, initial, date, text
  position jsonb, -- { page, x, y, width, height }
  is_required boolean,
  assigned_to text, -- email
  order integer
)
```

---

### 8.2 Payment Integration
**Tech Stack:** Stripe, PayPal

**Features:**
- Accept deposits/full payment with proposal
- Multiple payment methods (card, ACH, wire)
- Payment plans (installments)
- Automatic invoicing
- Payment status tracking

**Workflow:**
1. Add "Pay Now" button to proposal
2. Prospect clicks → Stripe Checkout modal
3. Payment processed
4. Proposal auto-marked as "Paid"
5. Receipt emailed to prospect
6. Accounting integration (QuickBooks sync)

**API Endpoints:**
```
POST /api/proposals/{id}/add-payment
Body: {
  amount: number,
  currency: string,
  paymentType: 'full' | 'deposit' | 'installment'
}
Response: { checkoutUrl }

GET /api/proposals/{id}/payment-status
Response: {
  status: 'pending' | 'paid' | 'failed',
  amount: number,
  paidAt?: timestamp
}
```

---

### 8.3 Contract Management
**Tech Stack:** PostgreSQL, Supabase Storage

**Features:**
- Store signed contracts
- Version control
- Renewal reminders
- Contract search & filter
- Bulk export

**Database Schema:**
```sql
contracts (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  organization_id uuid REFERENCES organizations,
  client_name text,
  contract_value decimal,
  start_date date,
  end_date date,
  renewal_date date,
  status contract_status,
  signed_pdf_url text,
  created_at timestamp
)
```

---

## 9. CRM Integration

### 9.1 Supported CRMs
- Salesforce
- HubSpot
- Pipedrive
- Zoho CRM
- Close CRM
- Copper
- ActiveCampaign

### 9.2 Integration Features

**Two-Way Sync:**
- Import contacts → prospects
- Sync deal stages
- Update opportunity value
- Log proposal activities
- Update deal status (Closed Won/Lost)

**Auto-Population:**
- Company name, contact info
- Deal size, industry
- Notes from CRM
- Previous interactions

**Webhooks:**
- Real-time updates on proposal events
- Create CRM task on proposal open
- Update deal stage on signature

**Implementation Example (HubSpot):**
```typescript
// Sync proposal to HubSpot deal
const syncToHubSpot = async (proposal: Proposal) => {
  const hubspot = new HubSpotClient(user.hubspotToken);

  // Find or create deal
  const deal = await hubspot.crm.deals.upsert({
    properties: {
      dealname: proposal.title,
      amount: proposal.totalValue,
      dealstage: mapStatusToDealStage(proposal.status),
      closedate: proposal.expectedCloseDate,
      pipeline: 'default'
    }
  });

  // Log activity
  await hubspot.crm.timeline.create({
    eventType: 'proposal_sent',
    objectId: deal.id,
    properties: {
      proposalUrl: getProposalUrl(proposal.id),
      sentAt: proposal.sentAt
    }
  });

  // Store mapping
  await saveCRMMapping(proposal.id, 'hubspot', deal.id);
};
```

---

## 10. Team Collaboration

### 10.1 Internal Approval Workflows
**Tech Stack:** Supabase real-time, Email notifications

**Features:**
- Configure approval rules (e.g., deals >$50K need manager approval)
- Multi-stage approvals
- Parallel vs. sequential approval
- Comments & feedback
- Version comparison
- Approval history

**Workflow Example:**
1. Sales rep creates proposal
2. System checks approval rules
3. Proposal routed to manager
4. Manager reviews, adds comments
5. Rep makes edits
6. Manager approves
7. Proposal unlocked for sending

**Database Schema:**
```sql
approval_workflows (
  id uuid PRIMARY KEY,
  organization_id uuid REFERENCES organizations,
  name text,
  rules jsonb, -- Conditions that trigger this workflow
  stages jsonb, -- Array of approval stages
  is_active boolean
)

approval_requests (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  workflow_id uuid REFERENCES approval_workflows,
  stage integer,
  approver_id uuid REFERENCES users,
  status approval_status,
  comments text,
  decided_at timestamp,
  created_at timestamp
)
```

---

### 10.2 Real-Time Collaboration
**Tech Stack:** Supabase Realtime, Yjs (CRDT)

**Features:**
- See who's viewing/editing (presence)
- Cursor tracking
- Live updates
- Comment threads
- @mentions
- Resolve comments

**Implementation:**
```typescript
// Supabase Realtime presence
const channel = supabase.channel(`proposal:${proposalId}`);

channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    updateCollaborators(state);
  })
  .on('broadcast', { event: 'cursor' }, ({ payload }) => {
    updateCursor(payload.userId, payload.position);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      });
    }
  });
```

---

### 10.3 Comments & Feedback
**Tech Stack:** React, Supabase

**Features:**
- Inline comments on specific sections
- Reply threads
- Resolve/unresolve
- @mentions with notifications
- Prospect comments (on published proposal)

**Database Schema:**
```sql
comments (
  id uuid PRIMARY KEY,
  proposal_id uuid REFERENCES proposals,
  block_id uuid, -- Reference to specific block
  author_id uuid REFERENCES users,
  author_email text, -- For prospect comments
  content text,
  parent_id uuid REFERENCES comments, -- For replies
  is_resolved boolean,
  created_at timestamp
)
```

---

## 11. Reporting & Analytics

### 11.1 Dashboard Metrics
**Tech Stack:** Recharts, D3.js, Supabase Views

**Key Metrics:**
- Total proposals sent
- Win rate (overall, by rep, by template)
- Average deal size
- Sales cycle length
- Proposal-to-close time
- Revenue generated
- Forecast accuracy

**Dashboard Sections:**
1. **Overview:**
   - Proposals sent this month
   - Open proposals
   - Closed won/lost
   - Revenue pipeline

2. **Performance:**
   - Win rate trend (last 6 months)
   - Average time to close
   - Proposals by stage (funnel)

3. **Team Leaderboard:**
   - Top performers by win rate
   - Most proposals sent
   - Highest revenue

4. **Content Analytics:**
   - Top-performing templates
   - Most-used content from library
   - Section engagement rates

---

### 11.2 Win/Loss Analysis
**Tech Stack:** AI analysis, Pattern recognition

**Features:**
- Identify patterns in won vs. lost deals
- Common characteristics of wins
- Pricing analysis (optimal price points)
- Template performance comparison
- Competitor win/loss tracking

**AI Insights:**
```
Win Pattern Analysis:
✅ Deals with video intros have 42% higher win rate
✅ Proposals sent within 24 hours of meeting win 2x more
✅ Case studies from same industry increase win rate by 28%
✅ Pricing in middle range ($25K-$50K) has highest win rate
❌ Generic executive summaries correlate with 31% loss rate
```

---

### 11.3 Content Performance
**Tech Stack:** Analytics aggregation

**Tracked Metrics per Content:**
- Usage frequency
- Win rate when included
- Average time spent viewing
- Section completion rate

**Recommendations:**
- "Your 'Healthcare Case Study #3' has 67% win rate - use it more!"
- "Testimonials from executives get 3x more attention"
- "Proposals with videos are viewed 2.4x longer"

---

## 12. Workflow Automation

### 12.1 Make.com Integration
**Tech Stack:** Make.com, Webhooks, API

**Pre-Built Scenarios:**
1. **New Lead → Auto-Research → Draft Proposal:**
   - Trigger: New lead in CRM
   - Action 1: Run company research
   - Action 2: Generate draft proposal
   - Action 3: Notify sales rep

2. **Proposal Opened → Send Slack Alert:**
   - Trigger: Proposal viewed
   - Action: Post to Slack channel

3. **Proposal Signed → Update CRM + Invoice:**
   - Trigger: Proposal signed
   - Action 1: Mark deal as Closed Won in CRM
   - Action 2: Create invoice in QuickBooks
   - Action 3: Send thank you email

4. **Deal Going Cold → Nudge Rep:**
   - Trigger: No activity for 5 days
   - Action 1: Calculate deal health
   - Action 2: If score <50, send email to rep
   - Action 3: Create follow-up task in CRM

---

### 12.2 Zapier Integration
**Available Triggers:**
- New proposal created
- Proposal sent
- Proposal opened
- Proposal signed
- Proposal declined
- Comment added

**Available Actions:**
- Create proposal from template
- Send proposal to prospect
- Update proposal status
- Add comment to proposal

---

## 13. Mobile App

### 13.1 React Native App
**Platform:** iOS & Android

**Features:**
- View proposal analytics on-the-go
- Receive push notifications
- Quick proposal creation from templates
- Voice memo → Proposal generation
- Mobile signature capture
- Offline mode (cached proposals)

**Key Screens:**
1. Dashboard (pipeline view)
2. Proposal list (filter, search)
3. Proposal detail (analytics)
4. Quick create
5. Notifications
6. Settings

---

### 13.2 Progressive Web App (PWA)
**Tech Stack:** Next.js PWA

**Features:**
- Install on mobile without app store
- Offline access to proposals
- Push notifications
- Fast loading (service worker caching)

---

## 14. API & Developer Platform

### 14.1 RESTful API
**Base URL:** `https://api.proposalai.com/v1`

**Authentication:** Bearer token (JWT)

**Endpoints:**
```
# Proposals
GET    /proposals
POST   /proposals
GET    /proposals/:id
PUT    /proposals/:id
DELETE /proposals/:id
POST   /proposals/:id/send
GET    /proposals/:id/analytics

# Templates
GET    /templates
POST   /templates
GET    /templates/:id

# Prospects
GET    /prospects
POST   /prospects
GET    /prospects/:id

# AI
POST   /ai/generate-proposal
POST   /ai/research-company
POST   /ai/optimize-pricing
```

**Rate Limits:**
- Free tier: 100 requests/hour
- Professional: 1,000 requests/hour
- Enterprise: Unlimited

---

### 14.2 Webhooks
**Supported Events:**
- `proposal.created`
- `proposal.sent`
- `proposal.opened`
- `proposal.viewed`
- `proposal.signed`
- `proposal.declined`
- `comment.added`

**Webhook Configuration:**
```typescript
{
  url: "https://your-app.com/webhooks/proposalai",
  events: ["proposal.signed", "proposal.opened"],
  secret: "whsec_xxxxx"
}
```

---

### 14.3 SDKs
**Available SDKs:**
- JavaScript/TypeScript
- Python
- Ruby
- Go

**Example (JavaScript SDK):**
```typescript
import ProposalAI from '@proposalai/node';

const client = new ProposalAI({ apiKey: process.env.PROPOSALAI_API_KEY });

// Create proposal
const proposal = await client.proposals.create({
  templateId: 'tpl_xxxxx',
  prospectId: 'prs_xxxxx',
  customData: {
    projectName: 'Website Redesign',
    dealValue: 50000
  }
});

// Send proposal
await client.proposals.send(proposal.id, {
  recipientEmail: 'client@example.com',
  message: 'Looking forward to working with you!'
});
```

---

## 15. Admin & Settings

### 15.1 Organization Settings
- Company profile
- Branding (colors, fonts, logos)
- Email templates
- Default proposal settings
- Billing & subscription
- User management
- Integrations
- API keys

### 15.2 User Preferences
- Notification settings
- Default template
- Signature
- Email signature
- Timezone
- Language preference

### 15.3 Security Settings
- Two-factor authentication
- SSO configuration
- IP whitelisting
- Session management
- Audit logs
- Data export

---

## Tech Stack Summary

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Component Library:** Shadcn UI
- **Rich Text Editor:** TipTap / Lexical
- **Drag & Drop:** React DnD
- **Charts:** Recharts
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime
- **Edge Functions:** Supabase Edge Functions
- **Vector DB:** Supabase pgvector

### AI & ML
- **LLMs:** OpenAI GPT-4, Claude 3.5 Sonnet
- **Voice:** ElevenLabs, Whisper AI
- **Embeddings:** OpenAI text-embedding-3
- **ML Models:** Python (TensorFlow, Scikit-learn)

### Infrastructure
- **Hosting:** Vercel
- **CDN:** Vercel Edge Network
- **Email:** Twilio SendGrid
- **SMS:** Twilio
- **Payments:** Stripe
- **File Storage:** Supabase Storage + Cloudflare R2

### Integrations
- **CRMs:** HubSpot API, Salesforce API, Pipedrive API
- **Automation:** Make.com, Zapier
- **Communication:** Slack API, Microsoft Teams
- **Meeting:** Gong API, Fireflies API
- **Analytics:** PostHog, Mixpanel

### DevOps
- **Version Control:** Git, GitHub
- **CI/CD:** GitHub Actions, Vercel
- **Monitoring:** Sentry, Vercel Analytics
- **Logging:** Better Stack
- **Testing:** Jest, Playwright

---

## Performance Requirements

- **Page Load Time:** <2s (P95)
- **API Response Time:** <500ms (P95)
- **AI Generation:** <30s for full proposal
- **Real-time Updates:** <100ms latency
- **Uptime:** 99.9% SLA
- **Concurrent Users:** Support 10,000+

---

## Security & Compliance

- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Compliance:** SOC 2 Type II, GDPR, HIPAA
- **Backups:** Daily automated backups
- **Disaster Recovery:** RPO <1 hour, RTO <4 hours
- **Penetration Testing:** Annual third-party audits
- **Bug Bounty:** HackerOne program

---

## Scalability Architecture

- **Database:** Supabase (scales to 100M+ rows)
- **Caching:** Redis for session + frequent queries
- **CDN:** Cloudflare for static assets
- **Queue:** BullMQ for background jobs
- **Load Balancing:** Vercel automatic
- **Horizontal Scaling:** Serverless functions auto-scale

---

This comprehensive functionality specification provides a complete blueprint for building ProposalAI. Each feature is designed to solve real sales proposal pain points while leveraging modern AI capabilities.
