# ProposalAI Template System Guide

## Overview
This guide explains how to use the Bettroi Professional template system for creating all future proposals in the ProposalAI application.

## Template Location
```
public/templates/bettroi-professional/
├── quotation-bettroi.html      # HTML template
├── quotation-styles.css         # Stylesheet
├── template-config.json         # Configuration
├── README.md                    # Template documentation
└── assets/                      # Logo files
    ├── bettroi-logo.svg
    ├── bettroi-logo-new.svg
    ├── drmhope-logo.svg
    └── raftar-logo.svg
```

## Creating a New Proposal

### Step 1: Define Proposal Data
Use the TypeScript types in `types/proposal-template.ts` to structure your proposal data:

```typescript
import { ProposalData } from '@/types/proposal-template';

const myProposal: ProposalData = {
  header: {
    companyLogo: "/templates/bettroi-professional/assets/drmhope-logo.svg",
    companyName: "DRMHOPE SOFTWARE",
    tagline: "Accelerating Digital Innovation",
    quotationNumber: "DRM-2025-Q-1024", // Auto-increment
    date: "October 25, 2025",
    validUntil: "November 25, 2025"
  },
  clientDetails: {
    clientLogo: "/path/to/client-logo.svg",
    clientName: "CLIENT COMPANY NAME",
    clientDescription: "Client Industry/Description",
    clientLocation: "City, Country",
    clientEmail: "contact@client.com"
  },
  // ... continue with other sections
};
```

### Step 2: Customize Sections

#### Header Section
```typescript
header: {
  quotationNumber: `DRM-${new Date().getFullYear()}-Q-${nextQuoteNumber}`,
  date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  validUntil: // Add 30 days to current date
}
```

#### Scope of Work
Add platforms as needed:
```typescript
scopeOfWork: {
  platforms: [
    {
      platformName: "Web Application Development",
      features: [
        "Feature 1",
        "Feature 2",
        // ... add all features
      ]
    },
    {
      platformName: "Mobile Application",
      features: [...]
    }
  ]
}
```

#### Pricing
```typescript
pricing: {
  currency: "AED", // or "USD", "INR", etc.
  items: [
    {
      deliverable: "Platform/Service Name",
      description: "Detailed description",
      amount: 5000
    }
  ],
  total: 13000 // Calculate sum of all items
}
```

#### Timeline
```typescript
timeline: [
  {
    phase: "Phase 1",
    deliverables: "What will be delivered",
    duration: "2 Days"
  },
  // Add more phases
]
```

### Step 3: Required Sections
Always include these sections for consistency:

1. **Header** - Company and quotation details
2. **Client Details** - Client company information
3. **Executive Summary** - Project overview
4. **Scope of Work** - Detailed feature breakdown
5. **Key Features** - Visual highlights (6 features)
6. **Pricing** - Investment breakdown
7. **Timeline** - Development schedule
8. **Terms & Conditions** - Business terms
9. **Footer** - Company contact details

### Step 4: Optional Sections
Include when relevant:

- **Exclusions** - Items not included in the quote
- **Optional Add-ons** - Additional services (hosting, AMC, support)

## Standard Pricing Structure

### Payment Terms (Always Include)
```
40% advance
30% on milestone completion
30% on final delivery
```

### Support Period
```
3 months of bug fixing support post-launch included
```

### Revision Policy
```
Up to 3 rounds of revisions included in each phase
```

## Key Features Grid Guidelines

Always use Material Icons for consistency:
- `palette` - Design/Styling features
- `smart_toy` - AI/ML features
- `360` - 3D/View features
- `phone_iphone` - Mobile/Cross-platform
- `person` - User management
- `dashboard` - Admin features
- `security` - Security features
- `speed` - Performance features
- `integration_instructions` - Integration features
- `analytics` - Analytics features

## Exclusions - Standard Items

Always clarify these items as exclusions:

1. **AI API Costs** - Client bears all AI API subscription and usage costs
2. **Third-party Services** - Client pays for cloud services, databases, etc.
3. **App Store Fees** - Apple/Google store registration and fees
4. **Domain & SSL** - Domain registration and SSL certificates
5. **Hosting Setup** - Unless included in optional add-ons
6. **Ongoing Maintenance** - Unless AMC is purchased
7. **Marketing Materials** - Promotional content creation

## Optional Add-ons - Standard Offerings

### 1. Cloud Hosting
```typescript
{
  service: "Cloud Hosting",
  pricing: {
    setup: 2000,  // One-time AED
    monthly: 500  // Recurring AED
  }
}
```

**Features to include:**
- 99.9% uptime SLA
- Auto-scaling
- Daily backups (30-day retention)
- SSL & CDN
- DDoS protection
- 1TB bandwidth
- 100GB SSD storage

### 2. Annual Maintenance Contract (AMC)
```typescript
{
  service: "Annual Maintenance Contract (AMC)",
  pricing: {
    annual: 6000,    // Full year
    quarterly: 1800  // Per quarter
  }
}
```

**Features to include:**
- 24/7 support
- Monthly security updates
- Bug fixes
- Performance monitoring
- Database optimization
- Quarterly reports
- 4-hour response time
- 20 hours development work

### 3. Premium Support
```typescript
{
  service: "Premium Support Package",
  pricing: {
    monthly: 1500
  }
}
```

**Features to include:**
- Dedicated account manager
- 2-hour SLA
- Weekly reports
- Unlimited minor updates
- Team training

## Timeline Guidelines

### Quick Customization Projects (2 weeks)
- Phase 1: Requirements (2 days)
- Phase 2-4: Platform customization (3 days each)
- Phase 5: Testing & delivery (3 days)

### Full Custom Development (8-12 weeks)
- Phase 1: Discovery & Design (1-2 weeks)
- Phase 2: Backend Development (2-3 weeks)
- Phase 3: Frontend Development (2-3 weeks)
- Phase 4: Mobile Apps (2-3 weeks)
- Phase 5: Testing & Launch (1-2 weeks)

## Color Scheme Reference

### DRMHOPE Branding (Red Theme)
```css
Primary Red: #DC2626
Dark Red: #B91C1C
Darker Red: #991B1B
```

### Other Client Branding
Update colors in CSS file:
```css
.letterhead {
  background: linear-gradient(135deg, #PRIMARY 0%, #SECONDARY 100%);
}
```

## Quotation Number Format

```
DRM-YYYY-Q-XXXX

DRM: DRMHOPE Software prefix
YYYY: Current year
Q: Quotation identifier
XXXX: Sequential number (auto-increment)

Example: DRM-2025-Q-1023
```

## Footer Contact Information

Always use standard format:
```
Company: DRMHOPE SOFTWARE
Address: 2 Teka Naka, Kampti Road
         Nagpur, Maharashtra, India
Mobile: +91 937-3111-709
Email: murali@drmhope.com
Website: www.drmhope.com
```

## Best Practices

### 1. Client Logo
- SVG format preferred
- Square ratio (1:1)
- Transparent background
- Maximum 100x100px display size

### 2. Pricing
- Always specify currency (AED, USD, INR)
- Round numbers (avoid decimals for cleaner look)
- Show clear total
- Separate optional add-ons from main pricing

### 3. Timeline
- Be realistic with estimates
- Account for client feedback time
- Include buffer for revisions
- Clearly state assumptions (e.g., "Fast-track: Core platform already developed")

### 4. Terms
- Keep payment terms consistent (40-30-30)
- Always include IP rights clause
- Mention confidentiality
- Specify revision limits
- Include support period

### 5. Professionalism
- Use formal language
- Check spelling and grammar
- Ensure all sections are complete
- Include signature section
- Add confidentiality notice

## Export Options

### PDF Export
The template is print-ready:
- Use browser print (Ctrl/Cmd + P)
- Select "Save as PDF"
- Recommended: A4 page size
- Colors will be preserved

### Web Preview
Access the HTML file directly:
```
http://localhost:3000/templates/bettroi-professional/quotation-bettroi.html
```

## Future Enhancements

### Planned Features
- [ ] Dynamic data binding with React
- [ ] PDF generation from proposal data
- [ ] Template customization UI
- [ ] Multiple template themes
- [ ] Email integration
- [ ] Digital signature capture
- [ ] Client portal for proposal viewing
- [ ] Version history tracking
- [ ] Proposal analytics (views, time spent)

## FAQ

**Q: Can I change the company logo?**
A: Yes, replace the logo file in `assets/` and update the reference in the header.

**Q: How do I add a new platform section?**
A: Add a new object to the `scopeOfWork.platforms` array with `platformName` and `features`.

**Q: What if my project doesn't need mobile apps?**
A: Simply remove the iOS and Android sections from scope of work and pricing.

**Q: Can I use different colors?**
A: Yes, update the color values in `quotation-styles.css` but maintain the professional appearance.

**Q: How do I handle multi-currency?**
A: Update the `currency` field in pricing data. Consider adding exchange rate note if needed.

## Support

For template questions or customizations:
- Email: murali@drmhope.com
- Internal: Check `public/templates/bettroi-professional/README.md`

---

**Last Updated**: October 25, 2025
**Template Version**: 1.0
**Maintained by**: DRMHOPE Software Development Team
