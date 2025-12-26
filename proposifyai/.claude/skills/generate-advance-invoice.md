# Generate Advance Payment Invoice

Generate professional advance payment invoices (typically 40% of project value) from Raftaar Help Emergency Seva to clients, following the established invoice format and branding.

## Context & Purpose

**When to use:** Create advance/down payment invoices for projects where payment is split (e.g., 40% advance, 60% on completion).

**Key characteristics:**
- Shows advance amount and total PO value
- References PO number
- Includes payment terms explaining the payment structure
- Professional Raftaar branding with red gradient header
- Same bank details used across all invoices

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
   - Total PO Value
   - Advance Percentage (typically 40%)
   - Advance Amount

4. **Payment Details:**
   - Payment terms explanation
   - Bank account details (standard Raftaar account)

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

2. **Invoice Title:** "Advance Payment Invoice"

3. **Parties Section:**
   - Invoice To (Client details)
   - Invoice From (Raftaar details)

4. **Invoice Details:**
   - Invoice number, date, PO reference, payment date

5. **Project Title:** Clear project name

6. **Items Table:**
   - Description: "Advance payment (X% of PO value)"
   - Amount in INR
   - Note showing total PO value

7. **Payment Terms:**
   - Explanation of advance vs final payment structure

8. **Bank Details Section:**
   - Formatted table with account information

9. **Notes:**
   - Payment receipt reference if applicable
   - Any additional context

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

## Example Usage

**Input:**
- Client: BETTROI FZE, Dubai
- Project: NeuroSense360 MVP - AML Compliance Platform
- Total PO Value: ₹275,000
- Advance Percentage: 40%
- Invoice Date: 19 Nov 2025
- PO Reference: PUR-ORD-2025-00013

**Output:**
Professional HTML invoice showing:
- Advance Amount: ₹110,000
- Total PO Value: ₹275,000
- Payment terms: "40% as advance; balance payable upon production deployment and acceptance"

## File Naming Convention
Format: `Invoice_[ProjectName]_[Percentage]Percent_Advance.html`
Example: `Invoice_NeuroSense_40Percent_Advance.html`

## Notes for AI Generation

1. **Always ask for:**
   - Client name and address
   - Project name
   - Total PO value
   - Advance percentage
   - Invoice date
   - PO reference number

2. **Auto-calculate:**
   - Advance amount from percentage and total value
   - Invoice number from date (DDMMYY-N format)

3. **Include in notes:**
   - Payment receipt reference if provided
   - Mention if part of composite payment

4. **Maintain consistency:**
   - Use exact bank details as shown above
   - Keep Raftaar branding colors and styling
   - Use standard footer contact information

## Related Skills
- `generate-final-invoice.md` - For final payment invoices
- `generate-full-invoice.md` - For 100% payment invoices
- `generate-proposal.md` - For project proposals

## Version History
- v1.0.0 (2025-12-26): Initial skill creation based on NeuroSense and Linkist invoices
