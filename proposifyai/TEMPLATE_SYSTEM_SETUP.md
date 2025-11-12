# Bettroi Proposal Template System - Setup Complete ✅

## Overview

A comprehensive template system has been implemented for generating professional Bettroi-branded proposals with consistent formatting, branding, and structure.

## What Was Created

### 1. Template Directory Structure
```
/templates/bettroi/
├── template.html      # Main HTML template with placeholders
├── styles.css        # Reusable CSS styles
├── logo.jpg          # Bettroi company logo (blue "BB" logo)
├── config.json       # Template configuration and variables
└── README.md         # Complete usage documentation
```

### 2. Template Files

#### `template.html`
- Clean HTML structure with `{{PLACEHOLDER}}` variables
- Standardized header with logo, company name, and reference info
- Title box for cover page
- Content sections with proper styling
- Footer positioned at bottom using flexbox

#### `styles.css`
- Complete CSS extracted from working proposal
- Bettroi brand color: #003DA5
- A4 page dimensions: 210mm x 297mm
- Typography: Arial, 12px body, 16px h2, 14px h3
- Responsive footer positioning
- Print-optimized styles

#### `config.json`
- Template metadata and branding settings
- Variable defaults and formats
- Company information
- Typography and color specifications

#### `logo.jpg`
- Bettroi company logo (blue square with white "BB")
- Copied from working proposal
- Used consistently across all pages

### 3. Claude Code Skill

**File:** `.claude/skills/generate-proposal.md`

**Purpose:** Automate proposal generation from CLI

**Usage:**
```bash
# In Claude Code terminal
/generate-proposal
```

**Features:**
- Interactive prompts for client and project details
- Automatic variable replacement
- Structure verification
- Quality checks

### 4. API Endpoint

**File:** `app/api/proposals/generate-from-template/route.ts`

**Endpoints:**

#### POST /api/proposals/generate-from-template
Generate a new proposal from template

**Request:**
```typescript
{
  "templateId": "bettroi",
  "clientData": {
    "name": "Client Company Name",
    "email": "contact@client.com",
    "website": "www.client.com"
  },
  "projectData": {
    "title": "Project Title",
    "investment": "$XX,XXX USD",
    "duration": "X Months | X Sprints | X Phases",
    "sections": [
      { "title": "Section Title", "content": "<p>HTML content</p>" }
    ]
  },
  "reference": "BETTROI K26",  // Optional
  "erpReference": "SAL-QTN-2025-00037",  // Optional
  "date": "December 2025"  // Optional
}
```

**Response:**
```typescript
{
  "success": true,
  "proposal": {
    "id": "uuid",
    "title": "...",
    "client_name": "...",
    "reference": "...",
    "erp_reference": "...",
    "html": "..."
  }
}
```

#### GET /api/proposals/generate-from-template
List available templates

**Response:**
```typescript
{
  "templates": [
    {
      "id": "bettroi",
      "name": "Bettroi Professional Proposal",
      "version": "1.0.0",
      "company": "BETTROI"
    }
  ]
}
```

### 5. Documentation Updates

#### Updated `CLAUDE.md`
- Added "PROPOSAL TEMPLATE SYSTEM" section
- Documented template location and structure
- Listed all template variables
- Explained usage methods (CLI, API, Manual)
- Added quality standards
- Updated completed features list

## Template Variables

All available placeholders for customization:

| Variable | Example | Usage |
|----------|---------|-------|
| `{{CLIENT_NAME}}` | SDLC Corp | Client company name |
| `{{CLIENT_EMAIL}}` | contact@sdlccorp.com | Client email |
| `{{CLIENT_WEBSITE}}` | www.sdlccorp.com | Client website |
| `{{PROPOSAL_TITLE}}` | Commercial Proposal - AI System | Main proposal title |
| `{{PROPOSAL_DATE}}` | December 2025 | Full date on cover |
| `{{REFERENCE}}` | BETTROI K26 | Bettroi reference number |
| `{{ERP_REFERENCE}}` | SAL-QTN-2025-00037 | ERP system reference |
| `{{DATE}}` | 12 November 2025 | Header date |
| `{{DATE_SHORT}}` | 11-Nov-25 | Footer date |
| `{{TOTAL_INVESTMENT}}` | $33,863 USD | Project investment |
| `{{PROJECT_DURATION}}` | 6 Months \| 12 Sprints | Duration info |
| `{{TABLE_OF_CONTENTS}}` | HTML | Generated TOC |
| `{{CONTENT_PAGES}}` | HTML | Generated pages |

## How to Use

### Method 1: Claude Skill (Recommended for CLI)

```bash
# In Claude Code terminal
/generate-proposal
```

Follow the interactive prompts to provide:
- Client information
- Project details
- Content sections

The skill will:
- Replace all variables
- Generate proper HTML structure
- Verify page count and structure
- Save to file

### Method 2: API Endpoint (For Application Integration)

```typescript
// From your Next.js application
const response = await fetch('/api/proposals/generate-from-template', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateId: 'bettroi',
    clientData: { name, email, website },
    projectData: { title, investment, duration, sections }
  })
});

const { proposal } = await response.json();
// proposal.html contains the generated HTML
// proposal.id is the database ID
```

### Method 3: Manual HTML Generation

1. Copy `templates/bettroi/template.html`
2. Replace all `{{VARIABLES}}` with actual values
3. Replace `{{CONTENT_PAGES}}` with your page HTML
4. Link to `styles.css` or inline the styles
5. Verify structure: 12 pages, 12 logos, 12 footers

## Quality Standards

Every generated proposal must meet:

- ✅ All `{{PLACEHOLDERS}}` replaced
- ✅ Consistent Bettroi branding
- ✅ Logo on every page
- ✅ Footer at bottom of page (not middle)
- ✅ Page numbers sequential
- ✅ No nested page divs
- ✅ No HTML errors
- ✅ Opens correctly in browser
- ✅ Print/PDF ready

## Maintenance & Updates

### To Update Template Globally

1. **Styling Changes:**
   - Edit `templates/bettroi/styles.css`
   - All future proposals inherit changes

2. **Configuration Changes:**
   - Edit `templates/bettroi/config.json`
   - Update brand colors, fonts, etc.

3. **Structure Changes:**
   - Edit `templates/bettroi/template.html`
   - Modify header/footer layout

4. **Logo Changes:**
   - Replace `templates/bettroi/logo.jpg`
   - All proposals use new logo

### To Create New Template

1. Copy `templates/bettroi/` to `templates/[new-name]/`
2. Update all files with new branding
3. Update `config.json` with new settings
4. Template automatically available via API

## File Locations

```
/Users/murali/1backup/Poposifyai.com/proposifyai/
├── templates/
│   └── bettroi/
│       ├── template.html
│       ├── styles.css
│       ├── logo.jpg
│       ├── config.json
│       └── README.md
├── .claude/
│   └── skills/
│       └── generate-proposal.md
├── app/
│   └── api/
│       └── proposals/
│           └── generate-from-template/
│               └── route.ts
├── CLAUDE.md (updated)
└── TEMPLATE_SYSTEM_SETUP.md (this file)
```

## Current Working Proposal

The current Bettroi Kitchen Management Proposal has been preserved:
- **File:** `Bettroi_Kitchen_Management_Proposal.html`
- **Status:** ✅ Working, 12 pages, proper structure
- **Structure:** 12 pages, 12 logos, 12 footers
- **Footer:** Positioned at bottom using flexbox

## Next Steps

### Immediate
1. Test the `/generate-proposal` skill with a new client
2. Try the API endpoint from your Next.js app
3. Create a UI component for template selection

### Short-term
1. Add more templates (CheriPic, other clients)
2. Create template preview functionality
3. Add template version management
4. Implement template sharing across team

### Long-term
1. Build visual template editor in UI
2. Add AI-powered content generation per section
3. Create template marketplace
4. Implement A/B testing for templates

## Testing

### Test the Skill
```bash
/generate-proposal
# Provide test data when prompted
```

### Test the API
```bash
curl -X POST http://localhost:3000/api/proposals/generate-from-template \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "bettroi",
    "clientData": {
      "name": "Test Corp",
      "email": "test@test.com",
      "website": "www.test.com"
    },
    "projectData": {
      "title": "Test Project",
      "investment": "$10,000 USD",
      "duration": "3 Months | 6 Sprints"
    }
  }'
```

### List Templates
```bash
curl http://localhost:3000/api/proposals/generate-from-template
```

## Support

For questions or issues:
1. Check `templates/bettroi/README.md` for detailed usage
2. Review `.claude/skills/generate-proposal.md` for skill documentation
3. See `CLAUDE.md` for system overview
4. Check API endpoint code for integration examples

## Standard Section Structure

All Bettroi proposals now follow a standardized structure with mandatory sections:

### **Always Required:**
1. Executive Summary
2. **Scope of Work** (MUST include both In-scope AND Out-of-scope)
3. Deliverables
4. Technology Stack
5. Project Plan and Milestones
6. Commercials (Year-1)
7. Client Responsibilities
8. Important Points
9. Division of Responsibilities
10. Acceptance Criteria
11. Data Privacy & Security
12. Assumptions
13. Change Control
14. Warranty, IP, and Terms
15. Service Order Confirmation – Letter of Intent (LOI)

### **Include When Applicable:**
- Architecture and Integrations
- Performance & Scale
- Third-Party Subscriptions
- Billing Mechanics
- Cost Controls
- Data and Security Notes
- Integration Touchpoints
- Technical Notes

### **CRITICAL: Inclusions & Exclusions**

Every proposal MUST include a "Scope of Work" section with:

**In-scope**
- Bulleted list of what IS included in the project
- Be specific about features, capabilities, and deliverables

**Out-of-scope**
- Bulleted list of what IS NOT included in the project
- Clearly state exclusions to prevent scope creep
- List components the client owns

**Reference Files:**
- `standard-sections.json` - Complete section definitions
- `section-templates.md` - Templates and examples for each section

## Version

Template System Version: 1.1.0
Created: November 12, 2025
Updated: November 12, 2025 (Added standard sections and inclusions/exclusions)
Status: ✅ Production Ready

---

**Ready to generate your first template-based proposal with standardized sections!** 🚀
