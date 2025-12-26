# Generate Final Payment Invoice

Generate professional final payment invoices (typically 60% balance after completion) from Raftaar Help Emergency Seva to clients, following the established invoice format and branding.

## Context & Purpose

**When to use:** Create final/balance payment invoices for projects where an advance was already paid and the project is now complete.

**Key characteristics:**
- Shows final payment amount (balance of total PO value)
- References original advance payment invoice
- Includes payment summary showing advance + final = total
- Confirms project completion and acceptance
- Professional Raftaar branding with red gradient header

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
   - PO Reference Number (same as advance invoice)
   - Payment Date (if already paid)

3. **Project Information:**
   - Project Name/Title
   - Total PO Value
   - Advance Payment Amount (from previous invoice)
   - Advance Invoice Number
   - Final Payment Percentage (typically 60%)
   - Final Payment Amount

4. **Payment Summary:**
   - Advance paid
   - Final payment
   - Total amount paid

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

2. **Invoice Title:** "Final Payment Invoice"

3. **Parties Section:**
   - Invoice To (Client details)
   - Invoice From (Raftaar details)

4. **Invoice Details:**
   - Invoice number, date, PO reference, payment date

5. **Project Title:** Clear project name

6. **Items Table:**
   - Description: "Final payment (X% of PO value upon deployment and acceptance)"
   - Amount in INR
   - Note showing total PO value

7. **Payment Summary Box:**
   - Green-themed box (#f0fff4 background)
   - Shows:
     - Advance Payment (X%)
     - Final Payment (Y%)
     - Total Amount Paid (with bold separator)

8. **Payment Terms:**
   - Reference to advance invoice number
   - Confirmation of deployment and acceptance
   - Explanation of payment structure

9. **Bank Details Section:**
   - Formatted table with account information

10. **Notes:**
    - Payment receipt reference if applicable
    - Project completion confirmation
    - Any additional context

11. **Signature Section:**
    - "Best Regards,"
    - Dr. Murali BK
    - Raftaar Help Emergency Seva

12. **Footer:**
    - @raftaar contact information
    - Email: cmd@hopehospital.com
    - Website: www.drmhope.com
    - Phone: +91 9373111709

## Design Specifications

### Colors
- Primary Red: #e53e3e
- Dark Red: #c53030
- Success Green: #2f855a, #48bb78
- Light Green Background: #f0fff4
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

### Payment Summary Styling
```css
.payment-summary {
    background: #f0fff4;
    border-left: 4px solid #48bb78;
    padding: 20px;
    border-radius: 8px;
}
```

## Example Usage

**Input:**
- Client: BETTROI FZE, Dubai
- Project: Linkist NFC eCom Web Platform
- Total PO Value: ₹200,000
- Advance Paid: ₹80,000 (40%) - Invoice No. 1992025-1
- Final Payment: ₹120,000 (60%)
- Invoice Date: 19 Nov 2025
- PO Reference: PUR-ORD-2025-00012
- Project Status: Deployed and Accepted

**Output:**
Professional HTML invoice showing:
- Final Payment Amount: ₹120,000
- Payment Summary with advance + final
- Confirmation of project completion

## File Naming Convention
Format: `Invoice_[ProjectName]_[Percentage]Percent_Final.html`
Example: `Invoice_Linkist_60Percent_Final.html`

## Notes for AI Generation

1. **Always ask for:**
   - Client name and address
   - Project name
   - Total PO value
   - Advance payment details (amount, invoice number)
   - Final payment percentage
   - Invoice date
   - PO reference number
   - Project completion status

2. **Auto-calculate:**
   - Final payment amount from total - advance
   - Invoice number from date (DDMMYY-N format)
   - Payment percentages if not provided

3. **Include in notes:**
   - Payment receipt reference if provided
   - Project completion and acceptance confirmation
   - Mention if part of composite payment

4. **Payment Summary Requirements:**
   - Always show advance payment first
   - Then final payment
   - Total with visual separator (border-top)
   - Use green color scheme for completed payments

5. **Maintain consistency:**
   - Use exact bank details as shown above
   - Keep Raftaar branding colors and styling
   - Use standard footer contact information
   - Reference original advance invoice number

## Payment Terms Language

Standard template:
```
"[X]% paid as advance (Invoice No. [INVOICE-NO]); [Y]% payable upon production
deployment and acceptance. Project successfully deployed and accepted."
```

## Related Skills
- `generate-advance-invoice.md` - For advance payment invoices
- `generate-full-invoice.md` - For 100% payment invoices
- `generate-proposal.md` - For project proposals

## Version History
- v1.0.0 (2025-12-26): Initial skill creation based on Linkist final payment invoice
