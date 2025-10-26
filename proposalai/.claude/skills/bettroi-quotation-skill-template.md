# Bettroi Quotation Skill Template

## Purpose
Standardized quotation format and structure for all Bettroi PZE projects under Rafbtar Help Emergency Services and DRMHOPE Software. This skill ensures consistent, professional proposal generation following the established Bettroi Professional Template standards.

---

## Template Variants

### Available Templates:
1. **Bettroi Professional (Headz)** - Hairstyling platform (AED, 2 weeks, 40-30-30 payment)
2. **Bettroi Fashion** - Fashion try-on platform (INR, 6 weeks, 60-40 payment) ⭐ NEW

Both templates share the same professional structure but vary in:
- Industry focus (Hairstyling vs Fashion)
- Currency (AED vs INR)
- Timeline (2 weeks vs 6 weeks)
- Payment terms (40-30-30 vs 60-40)
- Bank account details

---

## Core Principles

### 1. Professional Branding
- **Company**: DRMHOPE SOFTWARE
- **Tagline**: "Accelerating Digital Innovation"
- **Primary Color**: #DC2626 (Red)
- **Secondary Color**: #B91C1C (Dark Red)
- **Accent Color**: #991B1B (Darker Red)
- **Typography**: Segoe UI, Arial, sans-serif
- **Line Height**: 1.6 for readability

### 2. Quotation Number Format
```
DRM-YYYY-Q-XXXX

Components:
- DRM: DRMHOPE Software prefix
- YYYY: Current year
- Q: Quotation identifier
- XXXX: Sequential number (auto-increment)

Examples:
- DRM-2025-Q-1023 (Headz/Hairstyling)
- DRM-2025-Q-1025 (Fashion Try-On)
```

### 3. Payment Structure (Template-Specific)

**Headz/Hairstyling Template (Standard):**
```
40% - Advance payment (upon project initiation)
30% - Milestone completion payment
30% - Final delivery payment (with IP rights transfer)
```

**Fashion Try-On Template (Alternative):**
```
60% - Advance payment (upon project initiation)
40% - Final delivery & deployment
```

**When to Use Each:**
- Use 40-30-30 for shorter projects (2-4 weeks)
- Use 60-40 for longer projects (6+ weeks) with higher upfront investment

---

## 12-Section Proposal Structure

### Section 1: Header/Letterhead
**Required Elements:**
- Company logo (DRMHOPE Software)
- Company name and tagline
- Quotation number (DRM-YYYY-Q-XXXX format)
- Date (long format: October 23, 2025)
- Valid Until (30 days from date)

**Design:**
- Gradient red background (#DC2626 to #B91C1C)
- White text
- Professional letterhead layout
- Decorative background elements

**Code Structure:**
```html
<header class="letterhead">
  <div class="header-content">
    <div class="logo-section">
      <img src="drmhope-logo.svg" alt="DRMHOPE Logo">
      <div class="company-info">
        <h1>DRMHOPE SOFTWARE</h1>
        <p class="tagline">Accelerating Digital Innovation</p>
      </div>
    </div>
    <div class="quotation-meta">
      <div class="meta-item">
        <span class="label">Quotation No:</span>
        <span class="value">DRM-2025-Q-XXXX</span>
      </div>
      <!-- Date and validity -->
    </div>
  </div>
</header>
```

---

### Section 2: Client Details
**Required Fields:**
- Client logo (transparent background, SVG preferred)
- Client company name (uppercase, bold)
- Client description/industry
- Location (City, Country)
- Contact email

**Layout:**
- Flex layout with logo on left
- Client information on right
- Light gray background (#FAFAFA)
- Red border bottom (3px solid #DC2626)

---

### Section 3: Executive Summary/Project Overview
**Components:**
- Section title: "PROJECT OVERVIEW"
- Project title (bold, 18px)
- Comprehensive project description (2-3 sentences minimum)
- Text justified alignment
- Professional tone

**Content Guidelines:**
- Describe the solution being proposed
- Mention key technologies (AI, web, mobile, etc.)
- Highlight main benefits to client
- Keep concise but comprehensive

---

### Section 4: Scope of Work
**Structure:**
- Multiple platform sections (Web, iOS, Android, etc.)
- Each platform in a separate card with:
  - Platform name as heading (h3)
  - Feature list with checkmarks
  - Left border in primary red color

**Feature List Format:**
```
✓ Feature description
✓ Feature description
```

**Standard Platforms:**
1. **Web Application Development**
   - Responsive design
   - AI API integration framework
   - User authentication
   - Admin dashboard
   - Cloud backend integration

2. **iOS Application Development**
   - Native Swift/React Native
   - Camera integration
   - Offline mode
   - Biometric authentication
   - Push notifications

3. **Android Application Development**
   - Kotlin/React Native
   - Material Design 3
   - Google Sign-In
   - FCM notifications
   - Performance monitoring

---

### Section 5: Key Features Grid
**Layout:**
- 3x2 grid (6 features total)
- Material Icons for each feature
- Card-based design with hover effects
- Center-aligned content

**Standard Material Icons:**
- `palette` - Design/Styling features
- `smart_toy` - AI/ML capabilities
- `360` - 360-degree/3D views
- `phone_iphone` - Cross-platform/Mobile
- `person` - User management
- `dashboard` - Admin features

**Card Structure:**
```html
<div class="feature-item">
  <span class="feature-icon material-icons">palette</span>
  <h4>Feature Title</h4>
  <p>Brief description</p>
</div>
```

---

### Section 6: Investment Breakdown (Pricing)
**Table Structure:**
- 3 columns: DELIVERABLE | DESCRIPTION | AMOUNT (AED)
- Red header background (#DC2626)
- Alternating row hover effect
- Bold total row at bottom

**Standard Deliverables:**
1. Web Application - Detailed description - AED X,XXX
2. iOS Application - Detailed description - AED X,XXX
3. Android Application - Detailed description - AED X,XXX
4. TOTAL PROJECT INVESTMENT - AED XX,XXX

**Pricing Guidelines:**
- Always specify currency (AED, USD, INR)
- Use comma separators for thousands
- Round numbers (no decimals)
- Bold and larger font for total

---

### Section 7: Exclusions
**CRITICAL - Always Include:**

**Standard Exclusions List:**
1. **AI Model API Costs** - All AI model API subscriptions, usage fees, and related costs to be borne directly by client
2. **Third-party API Integrations** - Costs for any third-party services including but not limited to AI APIs, cloud services, and database hosting
3. Server deployment and hosting setup
4. Apple App Store account creation and setup
5. Google Play Store onboarding and publishing
6. SSL certificates and domain registration
7. Ongoing maintenance and support (unless AMC purchased)
8. Marketing and promotional materials

**Important Note Box:**
```
This quotation covers the design and development of the application
functionality only. The client will be responsible for procuring and
managing their own AI API subscriptions and bearing all associated costs.
We will integrate the client's AI API credentials into the application.
```

**Styling:**
- Light red background (#FEF2F2)
- Red border (#FCA5A5)
- Use × symbol for exclusion items
- Dark red text (#7F1D1D)

---

### Section 8: Optional Add-ons
**Three Standard Add-ons:**

#### 1. Cloud Hosting
**Pricing:**
- Setup: AED 2,000 (one-time)
- Monthly: AED 500 (recurring)

**Features to Include:**
- Premium cloud infrastructure (AWS/Azure/Google Cloud)
- 99.9% uptime SLA guarantee
- Auto-scaling capabilities for traffic spikes
- Daily automated backups with 30-day retention
- SSL certificate and CDN integration
- DDoS protection and firewall
- Monthly bandwidth: 1TB included
- Storage: 100GB SSD included

#### 2. Annual Maintenance Contract (AMC)
**Pricing:**
- Annual: AED 6,000
- Quarterly: AED 1,800

**Features to Include:**
- 24/7 technical support via email and phone
- Monthly security updates and patches
- Bug fixes and minor enhancements
- Performance monitoring and optimization
- Database maintenance and optimization
- Quarterly health check reports
- Priority support with 4-hour response time
- Up to 20 hours of development work for minor changes

#### 3. Premium Support Package
**Pricing:**
- Monthly: AED 1,500

**Features to Include:**
- Dedicated account manager
- 2-hour SLA response time
- Weekly performance reports
- Unlimited minor updates
- Training sessions for your team

**Styling:**
- Green checkmarks (✓) for features
- Green border and background (#F0FDF4)
- Professional table format

---

### Section 9: Development Timeline
**Standard 5-Phase Structure:**

| PHASE | DELIVERABLES | DURATION |
|-------|--------------|----------|
| Phase 1 | Client Requirements Gathering & Customization Analysis | 2 Days |
| Phase 2 | Web Application Customization & Branding | 3 Days |
| Phase 3 | iOS Application Adaptation & Configuration | 3 Days |
| Phase 4 | Android Application Adaptation & Configuration | 3 Days |
| Phase 5 | Integration Testing, QA & Final Delivery | 3 Days |
| **TOTAL** | | **2 Weeks** |

**Timeline Adjustment Guidelines:**
- Quick Customization: 2 weeks (existing platform adaptation)
- Full Custom Development: 8-12 weeks
- Complex Enterprise: 12-16 weeks

**Timeline Note:**
```
Fast-Track Delivery: As the core platform is already developed and
tested, this timeline focuses on customization, branding, and
adaptation to meet [Client Name]'s specific requirements.
```

---

### Section 10: Terms & Conditions
**Standard 8 Terms (Always Include):**

1. **Payment Terms:** 40% advance, 30% on milestone completion, 30% on final delivery
2. **Validity:** This quotation is valid for 30 days from the date of issue
3. **Revisions:** Up to 3 rounds of revisions included in each phase
4. **Support:** 3 months of bug fixing support post-launch included
5. **Intellectual Property:** Full source code and IP rights transferred upon final payment
6. **Confidentiality:** All project details will be kept strictly confidential
7. **Change Requests:** Additional features beyond scope will be quoted separately
8. **Testing:** Client to provide testing feedback within 5 business days

**Format:**
- Numbered list
- Bold headings for each term
- Clear, concise language
- Professional legal tone

---

### Section 11: Acceptance/Signatures
**Two-Column Layout:**

**Left Column - For DRMHOPE Software:**
- Company name
- Signature line (2px solid border)
- "Authorized Signatory"
- Date field

**Right Column - For [Client Name]:**
- Client company name
- Signature line (2px solid border)
- "Authorized Signatory"
- Date field

**Styling:**
- 50px gap between columns
- Red headings
- Professional signature blocks

---

### Section 12: Footer
**Three-Column Layout:**

**Column 1 - Company Address:**
```
DRMHOPE SOFTWARE
2 Teka Naka
Kampti Road, Nagpur
Maharashtra, India
```

**Column 2 - Contact Details:**
```
Mobile: +91 937-3111-709
Email: murali@drmhope.com
Web: www.drmhope.com
```

**Column 3 - Legal:**
```
This document contains confidential information
```

**Footer Bar:**
```
Accelerating Your Digital Transformation Journey
```

**Styling:**
- Dark gray background (#1F2937)
- White text with red accents
- Centered footer bar
- Italic tagline

---

## CSS Standards

### Color Palette
```css
/* Primary Colors */
--primary-red: #DC2626;
--dark-red: #B91C1C;
--darker-red: #991B1B;

/* Text Colors */
--text-primary: #333333;
--text-secondary: #555555;
--text-light: #666666;

/* Background Colors */
--bg-white: #FFFFFF;
--bg-light: #F5F5F5;
--bg-gray: #FAFAFA;

/* Accent Colors */
--green-check: #22C55E;
--green-bg: #F0FDF4;
--red-exclusion: #FEF2F2;
```

### Typography
```css
/* Font Family */
font-family: 'Segoe UI', 'Arial', sans-serif;

/* Heading Sizes */
h1: 28px, font-weight: 700
h2: 20px, font-weight: 700
h3: 18px, font-weight: 600
h4: 16px, font-weight: 600

/* Body Text */
body: 16px, line-height: 1.6
```

### Layout Standards
```css
/* Container */
max-width: 210mm; /* A4 width */
margin: 0 auto;
background: white;

/* Section Padding */
padding: 40px;

/* Card Borders */
border-left: 4px solid var(--primary-red);
border-radius: 0 8px 8px 0;

/* Hover Effects */
transition: transform 0.3s;
hover: translateY(-5px);
```

---

## TypeScript Type Structure

### Use These Types for All Proposals:
```typescript
import { ProposalData } from '@/types/proposal-template';

interface ProposalData {
  header: HeaderData;
  clientDetails: ClientDetailsData;
  executiveSummary: ExecutiveSummaryData;
  scopeOfWork: ScopeOfWorkData;
  keyFeatures: KeyFeatureItem[];
  pricing: PricingData;
  exclusions: ExclusionsData;
  optionalAddons: AddonItem[];
  timeline: TimelinePhase[];
  terms: string[];
  footer: FooterData;
}
```

---

## Code Generation Guidelines

### When Creating Proposal Components:

1. **Always Use TypeScript**
   - Import types from `@/types/proposal-template`
   - Use strict typing for all props
   - Define interfaces for component props

2. **React Component Structure**
   ```tsx
   "use client";

   import { ProposalData } from '@/types/proposal-template';
   import { MaterialIcon } from '@mui/icons-material';

   interface ProposalSectionProps {
     data: ProposalData;
   }

   export default function ProposalSection({ data }: ProposalSectionProps) {
     return (
       <section className="section-class">
         {/* Content */}
       </section>
     );
   }
   ```

3. **CSS Modules or Tailwind**
   - Use Tailwind for utility classes
   - Maintain red color scheme
   - Ensure responsive design

4. **Material Icons Integration**
   ```tsx
   import PaletteIcon from '@mui/icons-material/Palette';

   <PaletteIcon className="text-primary-600" sx={{ fontSize: 48 }} />
   ```

---

## Content Guidelines

### Tone & Voice
- **Professional** - Formal business language
- **Confident** - Assert expertise and capabilities
- **Clear** - Avoid jargon, be specific
- **Action-Oriented** - Focus on deliverables and outcomes

### Writing Standards
- Use active voice
- Keep sentences concise (15-20 words max)
- Bullet points for features (not paragraphs)
- Numbers for sequential items
- Bold for emphasis (sparingly)

### Project Descriptions
**Good Example:**
> "Development of a comprehensive AI-powered virtual hairstyling platform featuring web and mobile applications. The solution leverages advanced AI technology to provide real-time hairstyle transformations, enabling users to visualize different hairstyles before making real-world changes."

**Bad Example:**
> "We will make an app with AI that does hair stuff."

---

## Quality Checklist

### Before Finalizing Any Quotation:

**Content:**
- [ ] Quotation number follows DRM-YYYY-Q-XXXX format
- [ ] Client details accurate and complete
- [ ] All 12 sections present
- [ ] Pricing totals calculated correctly
- [ ] Currency specified (AED, USD, INR)
- [ ] Timeline realistic and detailed
- [ ] AI API costs clearly in exclusions

**Design:**
- [ ] Red branding consistent (#DC2626)
- [ ] Material Icons used appropriately
- [ ] Typography follows standards
- [ ] Responsive design tested
- [ ] Print-ready (A4 format)
- [ ] All logos high quality (SVG)

**Legal:**
- [ ] 40-30-30 payment terms stated
- [ ] 30-day validity included
- [ ] IP rights clause present
- [ ] Confidentiality mentioned
- [ ] 3 rounds revision policy stated
- [ ] 3 months support specified

**Technical:**
- [ ] TypeScript types used
- [ ] No ESLint errors
- [ ] Accessibility standards met
- [ ] Performance optimized
- [ ] Cross-browser compatible

---

## Usage Instructions

### For Each New Proposal:

1. **Copy Template Data**
   ```typescript
   const newProposal: ProposalData = {
     ...bettroiProposalSample,
     // Customize fields
   };
   ```

2. **Update Client Information**
   - Upload client logo
   - Update company name and details
   - Verify contact information

3. **Customize Project Details**
   - Write project-specific description
   - List actual platforms needed
   - Add/remove features as needed

4. **Calculate Pricing**
   - Price each deliverable
   - Calculate total
   - Specify currency

5. **Adjust Timeline**
   - Estimate realistic durations
   - Account for complexity
   - Include buffer for revisions

6. **Review Exclusions**
   - Ensure AI costs mentioned
   - Add project-specific exclusions
   - Keep standard items

7. **Finalize & Export**
   - Review all sections
   - Run quality checklist
   - Export to PDF (A4)

---

## File Naming Convention

### Quotations:
```
DRM-YYYY-Q-XXXX_ClientName_ProjectName.pdf

Example:
DRM-2025-Q-1023_Bettroi_HeadzPlatform.pdf
```

### Versions:
```
DRM-YYYY-Q-XXXX_ClientName_v1.pdf
DRM-2025-Q-XXXX_ClientName_v2.pdf (after revisions)
```

---

## Best Practices

### Do's:
✓ Always include AI API cost clarification
✓ Offer all three optional add-ons
✓ Keep 30-day validity period
✓ Use 40-30-30 payment terms
✓ Include 3 months post-launch support
✓ Transfer IP rights on final payment
✓ Use Material Icons consistently
✓ Maintain professional tone
✓ Specify currency clearly
✓ Provide realistic timelines

### Don'ts:
✗ Skip any of the 12 required sections
✗ Use emojis in professional proposals
✗ Forget to update quotation number
✗ Leave pricing ambiguous
✗ Omit AI costs from exclusions
✗ Promise unrealistic timelines
✗ Use informal language
✗ Skip quality checklist
✗ Forget client logo
✗ Leave placeholder text

---

## Integration with ProposalAI

### Template Location:
```
/public/templates/bettroi-professional/
```

### Access in Application:
```typescript
import { bettroiProposalSample } from '@/types/proposal-template';

// Use as starting point for new proposals
const templateData = bettroiProposalSample;
```

### Documentation:
- **TEMPLATE_GUIDE.md** - Complete usage guide
- **Template README** - Template-specific docs
- **DEPLOYMENT_SUMMARY.md** - Deployment info

---

## Maintenance & Updates

### Version Control:
- Template Version: 1.0
- Created: October 25, 2025
- Last Updated: October 26, 2025
- Next Review: After first client feedback

### Update Process:
1. Review client feedback
2. Update template files
3. Update TypeScript types
4. Update documentation
5. Increment version number
6. Deploy to production
7. Notify team

---

## Success Metrics

### Quality Indicators:
- Client approval rate > 90%
- Revision rounds ≤ 2 on average
- Zero missing sections
- Zero calculation errors
- Professional presentation score > 9/10

### Performance Metrics:
- Proposal creation time < 2 hours
- Review time < 30 minutes
- Export time < 5 minutes
- Client response time < 48 hours

---

## Support & Resources

### Internal:
- Email: murali@drmhope.com
- Documentation: /TEMPLATE_GUIDE.md
- Types: /types/proposal-template.ts

### External:
- Material Icons: https://mui.com/material-ui/material-icons/
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs

---

**This skill ensures every quotation maintains DRMHOPE Software's professional standards while adapting to each client's unique requirements. Use it for all Bettroi PZE projects and Rafbtar Help Emergency Services proposals.**

---

## Fashion Try-On Template Variant Specifications

### Template ID: `bettroi-fashion`
**Location**: `/public/templates/bettroi-fashion/`
**PDF Reference**: `Quotation - Fashion Try On Platform Development _ Bettroi.pdf`

### Key Differences from Headz Template:

#### 1. Project Focus
- **Industry**: Fashion & E-commerce
- **Title**: "Fashion Try On - AI-Powered Virtual Fashion Platform"
- **Description**: Virtual fashion try-on for top-line fashion items, clothing, and accessories

#### 2. Pricing & Currency
- **Currency**: INR (Indian Rupees) with ₹ symbol
- **Total**: ₹7,00,000
- **Breakdown**:
  - Web Application: ₹2,50,000
  - iOS Application: ₹2,25,000
  - Android Application: ₹2,25,000
- **GST**: "GST/Taxes extra as applicable" (explicitly mentioned)

#### 3. Payment Terms
```
Milestone 1: 60% Advance - ₹4,20,000
Milestone 2: 40% Final Delivery - ₹2,80,000
```

#### 4. Timeline
**Total**: 6 Weeks (vs 2 weeks)
```
Phase 1: Requirements Gathering - 1 Week
Phase 2: Web Customization - 2 Weeks
Phase 3: iOS Configuration - 1 Week
Phase 4: Android Configuration - 1 Week
Phase 5: Testing & Delivery - 1 Week
```

#### 5. Bank Details
```
Account Name: RAFTAAR HELP EMERGENCY SEVA
Bank: State Bank of India
Branch: Ajni / 64460
Account Number: 43835697434
```

#### 6. Additional Exclusions
- **Fashion catalog content and photography** (unique to fashion)

#### 7. Unique Features (Fashion-Specific)

**Web Application Additions:**
- Fashion catalog management and categorization
- Size and fit recommendation engine
- Wardrobe gallery and try-on history
- Admin dashboard for inventory management

**iOS Application Additions:**
- AR-ready architecture for enhanced try-on experience
- Wardrobe and favorites management
- Shopping cart integration ready

**Android Application Additions:**
- AR Core ready for future enhancements

#### 8. Material Icon for Fashion
**Icon Change:**
- `checkroom` - Fashion Collections (replaces `palette` for hairstyles)
- Icon represents clothing/fashion items

#### 9. Terms & Conditions
**10 Terms** (vs 8 in Headz):
1. Payment Terms: 60% advance, 40% on final delivery
2. Validity: 30 days
3. Taxes: Exclusive of GST
4. Revisions: 3 rounds per phase
5. Support: 3 months post-launch
6. IP Rights: Transferred on final payment
7. Confidentiality: Strictly confidential
8. Change Requests: Quoted separately
9. Testing: 5 business days feedback
10. Currency: Indian Rupees (INR)

#### 10. Quotation Number
**Example**: DRM-2025-Q-1025

---

### When to Use Each Template

#### Use Headz Template When:
- Project is hairstyling/beauty focused
- Client is in Dubai/UAE market
- Currency is AED
- Quick customization needed (2 weeks)
- 40-30-30 payment preferred
- Lower total project cost

#### Use Fashion Template When:
- Project is fashion/e-commerce focused
- Client is in Indian market
- Currency is INR
- More development time available (6 weeks)
- 60-40 payment structure preferred
- Higher upfront investment acceptable
- Fashion catalog and inventory management needed

---

### Template Conversion Guidelines

#### Converting Headz → Fashion:
1. Change project title to "Fashion Try On Platform"
2. Update currency from AED to INR (multiply by ~22-23 for conversion)
3. Adjust timeline from 2 weeks → 6 weeks
4. Change payment from 40-30-30 → 60-40
5. Update bank details to RAFTAAR account
6. Add fashion-specific features:
   - Fashion catalog management
   - Size/fit recommendations
   - Wardrobe gallery
7. Change icon from `palette` → `checkroom`
8. Add "Fashion catalog content" to exclusions
9. Update phase 2 timeline from 3 days → 2 weeks
10. Add "GST/Taxes extra" note

#### Converting Fashion → Headz:
1. Change project title to "Headz - AI-Powered Virtual Hairstyling Platform"
2. Update currency from INR to AED (divide by ~22-23)
3. Adjust timeline from 6 weeks → 2 weeks
4. Change payment from 60-40 → 40-30-30
5. Update bank details (if different)
6. Remove fashion-specific features
7. Change icon from `checkroom` → `palette`
8. Remove "Fashion catalog content" from exclusions
9. Update phase 2 timeline from 2 weeks → 3 days
10. Keep or remove GST note based on region

---

### Optional Add-ons Pricing Comparison

| Service | Headz (AED) | Fashion (INR) | Ratio |
|---------|-------------|---------------|-------|
| **Cloud Hosting** | | | |
| Setup | 2,000 | 80,000 | 1:40 |
| Monthly | 500 | 20,000 | 1:40 |
| **AMC** | | | |
| Annual | 6,000 | 2,40,000 | 1:40 |
| Quarterly | 1,800 | 72,000 | 1:40 |
| **Premium Support** | | | |
| Monthly | 1,500 | 60,000 | 1:40 |

**Note**: INR pricing is approximately 40x AED pricing, accounting for exchange rate and market positioning.

---

### Industry-Specific Feature Mapping

| Headz (Hairstyling) | Fashion (Clothing) |
|---------------------|-------------------|
| 15+ Pre-set Hairstyles | Fashion Collections |
| Hairstyle transformations | Outfit try-on |
| Hair color changes | Clothing combinations |
| Style history | Wardrobe gallery |
| Virtual mirror | Virtual fitting room |
| 360° hair view | 360° outfit view |
| - | Size/fit recommendations |
| - | Shopping cart integration |
| - | Fashion catalog |

---

**Last Updated**: October 26, 2025
**Skill Version**: 1.1 (Added Fashion Template)
**Maintained By**: DRMHOPE Software Development Team
