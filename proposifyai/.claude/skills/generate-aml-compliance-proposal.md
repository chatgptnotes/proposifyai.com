# Generate AML Compliance Proposal

Generate professional AML (Anti-Money Laundering) compliant proposals for regulated industries including financial services, healthcare, and government contracts.

## Context & Purpose

**When to use:** Create proposals that meet strict compliance requirements for regulated industries, government tenders, and enterprise clients with legal/audit requirements.

**Target clients:**
- Financial institutions
- Healthcare organizations
- Government agencies
- Large enterprises
- Regulated industries

**Compliance requirements:**
- Full legal entity information
- Tax registration numbers
- Formal document structure
- Detailed payment terms
- Legal disclaimers
- Audit trail requirements

## Key Differences from Standard Proposals

### Legal Header Requirements
**Supplier Details (Your Company):**
- Full legal entity name
- Trade License number
- TRN (Tax Registration Number)
- Complete registered address
- Contact details (phone, email, website)

**Document Classification:**
- Document type: "TAX INVOICE / QUOTATION"
- Reference number
- Quotation number
- Date of issue
- Validity period

**Client Details (Bill To):**
- Full legal entity name
- Trade License number (or "To Be Provided")
- TRN number (or "To Be Provided")
- Registered address
- Contact person details

### AML-Specific Sections

**1. Legal Header Template**
```html
<div class="legal-header">
  <div class="supplier-details">
    <div class="company-name">[COMPANY NAME]</div>
    <div class="legal-info">
      <p><b>Trade License:</b> [LICENSE NUMBER]</p>
      <p><b>TRN:</b> [TAX REGISTRATION NUMBER]</p>
      <p><b>Address:</b> [FULL REGISTERED ADDRESS]</p>
      <p><b>Tel:</b> [PHONE] | <b>Email:</b> [EMAIL]</p>
      <p><b>Website:</b> [WEBSITE]</p>
    </div>
  </div>
  <div class="document-info">
    <h2 class="document-type">TAX INVOICE / QUOTATION</h2>
    <div class="ref-details">
      <p><b>Reference:</b> [REF NUMBER]</p>
      <p><b>Quotation No:</b> [QUOTE NUMBER]</p>
      <p><b>Date:</b> [DATE]</p>
      <p><b>Valid Until:</b> [VALIDITY DATE]</p>
    </div>
  </div>
</div>
```

**2. Bill To Section**
```html
<div class="bill-to-section">
  <h2>BILL TO</h2>
  <div class="client-legal-box">
    <p class="client-name">[CLIENT LEGAL NAME]</p>
    <p><b>Trade License:</b> [NUMBER or "To Be Provided"]</p>
    <p><b>TRN:</b> [NUMBER or "To Be Provided"]</p>
    <p><b>Address:</b> [REGISTERED ADDRESS]</p>
    <p><b>Contact Person:</b> [NAME & TITLE]</p>
    <p><b>Email:</b> [EMAIL]</p>
    <p><b>Phone:</b> [PHONE]</p>
  </div>
</div>
```

**3. Investment Summary with Tax Information**
```html
<div class="investment-summary">
  <h3>Investment Summary</h3>
  <table class="pricing-table">
    <tr>
      <td>Subtotal (Pre-VAT)</td>
      <td style="text-align: right;">AED [AMOUNT]</td>
    </tr>
    <tr>
      <td>VAT (5%)</td>
      <td style="text-align: right;">AED [VAT AMOUNT]</td>
    </tr>
    <tr class="total-row">
      <td><b>Total Amount (Incl. VAT)</b></td>
      <td style="text-align: right;"><b>AED [TOTAL]</b></td>
    </tr>
  </table>
</div>
```

**4. Payment Terms Section**
```html
<div class="payment-terms-box">
  <h3>Payment Terms & Conditions</h3>
  <ul>
    <li>All prices quoted in [CURRENCY]</li>
    <li>VAT @ 5% applicable as per UAE tax laws</li>
    <li>Payment schedule: [DETAILED SCHEDULE]</li>
    <li>Bank transfer to account details below</li>
    <li>Late payment subject to [X]% interest per month</li>
    <li>Proposal valid for [X] days from date of issue</li>
  </ul>
</div>
```

**5. Bank Details Box**
```html
<div class="bank-details-box">
  <h3>Bank Transfer Details</h3>
  <table>
    <tr>
      <td><b>Account Name:</b></td>
      <td>[LEGAL ENTITY NAME]</td>
    </tr>
    <tr>
      <td><b>Bank Name:</b></td>
      <td>[BANK NAME]</td>
    </tr>
    <tr>
      <td><b>Account Number:</b></td>
      <td>[ACCOUNT NUMBER]</td>
    </tr>
    <tr>
      <td><b>IBAN:</b></td>
      <td>[IBAN NUMBER]</td>
    </tr>
    <tr>
      <td><b>SWIFT Code:</b></td>
      <td>[SWIFT CODE]</td>
    </tr>
    <tr>
      <td><b>Branch:</b></td>
      <td>[BRANCH NAME & ADDRESS]</td>
    </tr>
  </table>
</div>
```

**6. Compliance & Legal Notes**
```html
<div class="compliance-box">
  <h3>Compliance & Regulatory Information</h3>
  <ul>
    <li>This quotation complies with UAE VAT regulations</li>
    <li>All work performed under relevant industry standards</li>
    <li>Data handling complies with GDPR and local data protection laws</li>
    <li>AML/CFT policies in accordance with UAE regulations</li>
  </ul>
</div>

<div class="important-note">
  <h3>Important Notes</h3>
  <p>This quotation remains valid for [X] days from the date of issue.
  Prices are subject to change after the validity period. Payment terms
  and delivery schedules are binding upon acceptance of this quotation.</p>
</div>
```

**7. Terms & Conditions**
- Scope of work clearly defined
- Intellectual property rights
- Confidentiality obligations
- Limitation of liability
- Dispute resolution
- Governing law (e.g., UAE law)

**8. Acceptance Section**
```html
<div class="acceptance-section">
  <h2>Proposal Acceptance</h2>
  <p>By signing below, the Client accepts the terms and conditions
  of this proposal and authorizes [COMPANY] to proceed with the project.</p>

  <div class="signature-boxes">
    <div class="signature-box">
      <p><b>Client Signature:</b></p>
      <p>_______________________</p>
      <p>Name: _______________</p>
      <p>Title: _______________</p>
      <p>Date: _______________</p>
    </div>

    <div class="signature-box">
      <p><b>Supplier Signature:</b></p>
      <p>_______________________</p>
      <p>Name: Dr. Murali BK</p>
      <p>Title: Authorized Signatory</p>
      <p>Date: [DATE]</p>
    </div>
  </div>
</div>
```

## Design Specifications for AML Proposals

### Professional Color Scheme
- Primary: #003DA5 (professional blue)
- Secondary: #0051D5 (lighter blue)
- Backgrounds: #FAFAFA, #F0F4FF
- Borders: #E0E0E0
- Alert boxes: #FFF3CD (yellow), #FFE5E5 (red)

### Typography
- Professional fonts: Segoe UI, Arial
- Clear hierarchy with consistent sizing
- Legal text: Minimum 10px for readability
- Headers: Bold, colored in primary blue

### Layout Requirements
- Clean, formal structure
- Consistent margins and padding
- Clear section separations
- Page breaks for printing
- Footer with page numbers

## Essential Information Checklist

### Before Creating AML Proposal
- [ ] Client's legal entity name
- [ ] Client's Trade License number
- [ ] Client's TRN number
- [ ] Client's registered address
- [ ] Your company's legal details
- [ ] Your company's Trade License
- [ ] Your company's TRN
- [ ] Bank account details (IBAN, SWIFT)
- [ ] VAT registration status
- [ ] Proposal validity period
- [ ] Payment terms structure
- [ ] Currency (AED, USD, etc.)

## VAT Calculations

### Standard UAE VAT (5%)
```
Subtotal: [AMOUNT]
VAT @ 5%: [AMOUNT × 0.05]
Total: [AMOUNT × 1.05]
```

### Zero-rated supplies
Some services may be VAT zero-rated:
- Certain healthcare services
- Educational services
- International services

**Always confirm VAT status with client's tax advisor**

## Payment Terms Templates

### Government Contracts
```
Payment Terms:
- 30% upon Purchase Order issuance
- 40% upon completion of Phase 1 (as defined in Scope)
- 30% upon final delivery and acceptance
- Payment within 30 days of invoice date
- All payments subject to retention of 10% held for 90 days post-delivery
```

### Corporate Clients
```
Payment Terms:
- 40% advance payment upon contract signing
- 30% upon UAT completion
- 30% upon Go-Live and acceptance
- Payment due within 15 days of invoice
- Late payment interest: 2% per month
```

### Healthcare/Regulated
```
Payment Terms:
- 25% upon regulatory approval and contract signing
- 50% upon milestone completion (detailed schedule attached)
- 25% upon final acceptance and regulatory compliance verification
- Payment via bank transfer only
- Retention: 5% held for 60 days post-delivery
```

## Risk & Compliance Sections

### Data Protection & Privacy
```
All personal data and sensitive information will be handled in accordance with:
- GDPR (General Data Protection Regulation)
- UAE Data Protection Law
- Industry-specific regulations (HIPAA, PCI-DSS, etc.)

Data handling measures include:
- Encryption at rest and in transit
- Access control and audit logging
- Regular security assessments
- Data retention policies
- Incident response procedures
```

### AML/CFT Compliance
```
[COMPANY] maintains robust AML (Anti-Money Laundering) and CFT
(Combating the Financing of Terrorism) policies including:
- Customer due diligence procedures
- Enhanced due diligence for high-risk clients
- Ongoing transaction monitoring
- Suspicious activity reporting
- Record retention for regulatory requirements
```

## File Naming Convention
Format: `[ClientName]_[ProjectName]_Proposal_AML_Compliant.html`
Example: `NeuroSense360_Bettroi_Proposal_AML_Compliant.html`

## Notes for AI Generation

1. **Always include:**
   - Full legal entity information for both parties
   - Tax registration numbers
   - VAT calculations where applicable
   - Detailed payment terms
   - Bank transfer details
   - Compliance statements
   - Formal acceptance section

2. **Currency considerations:**
   - Use client's preferred currency
   - Show exchange rate if converting
   - Specify currency risk allocation
   - VAT treatment for international services

3. **Regulatory variations:**
   - UAE: TRN, VAT @ 5%
   - India: GST @ 18%, PAN number
   - US: Tax ID, no federal VAT
   - EU: VAT ID, variable VAT rates

4. **Documentation trail:**
   - Every proposal should have unique reference number
   - Link to PO/RFP number if applicable
   - Version control for revisions
   - Digital signature capability

5. **Professional review:**
   - Have legal team review terms
   - Verify tax treatment with accountant
   - Confirm compliance requirements
   - Get approval for pricing and terms

## Example: Bettroi Legal Details

```
Company: BETTROI - FZE
Trade License: 3891
TRN: 104277403200003
Address: Building A5, FLEXDESK DSO-DDP-A5-D-FLEX-1044,
         Dubai Silicon Oasis, Dubai, United Arab Emirates
Tel: +971 54 714 8580
Email: bt.thomas@bettroi.com
Website: bettroi.com
```

## Related Skills
- `generate-proposal.md` - General proposal structure
- `generate-ai-ml-proposal.md` - AI/ML projects
- `generate-advance-invoice.md` - AML-compliant invoicing

## Version History
- v1.0.0 (2025-12-26): Initial skill creation based on NeuroSense360 AML-compliant proposal
