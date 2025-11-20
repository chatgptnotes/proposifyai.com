/**
 * Bettroi FZE - Official Compliance Configuration
 *
 * Default values for all AML compliance fields.
 * These values are pre-populated in forms and used for proposal generation.
 *
 * ⚠️ IMPORTANT: These are the official legal details for Bettroi FZE.
 * Any changes must be verified against official documents.
 *
 * @module lib/compliance/bettroi-config
 */

export interface BettroiComplianceConfig {
  // Legal Entity Information
  legalName: string;
  tradeLicense: string;
  trn: string;
  registeredAddress: string;
  businessActivity: string;
  freeZoneAuthority: string;

  // Bank Account Information
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  currency: string;

  // Contact Information
  phone: string;
  email: string;
  website: string;

  // VAT Configuration
  vatRate: number;
  vatRegistered: boolean;

  // Default Payment Terms
  paymentTerms: string;
}

/**
 * Official Bettroi FZE Compliance Configuration
 * Source: Trade License 3891, TRN Certificate, Wio Bank Account Confirmation
 * Last Updated: 2025-11-20
 */
export const BETTROI_CONFIG: BettroiComplianceConfig = {
  // ========================================
  // LEGAL ENTITY INFORMATION
  // ========================================
  legalName: 'BETTROI - FZE',
  tradeLicense: '3891',
  trn: '104277403200003', // 15-digit UAE Tax Registration Number
  registeredAddress: 'Building A5, FLEXDESK DSO-DDP-A5-D-FLEX-1044, Dubai Silicon Oasis, Dubai, United Arab Emirates',
  businessActivity: 'Software Development and IT Consulting Services',
  freeZoneAuthority: 'DSO (Dubai Silicon Oasis)',

  // ========================================
  // BANK ACCOUNT INFORMATION (WIO BANK)
  // ========================================
  bankName: 'Wio Bank',
  bankBranch: 'Etihad Airways Centre 5th Floor, Abu Dhabi, UAE',
  accountName: 'BETTROI - FZE',
  accountNumber: '9124215965',
  iban: 'AE410860000009124215965', // Valid UAE IBAN (23 characters)
  swift: 'WIOBAEADXXX', // 11-character SWIFT/BIC code
  currency: 'AED',

  // ========================================
  // CONTACT INFORMATION
  // ========================================
  phone: '+971 54 714 8580',
  email: 'bt.thomas@bettroi.com',
  website: 'bettroi.com',

  // ========================================
  // VAT CONFIGURATION
  // ========================================
  vatRate: 5, // UAE standard VAT rate: 5%
  vatRegistered: true,

  // ========================================
  // DEFAULT PAYMENT TERMS
  // ========================================
  paymentTerms: `Payment Terms: 40% advance upon order confirmation, 60% upon project completion and delivery.

Payment must be made via bank transfer to the account details provided. All payments must include the invoice reference number in the payment description.

For international transfers, ensure all bank charges are covered by sender (OUR charge option). Payment confirmation receipt must be emailed to bt.thomas@bettroi.com within 24 hours of transfer.

Late payments will incur a charge of 2% per month (24% per annum). Work may be suspended on accounts overdue by more than 15 days.`
};

/**
 * Format Bettroi details for proposal template placeholders
 */
export function getBettroiTemplatePlaceholders() {
  return {
    // Supplier/Company Details
    SUPPLIER_LEGAL_NAME: BETTROI_CONFIG.legalName,
    SUPPLIER_TRADE_LICENSE: BETTROI_CONFIG.tradeLicense,
    SUPPLIER_TRN: BETTROI_CONFIG.trn,
    SUPPLIER_FULL_ADDRESS: BETTROI_CONFIG.registeredAddress,
    SUPPLIER_PHONE: BETTROI_CONFIG.phone,
    SUPPLIER_EMAIL: BETTROI_CONFIG.email,
    SUPPLIER_WEBSITE: BETTROI_CONFIG.website,

    // Bank Details
    BANK_NAME: BETTROI_CONFIG.bankName,
    BANK_BRANCH: BETTROI_CONFIG.bankBranch,
    BANK_ACCOUNT_NAME: BETTROI_CONFIG.accountName,
    BANK_ACCOUNT_NUMBER: BETTROI_CONFIG.accountNumber,
    BANK_IBAN: formatIBAN(BETTROI_CONFIG.iban),
    BANK_SWIFT: BETTROI_CONFIG.swift,

    // VAT Configuration
    VAT_RATE: BETTROI_CONFIG.vatRate.toString(),
    CURRENCY: 'USD', // Default, can be overridden per proposal

    // Payment Terms
    PAYMENT_TERMS: BETTROI_CONFIG.paymentTerms,

    // Document Type
    DOCUMENT_TYPE: 'TAX INVOICE / QUOTATION',
  };
}

/**
 * Format IBAN for display (groups of 4)
 * Example: "AE410860000009124215965" => "AE41 0860 0000 0912 4215 965"
 */
function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '');
  return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
}

/**
 * Format TRN for display (groups of 4)
 * Example: "104277403200003" => "1042 7740 3200 003"
 */
export function formatTRN(trn: string): string {
  const cleaned = trn.replace(/\s/g, '');
  return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
}

/**
 * Get AML compliance disclaimer text
 */
export function getAMLDisclaimerText(): string {
  return `This commercial transaction is conducted in accordance with UAE Federal Decree-Law No. 20 of 2018 on Anti-Money Laundering and Combating the Financing of Terrorism. ${BETTROI_CONFIG.legalName} (TRN: ${BETTROI_CONFIG.trn}, Trade License: ${BETTROI_CONFIG.tradeLicense}) is a UAE-registered entity complying with all AML regulations. All transaction records will be retained for 5 years as required by law.`;
}

/**
 * Get tax compliance footer text
 */
export function getTaxComplianceFooter(): string {
  return `${BETTROI_CONFIG.legalName} | TRN: ${formatTRN(BETTROI_CONFIG.trn)} | Trade License: ${BETTROI_CONFIG.tradeLicense} | Registered in Dubai Silicon Oasis, UAE`;
}

/**
 * Validate if all required compliance fields are present
 */
export function validateBettroiConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!BETTROI_CONFIG.trn || BETTROI_CONFIG.trn.length !== 15) {
    missing.push('TRN (must be 15 digits)');
  }

  if (!BETTROI_CONFIG.tradeLicense) {
    missing.push('Trade License');
  }

  if (!BETTROI_CONFIG.iban || !BETTROI_CONFIG.iban.startsWith('AE')) {
    missing.push('Valid UAE IBAN');
  }

  if (!BETTROI_CONFIG.swift) {
    missing.push('SWIFT/BIC code');
  }

  if (!BETTROI_CONFIG.registeredAddress) {
    missing.push('Registered Address');
  }

  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Export for use in components
 */
export default BETTROI_CONFIG;
