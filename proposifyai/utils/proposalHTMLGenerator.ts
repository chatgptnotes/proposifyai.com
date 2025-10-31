/**
 * Professional Proposal HTML Generator
 * Generates production-ready HTML with letterhead backgrounds, logos, and print-optimized styling
 */

export interface ProposalHTMLOptions {
  // Branding
  letterhead?: string; // Base64 image or URL
  companyLogo?: string;
  clientLogo?: string;
  logoPosition?: 'top-center' | 'top-left' | 'top-right' | 'next-to-title';
  logoSize?: 'small' | 'medium' | 'large';
  logoLayout?: 'side-by-side' | 'stacked' | 'opposite-sides';

  // Colors
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  headingColor?: string;

  // Typography
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;

  // Layout
  pageMarginTop?: number;
  pageMarginBottom?: number;
  pageMarginLeft?: number;
  pageMarginRight?: number;

  // Metadata
  includePageNumbers?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export interface ProposalData {
  title: string;
  client_name: string;
  client_company?: string;
  client_email?: string;
  created_at: string;
  content: {
    executive_summary?: string;
    scope_of_work?: string;
    pricing_breakdown?: string;
    timeline?: string;
    terms?: string;
    [key: string]: any;
  };
  total_value?: number;
  currency?: string;
}

export function generateProposalHTML(
  proposal: ProposalData,
  options: ProposalHTMLOptions = {}
): string {
  const {
    letterhead = '',
    companyLogo = '',
    clientLogo = '',
    logoPosition = 'top-center',
    logoSize = 'medium',
    logoLayout = 'side-by-side',
    primaryColor = '#DC2626',
    secondaryColor = '#000000',
    textColor = '#1F2937',
    headingColor = '#111827',
    fontFamily = 'Arial, Helvetica, sans-serif',
    fontSize = 12,
    lineHeight = 1.5,
    pageMarginTop = 20,
    pageMarginBottom = 20,
    pageMarginLeft = 20,
    pageMarginRight = 20,
    includePageNumbers = true,
    includeHeader = true,
    includeFooter = true,
  } = options;

  // Generate the complete HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${proposal.title} - Proposal</title>
  ${generateStyles(options)}
</head>
<body>
  ${generateLetterheadBackground(letterhead)}

  <div class="proposal-container">
    ${generateHeader(proposal, {
      companyLogo,
      clientLogo,
      logoPosition,
      logoSize,
      logoLayout,
      primaryColor,
      headingColor
    })}

    <div class="proposal-body">
      ${generateExecutiveSummary(proposal.content.executive_summary, primaryColor)}
      ${generateScopeOfWork(proposal.content.scope_of_work, primaryColor)}
      ${generatePricingSection(proposal, primaryColor)}
      ${generateTimeline(proposal.content.timeline, primaryColor)}
      ${generateTerms(proposal.content.terms, primaryColor)}
    </div>

    ${includeFooter ? generateFooter() : ''}
  </div>

  ${includePageNumbers ? generatePageNumberScript() : ''}
</body>
</html>`;
}

function generateStyles(options: ProposalHTMLOptions): string {
  const {
    fontFamily = 'Arial, Helvetica, sans-serif',
    fontSize = 12,
    lineHeight = 1.5,
    textColor = '#1F2937',
    headingColor = '#111827',
    pageMarginTop = 20,
    pageMarginBottom = 20,
    pageMarginLeft = 20,
    pageMarginRight = 20,
  } = options;

  return `<style>
    /* Reset and Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: ${fontFamily};
      font-size: ${fontSize}pt;
      line-height: ${lineHeight};
      color: ${textColor};
      background: #f9fafb;
    }

    /* A4 Page Dimensions (210mm x 297mm) */
    .proposal-container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      position: relative;
      padding: ${pageMarginTop}mm ${pageMarginRight}mm ${pageMarginBottom}mm ${pageMarginLeft}mm;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    /* Letterhead Background */
    .letterhead-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 210mm;
      height: 297mm;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      z-index: 0;
      opacity: 0.95;
      pointer-events: none;
    }

    .proposal-container > * {
      position: relative;
      z-index: 1;
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      color: ${headingColor};
      font-weight: bold;
      margin-bottom: 0.5em;
    }

    h1 {
      font-size: ${fontSize * 2.5}pt;
      margin-bottom: 0.25em;
    }

    h2 {
      font-size: ${fontSize * 2}pt;
      padding-bottom: 0.3em;
      border-bottom: 2px solid currentColor;
      margin-top: 1.5em;
      margin-bottom: 0.75em;
    }

    h3 {
      font-size: ${fontSize * 1.5}pt;
      margin-top: 1.25em;
    }

    p {
      margin-bottom: 0.75em;
    }

    /* Lists */
    ul, ol {
      margin-left: 1.5em;
      margin-bottom: 1em;
    }

    li {
      margin-bottom: 0.5em;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
    }

    th, td {
      padding: 0.75em;
      text-align: left;
      border: 1px solid #e5e7eb;
    }

    th {
      background-color: #f3f4f6;
      font-weight: bold;
      color: ${headingColor};
    }

    tr:nth-child(even) {
      background-color: #f9fafb;
    }

    /* Logo Container */
    .logo-container {
      margin-bottom: 2em;
      text-align: center;
    }

    .logo-container.left {
      text-align: left;
    }

    .logo-container.right {
      text-align: right;
    }

    .logo-container img {
      max-width: 200px;
      height: auto;
    }

    .logo-small img {
      max-height: 60px;
    }

    .logo-medium img {
      max-height: 100px;
    }

    .logo-large img {
      max-height: 150px;
    }

    /* Header */
    .proposal-header {
      text-align: center;
      margin-bottom: 3em;
      padding-bottom: 2em;
      border-bottom: 2px solid #e5e7eb;
    }

    .proposal-header h1 {
      margin-bottom: 0.25em;
    }

    .proposal-header .client-info {
      font-size: ${fontSize * 1.25}pt;
      color: #6b7280;
      margin-top: 0.5em;
    }

    .proposal-header .date {
      color: #9ca3af;
      font-size: ${fontSize * 0.875}pt;
      margin-top: 1em;
    }

    /* Sections */
    .section {
      margin-bottom: 3em;
      page-break-inside: avoid;
    }

    .section-title {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    /* Pricing Table */
    .pricing-table {
      margin: 2em 0;
    }

    .pricing-table th {
      background-color: var(--primary-color);
      color: white;
    }

    .pricing-total {
      font-weight: bold;
      font-size: ${fontSize * 1.25}pt;
      background-color: #f3f4f6;
    }

    /* Footer */
    .proposal-footer {
      margin-top: 4em;
      padding-top: 2em;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: ${fontSize * 0.875}pt;
      color: #6b7280;
    }

    /* Page Numbers */
    .page-number {
      position: fixed;
      bottom: 10mm;
      right: 10mm;
      font-size: ${fontSize * 0.75}pt;
      color: #9ca3af;
    }

    /* Print Styles */
    @media print {
      body {
        background: white;
      }

      .proposal-container {
        width: 100%;
        margin: 0;
        box-shadow: none;
        page-break-after: always;
      }

      @page {
        size: A4;
        margin: ${pageMarginTop}mm ${pageMarginRight}mm ${pageMarginBottom}mm ${pageMarginLeft}mm;
      }

      .section {
        page-break-inside: avoid;
      }

      h2 {
        page-break-after: avoid;
      }
    }

    /* Screen-only styles */
    @media screen {
      body {
        padding: 20px;
      }
    }
  </style>`;
}

function generateLetterheadBackground(letterhead: string): string {
  if (!letterhead) return '';

  return `<div class="letterhead-background" style="background-image: url('${letterhead}');"></div>`;
}

function generateHeader(
  proposal: ProposalData,
  options: {
    companyLogo?: string;
    clientLogo?: string;
    logoPosition?: string;
    logoSize?: string;
    logoLayout?: string;
    primaryColor?: string;
    headingColor?: string;
  }
): string {
  const {
    companyLogo = '',
    clientLogo = '',
    logoPosition = 'top-center',
    logoSize = 'medium',
    logoLayout = 'side-by-side',
  } = options;

  let html = '<div class="proposal-header">';

  // Add logos if not next-to-title
  if (logoPosition !== 'next-to-title' && (companyLogo || clientLogo)) {
    const alignment = logoPosition.replace('top-', '');
    html += `<div class="logo-container logo-${logoSize} ${alignment}">`;

    if (logoLayout === 'side-by-side' && companyLogo && clientLogo) {
      html += `<div style="display: flex; align-items: center; justify-content: center; gap: 2em; flex-wrap: wrap;">`;
      html += `<img src="${companyLogo}" alt="Company Logo" />`;
      html += `<img src="${clientLogo}" alt="Client Logo" />`;
      html += `</div>`;
    } else if (logoLayout === 'opposite-sides' && companyLogo && clientLogo) {
      html += `<div style="display: flex; align-items: center; justify-content: space-between;">`;
      html += `<img src="${companyLogo}" alt="Company Logo" />`;
      html += `<img src="${clientLogo}" alt="Client Logo" />`;
      html += `</div>`;
    } else if (logoLayout === 'stacked') {
      if (companyLogo) html += `<img src="${companyLogo}" alt="Company Logo" style="display: block; margin-bottom: 1em;" />`;
      if (clientLogo) html += `<img src="${clientLogo}" alt="Client Logo" style="display: block;" />`;
    } else {
      if (companyLogo) html += `<img src="${companyLogo}" alt="Company Logo" />`;
      if (clientLogo && !companyLogo) html += `<img src="${clientLogo}" alt="Client Logo" />`;
    }

    html += '</div>';
  }

  // Title with logos if next-to-title
  if (logoPosition === 'next-to-title' && (companyLogo || clientLogo)) {
    html += `<div style="display: flex; align-items: center; justify-content: center; gap: 1.5em; flex-wrap: wrap; margin-bottom: 1em;">`;
    if (companyLogo) html += `<img src="${companyLogo}" alt="Company Logo" style="max-height: 60px;" />`;
    html += `<h1>${proposal.title}</h1>`;
    if (clientLogo) html += `<img src="${clientLogo}" alt="Client Logo" style="max-height: 60px;" />`;
    html += `</div>`;
  } else {
    html += `<h1>${proposal.title}</h1>`;
  }

  // Client info
  html += `<div class="client-info">`;
  html += `<p>Prepared for: <strong>${proposal.client_name}</strong></p>`;
  if (proposal.client_company) {
    html += `<p>${proposal.client_company}</p>`;
  }
  html += `</div>`;

  // Date
  const date = new Date(proposal.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  html += `<div class="date">${date}</div>`;

  html += '</div>';
  return html;
}

function generateExecutiveSummary(content: string | undefined, primaryColor: string): string {
  if (!content) return '';

  return `<div class="section">
    <h2 class="section-title" style="color: ${primaryColor}; border-bottom-color: ${primaryColor};">Executive Summary</h2>
    <div>${content}</div>
  </div>`;
}

function generateScopeOfWork(content: string | undefined, primaryColor: string): string {
  if (!content) return '';

  return `<div class="section">
    <h2 class="section-title" style="color: ${primaryColor}; border-bottom-color: ${primaryColor};">Scope of Work</h2>
    <div>${content}</div>
  </div>`;
}

function generatePricingSection(proposal: ProposalData, primaryColor: string): string {
  if (!proposal.content.pricing_breakdown && !proposal.total_value) return '';

  let html = `<div class="section">
    <h2 class="section-title" style="color: ${primaryColor}; border-bottom-color: ${primaryColor};">Investment</h2>`;

  if (proposal.content.pricing_breakdown) {
    html += `<div>${proposal.content.pricing_breakdown}</div>`;
  }

  if (proposal.total_value) {
    const currency = proposal.currency || 'USD';
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(proposal.total_value);

    html += `<table class="pricing-table">
      <thead>
        <tr>
          <th style="background-color: ${primaryColor};">Description</th>
          <th style="background-color: ${primaryColor}; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr class="pricing-total">
          <td><strong>Total Investment</strong></td>
          <td style="text-align: right;"><strong>${formattedValue}</strong></td>
        </tr>
      </tbody>
    </table>`;
  }

  html += '</div>';
  return html;
}

function generateTimeline(content: string | undefined, primaryColor: string): string {
  if (!content) return '';

  return `<div class="section">
    <h2 class="section-title" style="color: ${primaryColor}; border-bottom-color: ${primaryColor};">Project Timeline</h2>
    <div>${content}</div>
  </div>`;
}

function generateTerms(content: string | undefined, primaryColor: string): string {
  if (!content) return '';

  return `<div class="section">
    <h2 class="section-title" style="color: ${primaryColor}; border-bottom-color: ${primaryColor};">Terms & Conditions</h2>
    <div>${content}</div>
  </div>`;
}

function generateFooter(): string {
  return `<div class="proposal-footer">
    <p>This proposal is confidential and intended solely for the use of the individual or entity to whom it is addressed.</p>
    <p style="margin-top: 1em;">Thank you for considering our proposal. We look forward to working with you.</p>
  </div>`;
}

function generatePageNumberScript(): string {
  return `<script>
    // Add page numbers for print
    window.onload = function() {
      const pages = document.querySelectorAll('.proposal-container');
      pages.forEach((page, index) => {
        const pageNum = document.createElement('div');
        pageNum.className = 'page-number';
        pageNum.textContent = 'Page ' + (index + 1);
        page.appendChild(pageNum);
      });
    };
  </script>`;
}

/**
 * Generate HTML for preview display (not full document)
 */
export function generateProposalPreviewHTML(
  proposal: ProposalData,
  options: ProposalHTMLOptions = {}
): string {
  const fullHTML = generateProposalHTML(proposal, options);
  // Extract just the body content for preview
  const bodyMatch = fullHTML.match(/<body>([\s\S]*)<\/body>/);
  return bodyMatch ? bodyMatch[1] : fullHTML;
}

/**
 * Export proposal as downloadable HTML file
 */
export function downloadProposalHTML(
  proposal: ProposalData,
  options: ProposalHTMLOptions = {}
): void {
  const html = generateProposalHTML(proposal, options);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${proposal.title.replace(/[^a-z0-9]/gi, '_')}_proposal.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
