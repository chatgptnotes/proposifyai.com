# Generate Full Payment Invoice

Generate professional full payment invoices (100% payment for complete projects) from Raftaar Help Emergency Seva to clients, following the established invoice format and branding.

## Context & Purpose

**When to use:** Create invoices for projects that require 100% payment upon completion, with no advance/final split.

**Key characteristics:**
- Single payment for complete project value
- Simpler structure than advance/final split invoices
- Confirms project completion and delivery
- Professional Raftaar branding with red gradient header
- Clean total amount presentation

## Invoice Details Structure

### Required Information
1. **Client Details:**
   - Company Name (e.g., BETTROI FZE)
   - Address
   - PO Box
   - TRN (Tax Registration Number)

2. **Invoice Information:**
   - Invoice Number (format: DDMMYY-N)
   - Invoice Date
   - PO Reference Number
   - Payment Date (if already paid)

3. **Project Information:**
   - Project Name/Title
   - Total Project Value (100%)
   - Brief description of deliverables

## Standard Bank Details
```
Account Name: RAFTAAR HELP EMERGENCY SEVA
Account Number: 43835697434
IFSC Code: SBIN0064460
Bank: State Bank of India, Ajni (Branch Code: 64460)
```

## Template Structure

The invoice must include:

1. **Header Banner:**
   - Red gradient background (#e53e3e to #c53030)
   - RAFTAAR logo/text in white
   - @raftaar subtitle

2. **Invoice Title:** "Full Payment Invoice"

3. **Parties Section:**
   - Invoice To (Client details)
   - Invoice From (Raftaar details)

4. **Invoice Details:**
   - Invoice number, date, PO reference, payment date

5. **Project Title:** Clear project name

6. **Items Table:**
   - Description: "Complete [project type] development and deployment (100%)"
   - Amount in INR
   - Total row with green background highlighting

7. **Payment Terms:**
   - Statement: "100% payment upon project completion, deployment, and acceptance"
   - Confirmation: "Project successfully delivered and deployed to production"

8. **Bank Details Section:**
   - Formatted table with account information

9. **Notes:**
   - Payment receipt reference if applicable
   - Project completion confirmation
   - Any additional context about composite payments

10. **Signature Section:**
    - "Best Regards,"
    - Dr. Murali BK
    - Raftaar Help Emergency Seva

11. **Footer:**
    - @raftaar contact information
    - Email: cmd@hopehospital.com
    - Website: www.drmhope.com
    - Phone: +91 9373111709

## Design Specifications

### Colors
- Primary Red: #e53e3e
- Dark Red: #c53030
- Success Green: #f0fff4 (for total row background)
- Dark Gray: #2d3748
- Medium Gray: #4a5568
- Light Background: #f7fafc
- Light Red Background: #fff5f5
- Red Border: #feb2b2

### Typography
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Invoice Title: 28px, font-weight 600
- Section Headers: 16px, font-weight 700
- Body Text: 14px
- Footer Text: 13px

### Total Row Styling
```css
.total-row {
    font-size: 16px;
    font-weight: 700;
    color: #2d3748;
    background: #f0fff4;
}
```

## Example Usage

**Input:**
- Client: BETTROI FZE, Dubai
- Project: 4C Web Platform Development
- Total Amount: ₹50,000
- Invoice Date: 19 Nov 2025
- PO Reference: PUR-ORD-2025-00014
- Payment Received: 20 Nov 2025

**Output:**
Professional HTML invoice showing:
- Total Amount: ₹50,000 (100%)
- Completion confirmation
- Payment receipt reference

## File Naming Convention
Format: `Invoice_[ProjectName]_100Percent.html`
Example: `Invoice_4C_WebPlatform_100Percent.html`

## Notes for AI Generation

1. **Always ask for:**
   - Client name and address
   - Project name and brief description
   - Total project value
   - Invoice date
   - PO reference number
   - Project completion status

2. **Auto-generate:**
   - Invoice number from date (DDMMYY-N format)

3. **Include in notes:**
   - Payment receipt reference if provided
   - Project completion and acceptance confirmation
   - Mention if part of composite payment covering multiple projects

4. **Description Templates:**
   - Web Platform: "Complete web platform development and deployment (100%)"
   - Mobile App: "Complete mobile application development and deployment (100%)"
   - Custom Software: "Complete custom software solution development and deployment (100%)"
   - Integration: "Complete system integration and deployment (100%)"

5. **Maintain consistency:**
   - Use exact bank details as shown above
   - Keep Raftaar branding colors and styling
   - Use standard footer contact information
   - Highlight total amount with green background

## Payment Terms Language

Standard template:
```
"100% payment upon project completion, deployment, and acceptance.
Project successfully completed, deployed, and accepted by client."
```

## When to Use This vs Split Invoices

**Use Full Payment Invoice when:**
- Small to medium projects (typically under ₹100,000)
- Fast-turnaround projects (1-4 weeks)
- Client prefers single payment
- Low-risk projects with established clients

**Use Advance/Final Split when:**
- Large projects (typically over ₹100,000)
- Long-duration projects (6+ weeks)
- New clients or higher risk projects
- Industry standard requires payment milestones

## Related Skills
- `generate-advance-invoice.md` - For advance payment invoices
- `generate-final-invoice.md` - For final payment invoices
- `generate-proposal.md` - For project proposals

## Version History
- v1.0.0 (2025-12-26): Initial skill creation based on 4C Web Platform invoice
