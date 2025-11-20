/**
 * VAT Calculation API Endpoint
 *
 * Calculates UAE VAT (5%) on transaction amounts
 * Complies with Federal Decree-Law No. 8 of 2017 on VAT
 *
 * @route POST /api/compliance/calculate-vat
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface VATCalculationRequest {
  subtotal: number;
  vatRate?: number; // Optional, defaults to 5% for UAE
  currency?: string; // Optional, defaults to USD
}

interface VATCalculationResponse {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalWithVAT: number;
  currency: string;
  breakdown: {
    subtotalFormatted: string;
    vatAmountFormatted: string;
    totalFormatted: string;
  };
}

/**
 * POST /api/compliance/calculate-vat
 *
 * Calculates VAT on a given subtotal amount
 *
 * @param request - Request body containing subtotal and optional vatRate
 * @returns VAT calculation with breakdown
 *
 * @example
 * POST /api/compliance/calculate-vat
 * Body: { "subtotal": 10000, "vatRate": 5 }
 * Response: {
 *   "subtotal": 10000,
 *   "vatRate": 5,
 *   "vatAmount": 500,
 *   "totalWithVAT": 10500,
 *   "currency": "USD",
 *   "breakdown": {
 *     "subtotalFormatted": "$10,000.00",
 *     "vatAmountFormatted": "$500.00",
 *     "totalFormatted": "$10,500.00"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: VATCalculationRequest = await request.json();

    const { subtotal, vatRate = 5, currency = 'USD' } = body;

    // Validation
    if (typeof subtotal !== 'number' || subtotal < 0) {
      return NextResponse.json(
        { error: 'Invalid subtotal. Must be a positive number.' },
        { status: 400 }
      );
    }

    if (typeof vatRate !== 'number' || vatRate < 0 || vatRate > 100) {
      return NextResponse.json(
        { error: 'Invalid VAT rate. Must be between 0 and 100.' },
        { status: 400 }
      );
    }

    // Calculate VAT
    const vatAmount = Math.round((subtotal * vatRate / 100) * 100) / 100; // Round to 2 decimal places
    const totalWithVAT = subtotal + vatAmount;

    // Format currency
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'AED': 'AED ',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
    };

    const symbol = currencySymbols[currency.toUpperCase()] || currency + ' ';

    const formatMoney = (amount: number): string => {
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    const response: VATCalculationResponse = {
      subtotal,
      vatRate,
      vatAmount,
      totalWithVAT,
      currency: currency.toUpperCase(),
      breakdown: {
        subtotalFormatted: formatMoney(subtotal),
        vatAmountFormatted: formatMoney(vatAmount),
        totalFormatted: formatMoney(totalWithVAT),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('VAT calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate VAT' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/compliance/calculate-vat?subtotal=10000&vatRate=5&currency=USD
 *
 * Alternative GET endpoint for simple VAT calculations
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const subtotalParam = searchParams.get('subtotal');
    const vatRateParam = searchParams.get('vatRate');
    const currencyParam = searchParams.get('currency');

    if (!subtotalParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: subtotal' },
        { status: 400 }
      );
    }

    const subtotal = parseFloat(subtotalParam);
    const vatRate = vatRateParam ? parseFloat(vatRateParam) : 5;
    const currency = currencyParam || 'USD';

    if (isNaN(subtotal) || subtotal < 0) {
      return NextResponse.json(
        { error: 'Invalid subtotal. Must be a positive number.' },
        { status: 400 }
      );
    }

    if (isNaN(vatRate) || vatRate < 0 || vatRate > 100) {
      return NextResponse.json(
        { error: 'Invalid VAT rate. Must be between 0 and 100.' },
        { status: 400 }
      );
    }

    // Calculate VAT
    const vatAmount = Math.round((subtotal * vatRate / 100) * 100) / 100;
    const totalWithVAT = subtotal + vatAmount;

    // Format currency
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'AED': 'AED ',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
    };

    const symbol = currencySymbols[currency.toUpperCase()] || currency + ' ';

    const formatMoney = (amount: number): string => {
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    const response: VATCalculationResponse = {
      subtotal,
      vatRate,
      vatAmount,
      totalWithVAT,
      currency: currency.toUpperCase(),
      breakdown: {
        subtotalFormatted: formatMoney(subtotal),
        vatAmountFormatted: formatMoney(vatAmount),
        totalFormatted: formatMoney(totalWithVAT),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('VAT calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate VAT' },
      { status: 500 }
    );
  }
}
