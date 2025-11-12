# Bettroi Professional Proposal Template

This template provides the standardized Bettroi letterhead design for all company proposals.

## Files

- **`template.html`** - Main HTML template with placeholders
- **`styles.css`** - Reusable CSS styles
- **`logo.jpg`** - Bettroi company logo
- **`config.json`** - Template configuration and variables
- **`README.md`** - This file

## Template Variables

Replace these placeholders when generating a new proposal:

### Client Information
- `{{CLIENT_NAME}}` - Client company name (e.g., "SDLC Corp")
- `{{CLIENT_EMAIL}}` - Client email address
- `{{CLIENT_WEBSITE}}` - Client website URL

### Proposal Details
- `{{PROPOSAL_TITLE}}` - Main proposal title
- `{{PROPOSAL_DATE}}` - Full proposal date (e.g., "December 2025")
- `{{REFERENCE}}` - Bettroi reference number (e.g., "BETTROI K26")
- `{{ERP_REFERENCE}}` - ERP system reference (e.g., "SAL-QTN-2025-00037")
- `{{DATE}}` - Header date (e.g., "12 November 2025")
- `{{DATE_SHORT}}` - Footer date (e.g., "11-Nov-25")

### Project Details
- `{{TOTAL_INVESTMENT}}` - Investment amount (e.g., "$33,863 USD")
- `{{PROJECT_DURATION}}` - Duration description (e.g., "6 Months | 12 Sprints | 3 Phases")

### Content Sections
- `{{TABLE_OF_CONTENTS}}` - Generated table of contents HTML
- `{{CONTENT_PAGES}}` - Generated content pages HTML

## Usage

### Method 1: Manual HTML Generation
1. Copy `template.html` to your project
2. Replace all `{{VARIABLES}}` with actual values
3. Update `{{CONTENT_PAGES}}` with your proposal content

### Method 2: Using Claude Skill
```bash
# In Claude Code CLI
/generate-proposal
```
Follow the prompts to provide client and project details.

### Method 3: Using API Endpoint
```typescript
POST /api/proposals/generate-from-template
{
  "templateId": "bettroi",
  "clientData": {
    "name": "SDLC Corp",
    "email": "contact@sdlccorp.com",
    "website": "www.sdlccorp.com"
  },
  "projectData": {
    "title": "AI-Integrated Kitchen Management System",
    "investment": "$33,863 USD",
    "duration": "6 Months | 12 Sprints | 3 Phases"
  }
}
```

## Template Structure

Each page follows this structure:

```html
<div class="page">
  <div class="header">
    <!-- Logo, Company Name, Reference Info -->
  </div>

  <!-- Optional: Title Box (Page 1 only) -->
  <div class="title-box">
    <div class="title">{{PROPOSAL_TITLE}}</div>
    <div class="erp">ERP REF: {{ERP_REFERENCE}}</div>
  </div>

  <div class="content">
    <!-- Page content here -->
  </div>

  <div class="footer">
    <b>BETTROI: BETTER BUSINESS</b>
    <span>{{DATE_SHORT}} / {{ERP_REFERENCE}}</span>
    <b>{{PAGE_NUMBER}} | Page</b>
  </div>
</div>
```

## Styling Guidelines

- **Brand Color**: #003DA5 (Bettroi Blue)
- **Page Size**: A4 (210mm x 297mm)
- **Font**: Arial, sans-serif
- **Body Text**: 12px, line-height 1.8
- **Headings**: h2 (16px), h3 (14px)

## Maintenance

To update the template globally:
1. Modify `styles.css` for styling changes
2. Update `config.json` for configuration changes
3. Modify `template.html` for structure changes
4. All future proposals will inherit the updates

## Version

Current Version: 1.0.0
Last Updated: November 12, 2025
