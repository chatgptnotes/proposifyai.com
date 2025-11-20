/**
 * UAE AML Compliance Validators
 *
 * Validation functions for UAE business compliance requirements:
 * - Tax Registration Number (TRN) - 15 digits
 * - IBAN - UAE format (AE + 21 digits)
 * - Trade License Numbers
 * - Transaction value thresholds for CDD/EDD
 *
 * @module lib/compliance/validators
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  formatted?: string;
}

/**
 * Validates UAE Tax Registration Number (TRN)
 * Format: 15 digits (e.g., 100123456789012)
 *
 * @param trn - The TRN string to validate
 * @returns ValidationResult with validity status and error message if invalid
 *
 * @example
 * validateTRN("100123456789012") // { valid: true, formatted: "100123456789012" }
 * validateTRN("12345") // { valid: false, error: "TRN must be exactly 15 digits" }
 */
export function validateTRN(trn: string | null | undefined): ValidationResult {
  if (!trn) {
    return { valid: false, error: "TRN is required" };
  }

  // Remove spaces and dashes
  const cleaned = trn.replace(/[\s-]/g, '');

  // Check if it's exactly 15 digits
  if (!/^\d{15}$/.test(cleaned)) {
    return {
      valid: false,
      error: "TRN must be exactly 15 digits"
    };
  }

  // UAE TRN typically starts with 1, 2, or 3
  const firstDigit = cleaned.charAt(0);
  if (!['1', '2', '3'].includes(firstDigit)) {
    return {
      valid: false,
      error: "UAE TRN typically starts with 1, 2, or 3"
    };
  }

  return {
    valid: true,
    formatted: cleaned
  };
}

/**
 * Validates UAE IBAN (International Bank Account Number)
 * Format: AE + 2 check digits + 19 digits = 23 characters total
 *
 * @param iban - The IBAN string to validate
 * @returns ValidationResult with validity status and formatted IBAN
 *
 * @example
 * validateIBAN("AE070331234567890123456") // { valid: true, formatted: "AE07 0331 2345 6789 0123 456" }
 * validateIBAN("US1234567890") // { valid: false, error: "IBAN must start with 'AE' for UAE accounts" }
 */
export function validateIBAN(iban: string | null | undefined): ValidationResult {
  if (!iban) {
    return { valid: false, error: "IBAN is required" };
  }

  // Remove spaces and convert to uppercase
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  // Check if it starts with AE (UAE)
  if (!cleaned.startsWith('AE')) {
    return {
      valid: false,
      error: "IBAN must start with 'AE' for UAE accounts"
    };
  }

  // Check if it's exactly 23 characters (AE + 21 digits)
  if (cleaned.length !== 23) {
    return {
      valid: false,
      error: "UAE IBAN must be exactly 23 characters (AE + 21 digits)"
    };
  }

  // Check if the remaining characters are digits
  const digits = cleaned.substring(2);
  if (!/^\d{21}$/.test(digits)) {
    return {
      valid: false,
      error: "IBAN must contain only digits after 'AE'"
    };
  }

  // Format IBAN in groups of 4
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;

  // Basic IBAN checksum validation (mod-97 algorithm)
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
  const numericString = rearranged.replace(/[A-Z]/g, (char) =>
    (char.charCodeAt(0) - 55).toString()
  );

  // For very long numbers, we need to do mod 97 in chunks
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }

  if (remainder !== 1) {
    return {
      valid: false,
      error: "IBAN checksum validation failed. Please verify the account number."
    };
  }

  return {
    valid: true,
    formatted: formatted
  };
}

/**
 * Validates UAE Trade License Number
 * Format varies by emirate, but typically alphanumeric
 *
 * @param license - The trade license number to validate
 * @returns ValidationResult with validity status
 *
 * @example
 * validateTradeLicense("CN-1234567") // { valid: true, formatted: "CN-1234567" }
 * validateTradeLicense("") // { valid: false, error: "Trade License is required" }
 */
export function validateTradeLicense(license: string | null | undefined): ValidationResult {
  if (!license) {
    return { valid: false, error: "Trade License is required" };
  }

  // Remove extra spaces
  const cleaned = license.trim();

  // Must be at least 5 characters
  if (cleaned.length < 5) {
    return {
      valid: false,
      error: "Trade License must be at least 5 characters"
    };
  }

  // Must contain at least one digit
  if (!/\d/.test(cleaned)) {
    return {
      valid: false,
      error: "Trade License must contain at least one digit"
    };
  }

  // Should be alphanumeric with optional dashes and slashes
  if (!/^[A-Z0-9\-\/]+$/i.test(cleaned)) {
    return {
      valid: false,
      error: "Trade License should contain only letters, numbers, dashes, and slashes"
    };
  }

  return {
    valid: true,
    formatted: cleaned.toUpperCase()
  };
}

/**
 * Validates SWIFT/BIC code
 * Format: 8 or 11 characters (AAAA-BB-CC-DDD)
 *
 * @param swift - The SWIFT/BIC code to validate
 * @returns ValidationResult with validity status
 *
 * @example
 * validateSWIFT("EBILAEAD") // { valid: true, formatted: "EBILAEAD" }
 * validateSWIFT("EBILAEAD123") // { valid: true, formatted: "EBILAEAD123" }
 */
export function validateSWIFT(swift: string | null | undefined): ValidationResult {
  if (!swift) {
    return { valid: false, error: "SWIFT code is required" };
  }

  const cleaned = swift.replace(/[\s-]/g, '').toUpperCase();

  // Must be 8 or 11 characters
  if (cleaned.length !== 8 && cleaned.length !== 11) {
    return {
      valid: false,
      error: "SWIFT code must be 8 or 11 characters"
    };
  }

  // Format: AAAABBCCDDD
  // AAAA = Bank code (letters)
  // BB = Country code (letters)
  // CC = Location code (letters or digits)
  // DDD = Branch code (optional, letters or digits)
  const pattern = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

  if (!pattern.test(cleaned)) {
    return {
      valid: false,
      error: "Invalid SWIFT code format"
    };
  }

  return {
    valid: true,
    formatted: cleaned
  };
}

/**
 * Checks if Customer Due Diligence (CDD) is required
 * CDD is required for transactions exceeding AED 55,000
 *
 * @param amountAED - Transaction amount in AED
 * @returns boolean indicating if CDD is required
 */
export function requiresCDD(amountAED: number): boolean {
  return amountAED >= 55000;
}

/**
 * Checks if Enhanced Due Diligence (EDD) is required
 * EDD is required for transactions exceeding AED 100,000
 *
 * @param amountAED - Transaction amount in AED
 * @returns boolean indicating if EDD is required
 */
export function requiresEDD(amountAED: number): boolean {
  return amountAED >= 100000;
}

/**
 * Checks if import documentation attestation is required
 * Required for imports exceeding AED 10,000
 *
 * @param amountAED - Transaction amount in AED
 * @returns boolean indicating if MoFAIC attestation is required
 */
export function requiresMoFAICAttestation(amountAED: number): boolean {
  return amountAED >= 10000;
}

/**
 * Calculates the document retention date (5 years from transaction date)
 *
 * @param transactionDate - Date of the transaction
 * @returns Date object 5 years in the future
 */
export function calculateRetentionDate(transactionDate: Date = new Date()): Date {
  const retentionDate = new Date(transactionDate);
  retentionDate.setFullYear(retentionDate.getFullYear() + 5);
  return retentionDate;
}

/**
 * Converts amount to AED based on currency
 * Uses approximate exchange rates (should be replaced with live rates in production)
 *
 * @param amount - Transaction amount
 * @param currency - Currency code (USD, AED, EUR, etc.)
 * @returns Amount in AED
 */
export function convertToAED(amount: number, currency: string): number {
  const exchangeRates: { [key: string]: number } = {
    'AED': 1,
    'USD': 3.67,
    'EUR': 4.00,
    'GBP': 4.65,
    'SAR': 0.98,
    'INR': 0.044,
  };

  const rate = exchangeRates[currency.toUpperCase()] || 3.67; // Default to USD rate
  return amount * rate;
}

/**
 * Validates all compliance fields at once
 *
 * @param data - Object containing TRN, IBAN, Trade License, etc.
 * @returns Object with validation results for each field
 */
export interface ComplianceData {
  trn?: string;
  iban?: string;
  tradeLicense?: string;
  swift?: string;
}

export interface ComplianceValidationResult {
  valid: boolean;
  errors: string[];
  results: {
    trn?: ValidationResult;
    iban?: ValidationResult;
    tradeLicense?: ValidationResult;
    swift?: ValidationResult;
  };
}

export function validateCompliance(data: ComplianceData): ComplianceValidationResult {
  const results: ComplianceValidationResult = {
    valid: true,
    errors: [],
    results: {}
  };

  if (data.trn) {
    results.results.trn = validateTRN(data.trn);
    if (!results.results.trn.valid) {
      results.valid = false;
      results.errors.push(`TRN: ${results.results.trn.error}`);
    }
  }

  if (data.iban) {
    results.results.iban = validateIBAN(data.iban);
    if (!results.results.iban.valid) {
      results.valid = false;
      results.errors.push(`IBAN: ${results.results.iban.error}`);
    }
  }

  if (data.tradeLicense) {
    results.results.tradeLicense = validateTradeLicense(data.tradeLicense);
    if (!results.results.tradeLicense.valid) {
      results.valid = false;
      results.errors.push(`Trade License: ${results.results.tradeLicense.error}`);
    }
  }

  if (data.swift) {
    results.results.swift = validateSWIFT(data.swift);
    if (!results.results.swift.valid) {
      results.valid = false;
      results.errors.push(`SWIFT: ${results.results.swift.error}`);
    }
  }

  return results;
}

/**
 * Formats TRN for display (adds spacing)
 * Example: "100123456789012" => "100 1234 5678 9012"
 */
export function formatTRN(trn: string): string {
  const cleaned = trn.replace(/[\s-]/g, '');
  return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
}

/**
 * Formats IBAN for display (groups of 4)
 * Example: "AE070331234567890123456" => "AE07 0331 2345 6789 0123 456"
 */
export function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
}
