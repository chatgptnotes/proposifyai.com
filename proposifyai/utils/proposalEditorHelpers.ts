/**
 * Proposal Editor Helper Functions
 * Utilities for the proposal editor including saved content insertion, logo handling, and letterhead management
 */

import { ProposalHTMLOptions, ProposalData, generateProposalHTML } from './proposalHTMLGenerator';

/**
 * Fetch user's letterhead and formatting preferences
 */
export async function fetchUserBrandingSettings(): Promise<{
  letterhead?: string;
  formattingPrefs?: any;
  companyLogos?: string[];
  clientLogos?: string[];
}> {
  try {
    // Fetch user profile for letterhead
    const profileResponse = await fetch('/api/user/profile');
    const profileData = await profileResponse.json();

    const preferences = profileData.data?.preferences || {};
    const letterhead = preferences.letterhead;

    // Fetch formatting preferences
    const formattingResponse = await fetch('/api/formatting-preferences');
    const formattingData = await formattingResponse.json();
    const formattingPrefs = formattingData.data || {};

    // Fetch saved logos
    const savedContentResponse = await fetch('/api/saved-content');
    const savedContentData = await savedContentResponse.json();
    const savedContent = savedContentData.data || [];

    const companyLogos = savedContent
      .filter((item: any) => item.category === 'company_logo')
      .map((item: any) => item.content);

    const clientLogos = savedContent
      .filter((item: any) => item.category === 'client_logo')
      .map((item: any) => item.content);

    return {
      letterhead,
      formattingPrefs,
      companyLogos,
      clientLogos,
    };
  } catch (error) {
    console.error('Error fetching branding settings:', error);
    return {};
  }
}

/**
 * Insert content at current cursor position in contenteditable div
 */
export function insertContentAtCursor(content: string, editableElement: HTMLElement): boolean {
  try {
    const selection = window.getSelection();
    let range: Range;

    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    } else {
      // If no selection, insert at the end
      range = document.createRange();
      range.selectNodeContents(editableElement);
      range.collapse(false);
    }

    // Create content node
    const contentNode = document.createElement('div');
    contentNode.innerHTML = content;
    contentNode.style.marginTop = '1rem';
    contentNode.style.marginBottom = '1rem';

    // Insert content
    range.deleteContents();
    range.insertNode(contentNode);

    // Move cursor after inserted content
    range.setStartAfter(contentNode);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);

    return true;
  } catch (error) {
    console.error('Error inserting content:', error);
    return false;
  }
}

/**
 * Insert logo image at cursor position
 */
export function insertLogoAtCursor(logoUrl: string, alt: string, editableElement: HTMLElement): boolean {
  try {
    const selection = window.getSelection();
    let range: Range;

    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
    } else {
      range = document.createRange();
      range.selectNodeContents(editableElement);
      range.collapse(false);
    }

    // Create image element
    const imgContainer = document.createElement('div');
    imgContainer.style.textAlign = 'center';
    imgContainer.style.margin = '2rem 0';

    const img = document.createElement('img');
    img.src = logoUrl;
    img.alt = alt;
    img.style.maxWidth = '300px';
    img.style.maxHeight = '150px';
    img.style.objectFit = 'contain';

    imgContainer.appendChild(img);

    // Insert image
    range.deleteContents();
    range.insertNode(imgContainer);

    // Move cursor after inserted image
    range.setStartAfter(imgContainer);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);

    return true;
  } catch (error) {
    console.error('Error inserting logo:', error);
    return false;
  }
}

/**
 * Convert contenteditable HTML to proposal data structure
 */
export function extractProposalDataFromHTML(html: string, proposal: any): ProposalData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract sections by finding headers and content
  const sections: Record<string, string> = {};

  const headers = doc.querySelectorAll('h2');
  headers.forEach((header) => {
    const sectionName = header.textContent?.trim().toLowerCase().replace(/\s+/g, '_') || '';
    let content = '';

    // Get all sibling elements until next h2
    let sibling = header.nextElementSibling;
    while (sibling && sibling.tagName !== 'H2') {
      content += sibling.outerHTML;
      sibling = sibling.nextElementSibling;
    }

    if (sectionName) {
      sections[sectionName] = content;
    }
  });

  return {
    title: proposal.title,
    client_name: proposal.client_name,
    client_company: proposal.client_company,
    client_email: proposal.client_email,
    created_at: proposal.created_at,
    total_value: proposal.total_value,
    currency: proposal.currency,
    content: {
      executive_summary: sections['executive_summary'] || sections['project_overview'] || '',
      scope_of_work: sections['scope_of_work'] || '',
      pricing_breakdown: sections['investment'] || sections['pricing'] || '',
      timeline: sections['project_timeline'] || sections['timeline'] || '',
      terms: sections['terms_&_conditions'] || sections['terms'] || '',
      ...sections,
    },
  };
}

/**
 * Generate options for HTML export from proposal metadata
 */
export function getHTMLOptionsFromProposal(proposal: any, userSettings: any): ProposalHTMLOptions {
  const metadata = proposal.metadata || {};
  const formattingPrefs = userSettings.formattingPrefs || {};

  return {
    // Branding
    letterhead: userSettings.letterhead,
    companyLogo: metadata.companyLogo || '',
    clientLogo: metadata.clientLogo || '',
    logoPosition: metadata.logoPosition || 'top-center',
    logoSize: metadata.logoSize || 'medium',
    logoLayout: metadata.logoLayout || 'side-by-side',

    // Colors
    primaryColor: formattingPrefs.primary_color || metadata.primaryColor || '#DC2626',
    secondaryColor: formattingPrefs.secondary_color || metadata.secondaryColor || '#000000',
    textColor: formattingPrefs.text_color || '#1F2937',
    headingColor: formattingPrefs.heading_color || '#111827',

    // Typography
    fontFamily: metadata.useCustomFormatting
      ? metadata.fontFamily || formattingPrefs.font_family
      : formattingPrefs.font_family || 'Arial, Helvetica, sans-serif',
    fontSize: metadata.useCustomFormatting
      ? metadata.fontSize || formattingPrefs.font_size_base
      : formattingPrefs.font_size_base || 12,
    lineHeight: metadata.useCustomFormatting
      ? metadata.lineHeight || formattingPrefs.line_height
      : formattingPrefs.line_height || 1.5,

    // Layout
    pageMarginTop: formattingPrefs.page_margin_top || 20,
    pageMarginBottom: formattingPrefs.page_margin_bottom || 20,
    pageMarginLeft: formattingPrefs.page_margin_left || 20,
    pageMarginRight: formattingPrefs.page_margin_right || 20,

    // Metadata
    includePageNumbers: formattingPrefs.show_page_numbers !== false,
    includeHeader: formattingPrefs.show_header !== false,
    includeFooter: formattingPrefs.show_footer !== false,
  };
}

/**
 * Apply letterhead background to preview element
 */
export function applyLetterheadBackground(element: HTMLElement, letterheadUrl: string): void {
  if (!letterheadUrl) return;

  element.style.backgroundImage = `url('${letterheadUrl}')`;
  element.style.backgroundSize = 'cover';
  element.style.backgroundPosition = 'center';
  element.style.backgroundRepeat = 'no-repeat';
  element.style.backgroundAttachment = 'local';
}

/**
 * Remove letterhead background from element
 */
export function removeLetterheadBackground(element: HTMLElement): void {
  element.style.backgroundImage = 'none';
}

/**
 * Export proposal as professional HTML
 */
export async function exportProposalAsHTML(
  proposal: any,
  content: string,
  userSettings: any
): Promise<void> {
  try {
    const proposalData = extractProposalDataFromHTML(content, proposal);
    const options = getHTMLOptionsFromProposal(proposal, userSettings);

    const html = generateProposalHTML(proposalData, options);

    // Create and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${proposal.title.replace(/[^a-z0-9]/gi, '_')}_proposal.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting HTML:', error);
    throw error;
  }
}

/**
 * Save proposal customization settings
 */
export async function saveProposalCustomization(
  proposalId: string,
  customization: {
    companyLogo?: string;
    clientLogo?: string;
    logoPosition?: string;
    logoSize?: string;
    logoLayout?: string;
    primaryColor?: string;
    fontFamily?: string;
    fontSize?: number;
    lineHeight?: number;
    useCustomFormatting?: boolean;
  }
): Promise<boolean> {
  try {
    const response = await fetch(`/api/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metadata: customization,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error saving customization:', error);
    return false;
  }
}
