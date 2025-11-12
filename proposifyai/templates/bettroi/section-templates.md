# Bettroi Proposal Section Templates

This document provides templates and guidance for each standard section in a Bettroi proposal.

---

## 1. Executive Summary

**Purpose:** High-level overview of the proposal with key success metrics

**Template:**
```
[Company Name] will deliver [brief description of solution] that [key benefit]. The [solution name] provides [main features/capabilities], while [any exclusions or boundaries]. Success is defined by [specific metrics and KPIs].

Success targets: [specific measurable goals]
```

**Example:**
```
Bettroi will deliver an ethical AI Relationship Coach that plugs into the CheriPic React Native app. The coach provides guidance, nudges, and experience recommendations, with text and voice, while avoiding matchmaking logic, which remains in the core app. Success is defined by low latency, strong session continuity, and zero P1 privacy incidents.

Success targets: p95 ≤1.8 s (text), ≤2.5 s (voice); ≥95% continuity; zero P1 privacy incidents.
```

---

## 2. Scope of Work

**Purpose:** Clear boundaries of what IS and IS NOT included

### **In-scope** (REQUIRED)

**Template:**
```markdown
In-scope
- [Feature/capability 1]: [brief description]
- [Feature/capability 2]: [brief description]
- [Feature/capability 3]: [brief description]
- [Technical component]: [what it includes]
- [Integration/API work]: [specific scope]
- [Data/security measures]: [what's covered]
```

**Example:**
```markdown
In-scope
- AI Coach: conversation guidance, empathy framing, conflict tips, icebreakers.
- AI Recommender: date ideas, venues, coupons, and experiences from app DB.
- Voice pipeline: streaming STT/TTS or voice-native SDK with barge-in.
- API handshake: secure read/write for AI context via approved endpoints.
- Data-model extensions: user_context, conversations, recommendations, consent.
- Privacy and audit logging with minimal PII.
```

### **Out-of-scope** (REQUIRED)

**Template:**
```markdown
Out-of-scope
- [Feature explicitly NOT included]
- [System/component client owns]
- [Third-party services not covered]
- [Future phase work]
- [Specific exclusions]
```

**Example:**
```markdown
Out-of-scope
- Matchmaking algorithms, payments, booking flows, CRM/email/calendar.
- Non-relationship topics, broad web agents, multi-tool orchestration.
- Infrastructure management and server provisioning.
- Mobile app UI/UX beyond AI chat interface.
```

**CRITICAL NOTES:**
- ✅ ALWAYS include both In-scope AND Out-of-scope
- ✅ Be specific about exclusions to prevent scope creep
- ✅ List major components the client owns
- ✅ Clarify boundaries clearly

---

## 3. Architecture and Integrations

**Purpose:** Technical architecture and system components

**Template:**
```markdown
Architecture and Integrations

**[Component 1]**
[Description, technologies, responsibilities]

**[Component 2]**
[Description, technologies, responsibilities]

**[Component 3]**
[Description, technologies, responsibilities]

**[Database/Storage]**
[Current and future database architecture]
```

---

## 4. Deliverables

**Purpose:** Concrete outputs to be delivered

**Template:**
```markdown
Deliverables
- [Specific feature/module name and description]
- [Technical component and what it includes]
- [Documentation/admin tools]
- [Security/compliance deliverables]
- [Testing/quality assurance outputs]
```

**Example:**
```markdown
Deliverables
- Female-led onboarding flow and interaction model.
- AI Coach (text + voice) with per-user memory and policy guardrails.
- Experience/offer suggestions from the app DB.
- Admin + user dashboards; secure API/DB handshake; consent capture + audit logs.
```

---

## 5. Technology Stack

**Purpose:** Technologies, frameworks, and tools

**Template:**
```markdown
Technology Stack
**Frontend:** [Framework, version, key libraries]
**Backend:** [Languages, frameworks, APIs]
**Database:** [Database system, any special features]
**AI/ML:** [AI services, models, APIs]
**Infrastructure:** [Hosting, deployment platform]
**Dev Tools:** [CI/CD, testing, monitoring]
```

**Example:**
```markdown
Technology Stack
React Native (client), Node.js API.
Supabase, Vercel for deployment, Cloud Agent SDK for voice.
OpenAI GPT-4, Anthropic Claude for AI processing.
```

---

## 6. Performance & Scale

**Purpose:** Performance targets and scalability considerations

**Template:**
```markdown
Performance & Scale
Optimized for ~[number] concurrent users at launch with a scale plan for growth.

**Performance Targets:**
- [Metric 1]: [target value]
- [Metric 2]: [target value]
- [Metric 3]: [target value]

**Scalability:**
- [How system scales]
- [Growth capacity]
```

---

## 7. Project Plan and Milestones

**Purpose:** Timeline, phases, and delivery schedule

**Template:**
```markdown
Project Plan and Milestones

Duration: [X weeks/months]. Detailed micro-milestones shared at order confirmation.

**M1: [Phase Name]** — [Brief description of deliverables]
**M2: [Phase Name]** — [Brief description of deliverables]
**M3: [Phase Name]** — [Brief description of deliverables]
**M4: [Phase Name]** — [Brief description of deliverables]
```

**Example:**
```markdown
Duration: 6–8 weeks. Detailed micro-milestones shared at order confirmation.

M1: Foundations — NDA, access, environments, API contracts, UX flows, safety policy.
M2: Core AI — text counselor + memory, consent + audit, chat summaries.
M3: Voice — streaming STT/TTS, barge-in, latency hardening.
M4: Recommender + Dashboards — experience ideas from DB, admin views, go-live runbook.
```

---

## 8. Commercials (Year-1)

**Purpose:** Investment breakdown and payment terms

**Template:**
```markdown
Commercials (Year-1)

**Total Investment:** $[amount] USD

**Payment Schedule:**
- [Percentage]% on order confirmation
- [Percentage]% on milestone [X]
- [Percentage]% on milestone [Y]
- [Percentage]% on final delivery

**Included:**
- [What's included in the price]
- [Support period]
- [Warranty/maintenance]

**Not Included:**
- [Third-party costs]
- [Infrastructure costs]
- [Other exclusions]
```

---

## 9. Client Responsibilities

**Purpose:** What the client must provide

**Template:**
```markdown
Client Responsibilities
- Sign NDA, provide [access/credentials] within [timeframe]
- Approve designs within [timeframe]
- Activate payment gateway
- Provision vendor accounts and API keys for [list services]
- [Other specific client obligations]
```

---

## 10. Important Points

**Purpose:** Critical clarifications and key information

**Template:**
```markdown
Important Points
- [Critical clarification about costs/billing]
- [Key ownership/responsibility boundaries]
- [Important technical or business constraints]
- [Risk factors or dependencies]
```

**Example:**
```markdown
Important Points
- All AI token costs are billed to CheriPic. CheriPic owns the API keys. Billing is usage-based and is charged directly by the AI vendor(s) to CheriPic.
- Bettroi builds and integrates only the AI Relationship Coach. It plugs into the CheriPic React Native app and reads/writes to the shared Supabase (profiles + experiences).
```

---

## 11. Division of Responsibilities

**Purpose:** Clear breakdown of who does what

**Template:**
```markdown
Division of Responsibilities

**[Client Name] team ([their role]):**
- [Responsibility 1]
- [Responsibility 2]
- [What they own and pay for]
- [Their deliverables to us]

**Bettroi ([our role]):**
- [Our deliverable 1]
- [Our deliverable 2]
- [What we build/integrate]
- [Our responsibilities]
```

---

## 12. Acceptance Criteria

**Purpose:** How success is measured

**Template:**
```markdown
Acceptance Criteria
- Functional coverage equals the in-scope list.
- [Performance criteria met]
- [Security/compliance requirements passed]
- [Quality metrics achieved]
- [Testing milestones completed]
```

---

## 13. Assumptions

**Purpose:** Project assumptions and dependencies

**Template:**
```markdown
Assumptions
- [Technical assumption about existing systems]
- [Timeline assumption]
- [Access/resource assumption]
- [Scope boundary assumption]
```

---

## 14. Change Control

**Purpose:** Process for handling scope changes

**Template:**
```markdown
Change Control
Features beyond "In-scope" require a written change request with revised effort and schedule.
```

---

## 15. Warranty, IP, and Terms

**Purpose:** Legal terms and warranties

**Template:**
```markdown
Warranty, IP, and Terms
- Quote valid [X] days.
- [X]-month complimentary bug support post-launch.
- [Percentage]% deduction on cancellation after initiation.
- Complete source code ownership transfers on final payment.
- Taxes as applicable per law.
```

**Default:**
```markdown
Warranty, IP, and Terms
- Quote valid 30 days.
- 3-month complimentary bug support post-launch.
- 30% deduction on cancellation after initiation.
- Complete source code ownership transfers on final payment.
- Taxes as applicable per law.
```

---

## 16. Service Order Confirmation – Letter of Intent (LOI)

**Purpose:** Formal acceptance and signature

**Template:**
```markdown
SERVICE ORDER CONFIRMATION – LETTER OF INTENT (LOI)

Ref: [ERP-REF], [Date]

From,
[Client Company Name]
[Client Address]

To,
BETTROI FZE
A5, Techno-Hub, DTEC
Dubai Silicon Oasis, Dubai, UAE

Subject: Letter of Intent – [Project Name]

Dear Mr. Thomas,

We are pleased to issue this Letter of Intent, in reference to Bettroi's Proposal (ERP Ref: [ERP-REF]), to proceed with [brief project description].

[Scope summary paragraph]

We acknowledge our intent to proceed and confirm that this LOI serves as formal authorization to initiate the engagement under the terms outlined in the referenced proposal. Bettroi may commence project planning, environment setup, and scheduling upon receipt of the advance payment and necessary system access.

We look forward to a successful collaboration.

Sincerely,

For [Client Company Name],
Name: __________________________
Title: __________________________
Signature: ______________________
Date: __________________________
```

---

## Usage Notes

### When to Include Sections

**Always Include:**
- Executive Summary
- Scope of Work (with In-scope AND Out-of-scope)
- Deliverables
- Technology Stack
- Project Plan and Milestones
- Commercials
- Client Responsibilities
- Acceptance Criteria
- Assumptions
- Change Control
- Warranty, IP, and Terms
- LOI

**Include When Applicable:**
- Architecture and Integrations (technical projects)
- Performance & Scale (performance-critical projects)
- Third-Party Subscriptions (when external services involved)
- Division of Responsibilities (when responsibilities are complex)
- Billing Mechanics (when third-party costs involved)
- Cost Controls (when usage-based billing involved)
- Data and Security Notes (when handling sensitive data)
- Integration Touchpoints (when integrating with existing systems)

### Best Practices

1. **Always define In-scope AND Out-of-scope** - This is non-negotiable
2. **Be specific** - Vague scope leads to disputes
3. **Use consistent structure** - Follow the order in standard-sections.json
4. **Include metrics** - Quantify success whenever possible
5. **Clarify responsibilities** - No ambiguity about who does what
6. **Document assumptions** - Protect both parties
7. **Define change process** - Prevent scope creep

---

## Version

Section Templates Version: 1.0.0
Last Updated: November 12, 2025
