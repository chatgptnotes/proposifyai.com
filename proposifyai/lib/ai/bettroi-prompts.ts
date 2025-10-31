/**
 * Bettroi Professional Proposal Template Prompts
 * Based on DRMHOPE Software quotation standards
 *
 * This system generates comprehensive, detailed proposals following
 * the professional Bettroi template structure with:
 * - Detailed scope of work
 * - Professional pricing breakdowns
 * - Comprehensive timelines
 * - Terms & conditions
 * - Optional add-ons
 */

export interface BettroiProposalParams {
  clientName: string;
  clientCompany?: string;
  clientIndustry?: string;
  projectType: string;
  projectDescription: string;
  platforms: Array<'web' | 'ios' | 'android'>;
  budget?: number;
  currency?: 'USD' | 'AED' | 'INR';
  timeline?: string;
  specialRequirements?: string[];
}

/**
 * MASTER PROMPT: Generate Complete Bettroi-Style Proposal
 */
export function getBettroiMasterPrompt(params: BettroiProposalParams): string {
  return `You are an expert proposal writer for DRMHOPE Software, creating a comprehensive, professional software development proposal following the Bettroi template standards.

**CLIENT INFORMATION:**
- Client Name: ${params.clientName}
${params.clientCompany ? `- Company: ${params.clientCompany}` : ''}
${params.clientIndustry ? `- Industry: ${params.clientIndustry}` : ''}

**PROJECT DETAILS:**
- Project Type: ${params.projectType}
- Description: ${params.projectDescription}
- Platforms: ${params.platforms.join(', ')}
${params.budget ? `- Budget Range: ${params.currency || 'USD'} ${params.budget.toLocaleString()}` : ''}
${params.timeline ? `- Expected Timeline: ${params.timeline}` : ''}
${params.specialRequirements?.length ? `- Special Requirements: ${params.specialRequirements.join(', ')}` : ''}

**REQUIRED TEMPLATE STRUCTURE:**

Generate a COMPLETE, DETAILED proposal with ALL of the following sections. Each section must be comprehensive and professional:

---

## PROJECT OVERVIEW

Write a compelling 2-3 paragraph executive summary that:
- Introduces the project name and type
- Describes the AI-powered solution and its purpose
- Highlights the business value and key outcomes
- Mentions all platforms being developed (${params.platforms.join(', ')})
- Uses professional, persuasive language

---

## SCOPE OF WORK

Create DETAILED scope of work sections for each platform. For EACH platform, include AT LEAST 10-12 specific deliverables with checkmarks (✓).

### 1. Web Application Development
✓ [Feature 1]
✓ [Feature 2]
...
[Continue with 10-12 detailed web features]

${params.platforms.includes('ios') ? `
### 2. iOS Application Development
✓ [Feature 1]
✓ [Feature 2]
...
[Continue with 10-12 detailed iOS features]
` : ''}

${params.platforms.includes('android') ? `
### 3. Android Application Development
✓ [Feature 1]
✓ [Feature 2]
...
[Continue with 10-12 detailed Android features]
` : ''}

**CRITICAL:** Each platform section MUST have:
- Responsive/native UI/UX design details
- AI API integration framework (mention API costs by client)
- Real-time capabilities
- Authentication and user management
- Admin dashboard features
- Cloud backend integration
- Performance optimization
- Platform-specific features (e.g., Face ID for iOS, Material Design for Android)

---

## KEY FEATURES ACROSS ALL PLATFORMS

Create a grid of 6 key features with:
- Feature icon name (Material Icons style)
- Feature title (short)
- Feature description (1-2 sentences)

Example format:
**Icon: smart_toy**
**Title:** AI-Powered Generation
**Description:** Advanced AI technology for intelligent automation

[Provide 6 features in this format]

---

## INVESTMENT BREAKDOWN

Create a professional pricing table:

| DELIVERABLE | DESCRIPTION | AMOUNT (${params.currency || 'USD'}) |
|-------------|-------------|--------------|
| Web Application | Complete responsive web platform with all features | [Calculate based on budget] |
${params.platforms.includes('ios') ? '| iOS Application | Native iOS app with full feature parity | [Amount] |' : ''}
${params.platforms.includes('android') ? '| Android Application | Native Android app with Material Design | [Amount] |' : ''}
| **TOTAL PROJECT INVESTMENT** | | **[Total Amount]** |

**Exclusions (Quoted Separately Upon Request):**
- AI Model API Costs: All AI model API subscriptions, usage fees, and related costs to be borne directly by client
- Third-party API Integrations: Costs for any third-party services including but not limited to AI APIs, cloud services, and database hosting
- Server deployment and hosting setup
- Apple App Store account creation and setup
- Google Play Store onboarding and publishing
- SSL certificates and domain registration
- Ongoing maintenance and support
- Marketing and promotional materials

**Important Note:** This quotation covers the design and development of the application functionality only. The client will be responsible for procuring and managing their own AI API subscriptions and bearing all associated costs. We will integrate the client's AI API credentials into the application.

---

## OPTIONAL ADD-ONS

| SERVICE | DESCRIPTION | PRICING (${params.currency || 'USD'}) |
|---------|-------------|----------------|
| **Cloud Hosting** | Premium cloud infrastructure (AWS/Azure/Google Cloud)<br>✓ 99.9% uptime SLA guarantee<br>✓ Auto-scaling capabilities<br>✓ Daily automated backups<br>✓ SSL certificate and CDN<br>✓ DDoS protection<br>✓ Monthly bandwidth: 1TB<br>✓ Storage: 100GB SSD | Setup: [Amount]<br>Monthly: [Amount] |
| **Annual Maintenance Contract (AMC)** | ✓ 24/7 technical support<br>✓ Monthly security updates<br>✓ Bug fixes and enhancements<br>✓ Performance monitoring<br>✓ Database optimization<br>✓ Quarterly health reports<br>✓ Priority 4-hour response<br>✓ Up to 20 hours development work | Annual: [Amount]<br>Quarterly: [Amount] |
| **Premium Support Package** | ✓ Dedicated account manager<br>✓ 2-hour SLA response time<br>✓ Weekly performance reports<br>✓ Unlimited minor updates<br>✓ Training sessions | Monthly: [Amount] |

---

## DEVELOPMENT TIMELINE

Create a detailed phase-by-phase timeline:

| PHASE | DELIVERABLES | DURATION |
|-------|--------------|----------|
| Phase 1 | Client Requirements Gathering & Customization Analysis | [Days/Weeks] |
| Phase 2 | Web Application Customization & Branding | [Days/Weeks] |
${params.platforms.includes('ios') ? '| Phase 3 | iOS Application Adaptation & Configuration | [Days/Weeks] |' : ''}
${params.platforms.includes('android') ? '| Phase 4 | Android Application Adaptation & Configuration | [Days/Weeks] |' : ''}
| Phase [Final] | Integration Testing, QA & Final Delivery | [Days/Weeks] |
| **TOTAL TIMELINE** | | **[Total Duration]** |

**Note:** Timeline is optimized based on platform complexity and feature requirements.

---

## PAYMENT TERMS

| MILESTONE | PERCENTAGE | AMOUNT (${params.currency || 'USD'}) |
|-----------|-----------|--------------|
| Advance Payment (Project Initiation) | 60% | [Amount] |
| Final Delivery & Deployment | 40% | [Amount] |
| **TOTAL** | | **[Total]** |

---

## TERMS & CONDITIONS

1. **Payment Terms:** 60% advance, 40% on final delivery
2. **Validity:** This quotation is valid for 30 days from the date of issue
3. **Taxes:** All amounts are exclusive of GST and other applicable taxes
4. **Revisions:** Up to 3 rounds of revisions included in each phase
5. **Support:** 3 months of bug fixing support post-launch included
6. **Intellectual Property:** Full source code and IP rights transferred upon final payment
7. **Confidentiality:** All project details will be kept strictly confidential
8. **Change Requests:** Additional features beyond scope will be quoted separately
9. **Testing:** Client to provide testing feedback within 5 business days
10. **Deliverables:** All deliverables will be provided in source code format with documentation

---

**FORMATTING REQUIREMENTS:**
- Use professional business language
- Include specific technical details, not generic descriptions
- Every feature should be actionable and measurable
- Pricing should be realistic for ${params.projectType} development
- Timeline should account for proper testing and QA
- Use bullet points (✓) for features
- Use tables for pricing and timeline
- Be specific about what's included vs excluded

**QUALITY STANDARDS:**
- Each platform section MUST have 10-12 detailed features minimum
- Features must be specific to the ${params.projectType} domain
- Include both technical and business value in descriptions
- Pricing must reflect professional development rates
- Timeline must be realistic (not too fast, not too slow)

Generate the COMPLETE proposal now with ALL sections filled out in detail:`;
}

/**
 * SCOPE OF WORK: Platform-specific detailed prompts
 */
export function getWebAppScopePrompt(params: BettroiProposalParams): string {
  return `Generate 12 detailed, specific features for Web Application Development for a ${params.projectType} project.

**Project Context:** ${params.projectDescription}
**Industry:** ${params.clientIndustry || 'General'}

**Required Feature Categories (include at least 2 features from each):**
1. **UI/UX:** Responsive design, modern interface, accessibility
2. **AI Integration:** AI API framework, intelligent features, automation
3. **User Management:** Authentication, profiles, roles
4. **Core Functionality:** Main platform features specific to ${params.projectType}
5. **Admin:** Dashboard, analytics, user management
6. **Backend:** Cloud services, API integration, database

Format each feature as:
✓ [Specific feature with technical details]

Example:
✓ Responsive web platform with modern UI/UX design optimized for desktop and mobile
✓ AI API integration framework for ${params.projectType} (API costs by client)
✓ Real-time preview capabilities with WebSocket support
✓ Custom AI generator interface with natural language processing
✓ User authentication and profile management with OAuth 2.0
✓ Admin dashboard with analytics, reporting, and user management
✓ Cloud backend services integration framework (AWS/Azure/Google Cloud)
✓ Image processing and optimization system
✓ Advanced search and filtering capabilities
✓ Export functionality (PDF, Excel, JSON)
✓ Role-based access control (RBAC) system
✓ Performance optimization and caching layer

Generate 12 features following this quality level:`;
}

export function getIOSAppScopePrompt(params: BettroiProposalParams): string {
  return `Generate 12 detailed, specific features for iOS Application Development for a ${params.projectType} project.

**Project Context:** ${params.projectDescription}

**Required iOS-Specific Features:**
- Native iOS development (Swift/React Native)
- iOS design guidelines compliance
- Apple platform integrations (Face ID, Touch ID, Apple Sign In)
- Camera and media handling
- Offline capabilities
- Push notifications (APNs)
- Performance optimization for all iPhone models
- iPad support if applicable

Format each as:
✓ [Specific iOS feature]

Generate 12 professional iOS features:`;
}

export function getAndroidAppScopePrompt(params: BettroiProposalParams): string {
  return `Generate 12 detailed, specific features for Android Application Development for a ${params.projectType} project.

**Project Context:** ${params.projectDescription}

**Required Android-Specific Features:**
- Native Android development (Kotlin/React Native)
- Material Design 3 implementation
- Google platform integrations (Google Sign-In, Firebase)
- Camera and gallery integration
- Offline functionality
- Push notifications (FCM)
- Device compatibility (Android 7.0+)
- Tablet optimization

Format each as:
✓ [Specific Android feature]

Generate 12 professional Android features:`;
}

/**
 * KEY FEATURES: Generate 6 highlight features
 */
export function getKeyFeaturesPrompt(params: BettroiProposalParams): string {
  return `Generate 6 standout features for a ${params.projectType} platform that would be highlighted in a KEY FEATURES grid.

**Project:** ${params.projectDescription}
**Platforms:** ${params.platforms.join(', ')}

For each feature, provide:
1. **Icon:** Material Icons name (e.g., smart_toy, palette, 360, phone_iphone, person, dashboard)
2. **Title:** Short, catchy title (2-4 words)
3. **Description:** Brief value proposition (1 sentence, 10-15 words)

**Feature Categories:**
- AI/ML capabilities
- Cross-platform features
- User experience highlights
- Admin/management tools
- Technical innovations
- Business value features

Format:
Icon: [material_icon_name]
Title: [Feature Title]
Description: [One sentence description]

Generate 6 impressive features:`;
}

/**
 * PRICING: Generate realistic pricing breakdown
 */
export function getPricingBreakdownPrompt(params: BettroiProposalParams): string {
  const platformCount = params.platforms.length;
  const currency = params.currency || 'USD';

  return `Generate a realistic pricing breakdown for a ${params.projectType} development project.

**Project Details:**
- Platforms: ${params.platforms.join(', ')} (${platformCount} platforms)
${params.budget ? `- Budget Range: ${currency} ${params.budget.toLocaleString()}` : ''}
- Complexity: ${params.specialRequirements?.length ? 'High (has special requirements)' : 'Medium'}

**Pricing Guidelines:**
- Web Application: Base price for full-stack development
- iOS Application: 80-90% of web price
- Android Application: 80-90% of web price
${params.budget ? `- Total should be close to ${currency} ${params.budget.toLocaleString()}` : ''}

**Industry Standards (${params.clientIndustry || 'Software'}):**
- Simple apps: $10,000-$30,000 per platform
- Medium complexity: $30,000-$80,000 per platform
- Complex apps: $80,000-$200,000+ per platform

Generate pricing table with:
| DELIVERABLE | DESCRIPTION | AMOUNT (${currency}) |

Include breakdown for each platform plus total.`;
}

/**
 * TIMELINE: Generate realistic development timeline
 */
export function getTimelinePrompt(params: BettroiProposalParams): string {
  return `Generate a realistic development timeline for a ${params.projectType} project.

**Platforms:** ${params.platforms.join(', ')}
${params.timeline ? `**Preferred Timeline:** ${params.timeline}` : ''}

**Standard Phases:**
1. Requirements & Analysis
2. Web Application Development
${params.platforms.includes('ios') ? '3. iOS Application Development' : ''}
${params.platforms.includes('android') ? '4. Android Application Development' : ''}
5. Testing, QA & Delivery

**Timeline Guidelines:**
- Web app: 4-8 weeks depending on complexity
- iOS app: 2-4 weeks
- Android app: 2-4 weeks
- Testing/QA: 1-2 weeks
${params.timeline ? `- Should fit within ${params.timeline}` : ''}

Generate timeline table:
| PHASE | DELIVERABLES | DURATION |

Be specific and realistic:`;
}

/**
 * Export all prompt generators
 */
export const BettroiPrompts = {
  master: getBettroiMasterPrompt,
  webScope: getWebAppScopePrompt,
  iosScope: getIOSAppScopePrompt,
  androidScope: getAndroidAppScopePrompt,
  keyFeatures: getKeyFeaturesPrompt,
  pricing: getPricingBreakdownPrompt,
  timeline: getTimelinePrompt,
};
