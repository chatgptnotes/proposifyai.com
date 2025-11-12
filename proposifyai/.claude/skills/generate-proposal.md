# Generate Bettroi Proposal Skill

Generate a professional Bettroi-branded proposal using the standardized template system.

## Overview

This skill automates the creation of client proposals with consistent Bettroi branding, including:
- Professional letterhead with logo, company name, and reference information
- Standardized header and footer on every page
- A4 page formatting optimized for printing and PDF export
- Bettroi brand colors and typography

## Template Location

- **Template Directory**: `/templates/bettroi/`
- **Template HTML**: `/templates/bettroi/template.html`
- **Styles**: `/templates/bettroi/styles.css`
- **Logo**: `/templates/bettroi/logo.jpg`
- **Config**: `/templates/bettroi/config.json`

## Process

When this skill is invoked:

### 1. Gather Required Information

Ask the user for the following details (if not already provided):

**Client Information:**
- Client company name
- Client email address
- Client website URL

**Proposal Details:**
- Proposal title (e.g., "AI-Integrated Kitchen Management System")
- Proposal date/month (e.g., "December 2025")
- Bettroi reference number (format: BETTROI K##)
- ERP reference (format: SAL-QTN-YYYY-#####)

**Project Details:**
- Total investment amount (e.g., "$33,863 USD")
- Project duration description (e.g., "6 Months | 12 Sprints | 3 Phases")

**Content Sections:**
- Ask user to provide or confirm the main sections to include
- **MANDATORY SECTIONS** (always include these in order):
  1. Executive Summary
  2. **Scope of Work** (MUST have both In-scope AND Out-of-scope subsections)
  3. Architecture and Integrations (if technical project)
  4. Deliverables
  5. Technology Stack
  6. Performance & Scale (if applicable)
  7. Project Plan and Milestones
  8. Commercials (Year-1)
  9. Client Responsibilities
  10. Important Points
  11. What Third-Party Subscriptions Are Needed (if applicable)
  12. Division of Responsibilities
  13. How Billing Works (Mechanics) (if third-party costs involved)
  14. Cost Controls (if applicable)
  15. Data and Security Notes
  16. Integration Touchpoints (if applicable)
  17. Billing & Usage
  18. Data & Access
  19. Cost Control (if applicable)
  20. Acceptance Criteria
  21. Data Privacy & Security
  22. Third-Party Services and Billing Model (if applicable)
  23. Assumptions
  24. Change Control
  25. Warranty, IP, and Terms
  26. Technical Notes (Concise) (if applicable)
  27. Service Order Confirmation – Letter of Intent (LOI)

**CRITICAL: Scope of Work Structure**
The Scope of Work section MUST always include:
- **In-scope**: Bulleted list of what IS included in the project
- **Out-of-scope**: Bulleted list of what IS NOT included in the project

This prevents scope creep and sets clear boundaries with the client.

### 2. Generate Proposal Content

1. Read the template files from `/templates/bettroi/`
2. Load configuration from `config.json`
3. Replace all template variables:
   - `{{CLIENT_NAME}}` → Client name
   - `{{CLIENT_EMAIL}}` → Client email
   - `{{CLIENT_WEBSITE}}` → Client website
   - `{{PROPOSAL_TITLE}}` → Proposal title
   - `{{REFERENCE}}` → Bettroi reference (e.g., "BETTROI K26")
   - `{{ERP_REFERENCE}}` → ERP reference (e.g., "SAL-QTN-2025-00037")
   - `{{DATE}}` → Full date (e.g., "12 November 2025")
   - `{{DATE_SHORT}}` → Short date (e.g., "11-Nov-25")
   - `{{TOTAL_INVESTMENT}}` → Investment amount
   - `{{PROJECT_DURATION}}` → Duration description
   - `{{TABLE_OF_CONTENTS}}` → Generated TOC HTML
   - `{{CONTENT_PAGES}}` → Generated content pages

4. Generate Table of Contents from section titles

5. Create content pages (Pages 3-12):
   - Distribute sections across pages (2-3 sections per page)
   - Each page includes header, content, and footer
   - Maintain consistent page numbering

### 3. Create Output File

1. Generate filename: `[ClientName]_[ProjectName]_Proposal.html`
2. Save to project root directory
3. Verify structure:
   - 12 pages with proper HTML structure
   - 12 logos (one per page)
   - 12 footers (one per page)
   - No nested or duplicate elements
   - Footer positioned at bottom of each page

### 4. Validate Output

Run verification checks:
```python
# Verify page structure
pages = count("<div class=\"page\">")
logos = count("<img src=\"logo.jpg\"")
footers = count("<div class=\"footer\">")

# All should equal 12 (or number of pages)
assert pages == logos == footers

# CRITICAL: Verify Scope of Work structure
scope_section = find_section("Scope of Work")
assert "In-scope" in scope_section, "Missing In-scope subsection"
assert "Out-of-scope" in scope_section, "Missing Out-of-scope subsection"

# Verify all mandatory sections are present
mandatory_sections = [
    "Executive Summary",
    "Scope of Work",
    "Deliverables",
    "Technology Stack",
    "Project Plan and Milestones",
    "Commercials",
    "Client Responsibilities",
    "Acceptance Criteria",
    "Assumptions",
    "Change Control",
    "Warranty, IP, and Terms",
    "Letter of Intent"
]

for section in mandatory_sections:
    assert section in content, f"Missing mandatory section: {section}"
```

### 5. Report to User

Provide summary:
```
✓ Proposal generated successfully!

Client: [Client Name]
Title: [Proposal Title]
Pages: 12
File: [Filename].html

Structure Verified:
- Pages: 12
- Logos: 12
- Footers: 12
- File size: [size]

Next steps:
1. Open the file in your browser to review
2. Use browser Print > Save as PDF for PDF export
3. Edit content directly in HTML if needed
```

## Template Variables Reference

| Variable | Example | Description |
|----------|---------|-------------|
| `{{CLIENT_NAME}}` | SDLC Corp | Client company name |
| `{{CLIENT_EMAIL}}` | contact@sdlccorp.com | Client email |
| `{{CLIENT_WEBSITE}}` | www.sdlccorp.com | Client website |
| `{{PROPOSAL_TITLE}}` | Commercial Proposal - AI System | Main title |
| `{{PROPOSAL_DATE}}` | December 2025 | Full date |
| `{{REFERENCE}}` | BETTROI K26 | Bettroi reference |
| `{{ERP_REFERENCE}}` | SAL-QTN-2025-00037 | ERP reference |
| `{{DATE}}` | 12 November 2025 | Header date |
| `{{DATE_SHORT}}` | 11-Nov-25 | Footer date |
| `{{TOTAL_INVESTMENT}}` | $33,863 USD | Investment |
| `{{PROJECT_DURATION}}` | 6 Months \| 12 Sprints | Duration |

## Quality Standards

Ensure the generated proposal meets these standards:

- ✓ All placeholders replaced (no `{{...}}` remaining)
- ✓ Consistent branding (logo, colors, fonts)
- ✓ Proper page structure (no overlapping content)
- ✓ Footer at bottom of each page (not middle)
- ✓ Page numbers sequential and correct
- ✓ Professional formatting and spacing
- ✓ No HTML errors or broken tags
- ✓ File opens correctly in browser

## Example Usage

```bash
# User invokes skill
User: "Generate a proposal for Acme Corp for our ERP implementation project"

# Skill asks for missing details
Skill: "I'll generate a Bettroi proposal for Acme Corp. Please provide:
1. Client email:
2. Client website:
3. Proposal title:
4. Total investment:
5. Project duration:"

# User provides details
User: "Email: info@acmecorp.com, website: www.acmecorp.com,
       title: 'ERP Implementation & Integration',
       investment: '$125,000 USD',
       duration: '12 Months | 24 Sprints | 4 Phases'"

# Skill generates and reports
Skill: "✓ Generated Acme_Corp_ERP_Implementation_Proposal.html
       12 pages, properly formatted, ready for review"
```

## Notes

- **Logo Path**: Always use relative path `logo.jpg` in generated HTML
- **CSS**: Link to `styles.css` for easy styling updates
- **Page Count**: Aim for 12 pages by distributing content appropriately
- **Backup**: Save current proposal as template if user requests
- **Customization**: Respect user's custom sections and content

## Error Handling

If errors occur:
1. Verify template files exist and are readable
2. Check all variables have values (no undefined)
3. Validate HTML structure before saving
4. Provide clear error messages to user

## Version

Skill Version: 1.0.0
Template Version: 1.0.0
Last Updated: November 12, 2025
