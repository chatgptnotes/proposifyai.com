import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { BETTROI_CONFIG, getBettroiTemplatePlaceholders } from '@/lib/compliance/bettroi-config';

interface ClientData {
  name: string;
  email: string;
  website: string;
  trn?: string; // Client Tax Registration Number
  tradeLicense?: string; // Client Trade License
  fullAddress?: string; // Client Full Registered Address
  contactPerson?: string;
  phone?: string;
  taxStatus?: string; // e.g., "Standard Rated", "Zero Rated", "Exempt"
}

interface ProjectData {
  title: string;
  investment: string; // Base amount (will become subtotal)
  duration: string;
  currency?: string; // Default USD
  calculateVAT?: boolean; // Default true
  documentType?: string; // "quotation" | "tax_invoice" | "proposal"
  sections?: Array<{
    title: string;
    content: string;
  }>;
}

interface GenerateProposalRequest {
  templateId: string;
  clientData: ClientData;
  projectData: ProjectData;
  reference?: string;
  erpReference?: string;
  date?: string;
}

/**
 * POST /api/proposals/generate-from-template
 * Generate a new proposal from a template with UAE AML compliance
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: GenerateProposalRequest = await request.json();
    const { templateId, clientData, projectData, reference, erpReference, date } = body;

    // Validate required fields
    if (!templateId || !clientData || !projectData) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, clientData, projectData' },
        { status: 400 }
      );
    }

    // Load template files
    const templateDir = path.join(process.cwd(), 'templates', templateId);

    let templateHtml: string;
    let config: any;

    try {
      templateHtml = await fs.readFile(
        path.join(templateDir, 'template.html'),
        'utf-8'
      );
      const configFile = await fs.readFile(
        path.join(templateDir, 'config.json'),
        'utf-8'
      );
      config = JSON.parse(configFile);
    } catch (error) {
      return NextResponse.json(
        { error: `Template '${templateId}' not found` },
        { status: 404 }
      );
    }

    // Generate dynamic values
    const today = new Date();
    const proposalDate = date || today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const headerDate = today.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const shortDate = today.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-');
    const validUntilDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const validUntil = validUntilDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    // Generate reference numbers if not provided
    const proposalReference = reference || `${config.header.reference_prefix} K${Math.floor(Math.random() * 100)}`;
    const proposalErpRef = erpReference || `${config.variables.erp_prefix}-${today.getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    // Get Bettroi compliance placeholders
    const bettroiPlaceholders = getBettroiTemplatePlaceholders();

    // Calculate VAT
    const currency = projectData.currency || 'USD';
    const calculateVAT = projectData.calculateVAT !== false; // Default true
    const documentType = projectData.documentType || 'QUOTATION';

    // Parse investment amount (remove currency symbols and commas)
    const subtotalAmount = parseFloat(projectData.investment.replace(/[^0-9.]/g, ''));
    const vatRate = calculateVAT ? BETTROI_CONFIG.vatRate : 0;
    const vatAmount = Math.round((subtotalAmount * vatRate / 100) * 100) / 100;
    const totalWithVAT = subtotalAmount + vatAmount;

    // Format currency values
    const currencySymbols: { [key: string]: string } = {
      'USD': '$',
      'AED': 'AED ',
      'EUR': '€',
      'GBP': '£',
    };
    const symbol = currencySymbols[currency] || currency + ' ';

    const formatMoney = (amount: number): string => {
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    // Generate table of contents
    const tableOfContents = projectData.sections
      ?.map((section, index) => `<p>${index + 1}. ${section.title}</p>`)
      .join('\n') || '';

    // Generate content pages
    const contentPages = projectData.sections
      ?.map((section, index) => {
        const pageNumber = index + 3; // Starting from page 3
        return `
<!-- Page ${pageNumber} -->
<div class="page">
<div class="header">
<div class="logo-box"><img src="logo.jpg" class="logo"><div class="name">${config.company}</div></div>
<div class="ref"><b>Reference:</b> ${proposalReference}<br><b>Date:</b> ${headerDate}<br><b>Website:</b> ${config.header.website}</div>
</div>
<div class="content">
<h2>${section.title}</h2>
${section.content}
</div>
<div class="footer"><b>${config.footer.left_text}</b><span>${shortDate} / ${proposalErpRef}</span><b>${pageNumber} | Page</b></div>
</div>
`;
      })
      .join('\n') || '';

    // Replace all template variables
    let proposalHtml = templateHtml
      // Bettroi/Supplier Details (from bettroi-config.ts)
      .replace(/\{\{SUPPLIER_LEGAL_NAME\}\}/g, bettroiPlaceholders.SUPPLIER_LEGAL_NAME)
      .replace(/\{\{SUPPLIER_TRADE_LICENSE\}\}/g, bettroiPlaceholders.SUPPLIER_TRADE_LICENSE)
      .replace(/\{\{SUPPLIER_TRN\}\}/g, bettroiPlaceholders.SUPPLIER_TRN)
      .replace(/\{\{SUPPLIER_FULL_ADDRESS\}\}/g, bettroiPlaceholders.SUPPLIER_FULL_ADDRESS)
      .replace(/\{\{SUPPLIER_PHONE\}\}/g, bettroiPlaceholders.SUPPLIER_PHONE)
      .replace(/\{\{SUPPLIER_EMAIL\}\}/g, bettroiPlaceholders.SUPPLIER_EMAIL)
      .replace(/\{\{SUPPLIER_WEBSITE\}\}/g, bettroiPlaceholders.SUPPLIER_WEBSITE)

      // Bank Details (from bettroi-config.ts)
      .replace(/\{\{BANK_NAME\}\}/g, bettroiPlaceholders.BANK_NAME)
      .replace(/\{\{BANK_BRANCH\}\}/g, bettroiPlaceholders.BANK_BRANCH)
      .replace(/\{\{BANK_ACCOUNT_NAME\}\}/g, bettroiPlaceholders.BANK_ACCOUNT_NAME)
      .replace(/\{\{BANK_ACCOUNT_NUMBER\}\}/g, bettroiPlaceholders.BANK_ACCOUNT_NUMBER)
      .replace(/\{\{BANK_IBAN\}\}/g, bettroiPlaceholders.BANK_IBAN)
      .replace(/\{\{BANK_SWIFT\}\}/g, bettroiPlaceholders.BANK_SWIFT)

      // Payment Terms (from bettroi-config.ts)
      .replace(/\{\{PAYMENT_TERMS\}\}/g, bettroiPlaceholders.PAYMENT_TERMS)

      // Document Type & Reference
      .replace(/\{\{DOCUMENT_TYPE\}\}/g, documentType.toUpperCase())
      .replace(/\{\{REFERENCE\}\}/g, proposalReference)
      .replace(/\{\{ERP_REFERENCE\}\}/g, proposalErpRef)
      .replace(/\{\{DATE\}\}/g, headerDate)
      .replace(/\{\{DATE_SHORT\}\}/g, shortDate)
      .replace(/\{\{VALID_UNTIL\}\}/g, validUntil)

      // Client Details
      .replace(/\{\{CLIENT_NAME\}\}/g, clientData.name)
      .replace(/\{\{CLIENT_EMAIL\}\}/g, clientData.email || 'Not Provided')
      .replace(/\{\{CLIENT_PHONE\}\}/g, clientData.phone || 'Not Provided')
      .replace(/\{\{CLIENT_WEBSITE\}\}/g, clientData.website || 'Not Provided')
      .replace(/\{\{CLIENT_CONTACT_PERSON\}\}/g, clientData.contactPerson || 'Not Provided')
      .replace(/\{\{CLIENT_TRN\}\}/g, clientData.trn || 'To Be Provided')
      .replace(/\{\{CLIENT_TRADE_LICENSE\}\}/g, clientData.tradeLicense || 'To Be Provided')
      .replace(/\{\{CLIENT_FULL_ADDRESS\}\}/g, clientData.fullAddress || 'To Be Provided')
      .replace(/\{\{CLIENT_TAX_STATUS\}\}/g, clientData.taxStatus || 'Standard Rated')

      // Project Details
      .replace(/\{\{PROPOSAL_TITLE\}\}/g, projectData.title)
      .replace(/\{\{PROPOSAL_DATE\}\}/g, proposalDate)
      .replace(/\{\{PROJECT_DURATION\}\}/g, projectData.duration)

      // Financial Details (with VAT)
      .replace(/\{\{CURRENCY\}\}/g, currency)
      .replace(/\{\{SUBTOTAL_AMOUNT\}\}/g, formatMoney(subtotalAmount))
      .replace(/\{\{VAT_RATE\}\}/g, vatRate.toString())
      .replace(/\{\{VAT_AMOUNT\}\}/g, formatMoney(vatAmount))
      .replace(/\{\{TOTAL_WITH_VAT\}\}/g, formatMoney(totalWithVAT))
      .replace(/\{\{TOTAL_INVESTMENT\}\}/g, formatMoney(totalWithVAT)) // Legacy support

      // Content
      .replace(/\{\{TABLE_OF_CONTENTS\}\}/g, tableOfContents)
      .replace(/\{\{CONTENT_PAGES\}\}/g, contentPages)

      // Page numbers (will be dynamically calculated by sections)
      .replace(/\{\{PAGE_NUMBER\}\}/g, '1');

    // Calculate retention date (5 years from now)
    const retentionDate = new Date(today);
    retentionDate.setFullYear(retentionDate.getFullYear() + 5);

    // Save proposal to database with AML compliance fields
    const { data: proposal, error: dbError } = await supabase
      .from('proposals')
      .insert({
        user_id: session.user.id,
        client_name: clientData.name,
        client_email: clientData.email,
        title: projectData.title,
        content: proposalHtml,
        template_id: templateId,
        status: 'draft',

        // AML Compliance Fields
        client_trn: clientData.trn || null,
        client_trade_license: clientData.tradeLicense || null,
        client_full_address: clientData.fullAddress || null,

        // Financial Fields
        subtotal_amount: subtotalAmount,
        vat_rate: vatRate,
        vat_amount: vatAmount,
        total_with_vat: totalWithVAT,
        currency: currency,

        // Document Metadata
        document_type: documentType.toLowerCase(),
        retention_until_date: retentionDate.toISOString(),

        metadata: {
          client_data: clientData,
          project_data: projectData,
          reference: proposalReference,
          erp_reference: proposalErpRef,
          bettroi_config: {
            trn: BETTROI_CONFIG.trn,
            trade_license: BETTROI_CONFIG.tradeLicense,
            iban: BETTROI_CONFIG.iban,
            swift: BETTROI_CONFIG.swift,
          },
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save proposal to database', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      proposal: {
        id: proposal.id,
        title: proposal.title,
        client_name: proposal.client_name,
        reference: proposalReference,
        erp_reference: proposalErpRef,
        subtotal: subtotalAmount,
        vat_amount: vatAmount,
        total_with_vat: totalWithVAT,
        currency: currency,
        html: proposalHtml,
      },
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/proposals/generate-from-template
 * List available templates
 */
export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'templates');
    const templates = await fs.readdir(templatesDir);

    const templateList = await Promise.all(
      templates.map(async (templateId) => {
        try {
          const configPath = path.join(templatesDir, templateId, 'config.json');
          const configFile = await fs.readFile(configPath, 'utf-8');
          const config = JSON.parse(configFile);
          return {
            id: templateId,
            name: config.name,
            version: config.version,
            company: config.company,
          };
        } catch (error) {
          return null;
        }
      })
    );

    return NextResponse.json({
      templates: templateList.filter(Boolean),
    });
  } catch (error) {
    console.error('Error listing templates:', error);
    return NextResponse.json(
      { error: 'Failed to list templates' },
      { status: 500 }
    );
  }
}
