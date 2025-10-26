# Changelog

All notable changes to Proposify AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-10-25

### Added

#### Professional Proposal Template System
- **Bettroi Professional Template** - Enterprise-grade proposal template
  - Location: `public/templates/bettroi-professional/`
  - HTML template with professional letterhead design
  - Complete CSS stylesheet with red (#DC2626) branding
  - Material Icons integration for visual elements
  - Print-ready PDF export capability
  - Responsive design for all devices

#### Template Components
- **Header/Letterhead**: Gradient red design with company branding
- **Client Details**: Dedicated section for client logo and information
- **Executive Summary**: Project overview and objectives
- **Scope of Work**: Multi-platform feature breakdown (Web, iOS, Android)
- **Key Features Grid**: 3x2 visual grid with Material Icons
- **Investment Breakdown**: Professional pricing tables in AED
- **Exclusions Section**: Clear out-of-scope items (AI API costs, hosting, etc.)
- **Optional Add-ons**: Cloud hosting, AMC, premium support packages
- **Development Timeline**: Phase-wise breakdown with durations
- **Terms & Conditions**: Comprehensive business terms (40-30-30 payment)
- **Acceptance Section**: Digital signature blocks
- **Professional Footer**: Company contact and legal information

#### Template Configuration
- **template-config.json**: Complete template structure definition
- **TypeScript types**: Full type definitions in `types/proposal-template.ts`
- **Sample data**: Bettroi Headz project as reference implementation
- **Template README**: Comprehensive template documentation

#### Documentation
- **TEMPLATE_GUIDE.md**: Complete guide for using the template system
  - How to create new proposals
  - Section customization instructions
  - Standard pricing structures
  - Timeline guidelines
  - Best practices
  - FAQ section

#### Assets
- DRMHOPE Software logo (SVG)
- Bettroi logo (2 versions, SVG)
- Raftar logo (SVG)
- All logos optimized for web and print

#### Type System
- `ProposalTemplate` interface
- `ProposalData` interface with all sections
- `HeaderData`, `ClientDetailsData`, `PricingData` types
- `TimelinePhase`, `AddonItem` types
- Sample data export for reference

### Changed
- Updated deployment configuration with `vercel.json`
- Fixed ESLint errors for production builds
- Added Suspense boundary to `/proposals/new` page

### Fixed
- ESLint `react/no-unescaped-entities` errors in dashboard, login, and routes pages
- `useSearchParams()` Suspense boundary issue in proposals/new page
- Vercel deployment configuration for Next.js framework

### Deployment
- Successfully deployed to Vercel production
- All 12 pages generated successfully
- Build time: 52 seconds
- Status: Ready
- URL: https://proposifyai-ahbau0gf3-chatgptnotes-6366s-projects.vercel.app

### Template Features
- Professional branding with DRMHOPE red theme
- Responsive design (desktop, tablet, mobile)
- Print-ready with A4 page optimization
- Material Icons throughout
- Hover effects and animations
- Clean typography with 1.6 line height
- Gradient headers and section dividers
- Professional color scheme (#DC2626, #B91C1C, #991B1B)

### Standard Proposal Structure
1. Header with quotation number (DRM-YYYY-Q-XXXX format)
2. Client details with logo placement
3. Executive summary
4. Scope of work (repeatable platform sections)
5. Key features (6-item grid)
6. Pricing breakdown with totals
7. Exclusions (AI costs, hosting, etc.)
8. Optional add-ons (hosting, AMC, support)
9. Timeline (5-phase default structure)
10. Terms & conditions (8 standard terms)
11. Acceptance/signatures
12. Footer with contact information

### Usage Guidelines
- Use for all DRMHOPE Software proposals
- Maintain consistent branding across projects
- Customize content while keeping structure
- Include AI API cost clarifications
- Offer standard optional add-ons
- Keep 30-day quotation validity
- Use 40-30-30 payment terms

## [1.0.0] - 2025-01-25

### Added

#### Core Features
- Complete Next.js 14 application setup with App Router
- TypeScript configuration for type safety
- Tailwind CSS for styling
- Responsive design for mobile and desktop

#### Pages & Routes (10 total)
- Landing page (/) with features, pricing, and CTAs
- Navigation hub (/routes) for easy page access
- Authentication pages (/login, /signup)
- Dashboard (/dashboard) with stats and AI insights
- Proposals list (/proposals) with filtering
- New proposal wizard (/proposals/new) with 3-step process
- Proposal editor (/proposals/[id]) with rich text editing
- Templates library (/templates) with 6 pre-built templates
- Settings (/settings) with 5 configuration tabs

#### Templates
- DRM Hope Software Proposal template
- Bettroi Integration Proposal template
- Hospital Management System template
- SaaS Subscription Proposal template
- Custom Development Quote template
- Maintenance & Support Contract template

#### UI/UX Improvements
- Replaced all emojis with Google Material Icons
- Material UI Icons package (@mui/icons-material) installed
- Consistent icon usage across all pages
- Professional, clean interface design

#### Version Management
- Version footer component with build number and date
- Automatic version tracking system
- Version displayed on all pages (starting with routes page)
- Version configuration in lib/version.ts

#### Documentation
- clude.md - Comprehensive autonomous build documentation
- README.md - Project overview and setup guide
- ROUTING_GUIDE.md - Complete routing documentation
- PAGES_GUIDE.md - Page-by-page feature guide
- BRANDING_UPDATE.md - Branding changes log
- .env.example - Environment variables template
- CHANGELOG.md - This file

### Changed
- Updated branding from "ProposalAI" to "Proposify AI"
- Domain changed to proposifyai.com
- All navigation updated with consistent branding
- Package name updated to "proposifyai"

### Technical Stack
- Next.js 14.2.33 (App Router)
- React 18
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Material UI Icons (@mui/icons-material)
- Radix UI components
- Zustand for state management
- @dnd-kit for drag and drop
- OpenAI SDK (installed, not yet integrated)
- Anthropic SDK (installed, not yet integrated)

### Infrastructure
- Development server configured on port 3000
- Hot module replacement (HMR) enabled
- TypeScript strict mode
- ESLint configuration ready
- Prettier configuration ready

### Current Status
- Frontend: Fully functional
- Backend: Mocked (ready for integration)
- Database: Structure planned (Supabase)
- AI Features: UI ready (APIs to be connected)
- Authentication: UI complete (backend pending)
- Payments: UI complete (Stripe integration pending)

### Known Limitations
- Authentication is simulated (no real validation yet)
- All data is static/sample data
- AI features are UI-only (no API calls yet)
- No email sending implemented
- No payment processing implemented
- No PDF export functionality
- No file upload functionality

### File Structure
```
proposalai/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── routes/               # Navigation hub
│   ├── login/                # Authentication
│   ├── signup/               # Registration
│   ├── dashboard/            # Main dashboard
│   ├── proposals/            # Proposal management
│   ├── templates/            # Template library
│   └── settings/             # User settings
├── components/               # Reusable React components
│   └── VersionFooter.tsx     # Version footer
├── lib/                      # Utility functions
│   └── version.ts            # Version tracking
├── public/                   # Static assets
├── .env.example              # Environment template
├── clude.md                  # Build documentation
├── CHANGELOG.md              # This file
└── README.md                 # Project README
```

### Dependencies Added
- @mui/icons-material ^7.2.2
- @mui/material ^7.2.2
- @emotion/react ^11.14.0
- @emotion/styled ^11.14.0

### Performance
- All routes compile successfully
- Average compilation time: <500ms
- Page load times: <2s
- Hot reload: <100ms

### Security
- Environment variables properly configured
- No secrets in code
- .env.example created for guidance
- Input validation ready for implementation
- CSRF protection planned
- Rate limiting planned

### Next Phase (v1.1.0) - Planned
- Add version footer to all remaining pages
- Supabase database integration
- Real authentication system
- OpenAI API integration for AI features
- Anthropic Claude API integration
- Email notifications (SendGrid)
- PDF export functionality
- File upload system
- Analytics integration (PostHog/Mixpanel)
- Error tracking (Sentry)

### Deployment Readiness
- Project structure complete
- Environment variables documented
- Development workflow established
- Production build tested
- Ready for Vercel deployment

---

## Future Versions

### [1.1.0] - Planned
- Backend integration (Supabase)
- Real authentication
- AI API connections

### [1.2.0] - Planned
- Real-time collaboration
- PDF export
- Email notifications

### [2.0.0] - Planned
- Voice-to-text proposals (ElevenLabs)
- Mobile app
- Advanced AI features
- Enterprise features
- White-label option
- API for integrations

---

**Note**: This project follows semantic versioning:
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backwards compatible manner
- PATCH version for backwards compatible bug fixes

**Build Number**: Increments with each push/save
**Last Updated**: Automatically tracked in lib/version.ts
