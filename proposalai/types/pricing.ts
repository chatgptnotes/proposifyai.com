// Pricing Table Types for Proposify AI

export interface PricingLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number; // Percentage (0-100)
  discountAmount?: number; // Fixed amount
  tax?: number; // Percentage (0-100)
  isOptional?: boolean;
  category?: string;
  notes?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  description?: string;
  items: PricingLineItem[];
  subtotal: number;
  total: number;
  isRecommended?: boolean;
}

export interface PricingTable {
  id: string;
  proposalId?: string;
  currency: string;
  tiers?: PricingTier[]; // For multi-tier pricing
  lineItems: PricingLineItem[];

  // Calculations
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;

  // Settings
  showTax: boolean;
  showDiscount: boolean;
  taxRate?: number; // Global tax rate
  discountRate?: number; // Global discount rate
  discountType?: 'percentage' | 'fixed';

  // Display options
  displayMode: 'simple' | 'tiered' | 'detailed';
  showOptionalItems: boolean;
  groupByCategory: boolean;

  // Payment terms
  paymentTerms?: string;
  depositRequired?: number; // Percentage or fixed amount
  depositType?: 'percentage' | 'fixed';

  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingCalculation {
  lineItemTotal: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}

// Helper function to calculate line item total
export function calculateLineItemTotal(item: PricingLineItem): number {
  let total = item.quantity * item.unitPrice;

  // Apply discount
  if (item.discount) {
    total -= (total * item.discount) / 100;
  }
  if (item.discountAmount) {
    total -= item.discountAmount;
  }

  // Apply tax
  if (item.tax) {
    total += (total * item.tax) / 100;
  }

  return Math.max(0, total); // Ensure non-negative
}

// Helper function to calculate pricing table totals
export function calculatePricingTable(table: Omit<PricingTable, 'subtotal' | 'discountTotal' | 'taxTotal' | 'total'>): PricingCalculation {
  let subtotal = 0;
  let discountAmount = 0;
  let taxAmount = 0;

  // Calculate subtotal from line items
  table.lineItems.forEach(item => {
    if (!item.isOptional || table.showOptionalItems) {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;

      // Calculate item-level discount
      if (item.discount) {
        discountAmount += (itemSubtotal * item.discount) / 100;
      }
      if (item.discountAmount) {
        discountAmount += item.discountAmount;
      }
    }
  });

  // Apply global discount
  if (table.discountRate) {
    if (table.discountType === 'percentage') {
      discountAmount += (subtotal * table.discountRate) / 100;
    } else {
      discountAmount += table.discountRate;
    }
  }

  const afterDiscount = subtotal - discountAmount;

  // Calculate tax
  table.lineItems.forEach(item => {
    if (!item.isOptional || table.showOptionalItems) {
      const itemTotal = calculateLineItemTotal(item);
      if (item.tax) {
        const itemSubtotal = item.quantity * item.unitPrice;
        taxAmount += (itemSubtotal * item.tax) / 100;
      }
    }
  });

  // Apply global tax
  if (table.taxRate && table.showTax) {
    taxAmount += (afterDiscount * table.taxRate) / 100;
  }

  const total = afterDiscount + taxAmount;

  return {
    lineItemTotal: subtotal,
    subtotal,
    discountAmount,
    taxAmount,
    total: Math.max(0, total),
  };
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Generate unique ID
export function generateLineItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
