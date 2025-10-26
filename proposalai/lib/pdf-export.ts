import html2pdf from 'html2pdf.js';

export interface PDFExportOptions {
  filename?: string;
  margin?: number | [number, number, number, number];
  image?: {
    type?: 'jpeg' | 'png' | 'webp';
    quality?: number;
  };
  html2canvas?: {
    scale?: number;
    useCORS?: boolean;
  };
  jsPDF?: {
    unit?: string;
    format?: string;
    orientation?: 'portrait' | 'landscape';
  };
}

/**
 * Export HTML content to PDF
 * @param element - HTML element or HTML string to export
 * @param options - PDF export options
 * @returns Promise that resolves when PDF is generated
 */
export async function exportToPDF(
  element: HTMLElement | string,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'proposal.pdf',
    margin = [10, 10, 10, 10],
    image = { type: 'jpeg' as const, quality: 0.98 },
    html2canvas = { scale: 2, useCORS: true },
    jsPDF = { unit: 'mm', format: 'a4', orientation: 'portrait' },
  } = options;

  const opt = {
    margin,
    filename,
    image,
    html2canvas,
    jsPDF,
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw new Error('Failed to export PDF');
  }
}

/**
 * Generate PDF blob without downloading
 * @param element - HTML element or HTML string to export
 * @param options - PDF export options
 * @returns Promise that resolves with PDF blob
 */
export async function generatePDFBlob(
  element: HTMLElement | string,
  options: PDFExportOptions = {}
): Promise<Blob> {
  const {
    margin = [10, 10, 10, 10],
    image = { type: 'jpeg' as const, quality: 0.98 },
    html2canvas = { scale: 2, useCORS: true },
    jsPDF = { unit: 'mm', format: 'a4', orientation: 'portrait' },
  } = options;

  const opt = {
    margin,
    image,
    html2canvas,
    jsPDF,
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    const pdf = await html2pdf().set(opt).from(element).output('blob');
    return pdf;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF');
  }
}

/**
 * Generate proposal PDF with custom styling
 * @param proposalData - Proposal data object
 * @returns Promise that resolves when PDF is generated
 */
export async function exportProposalPDF(proposalData: {
  title: string;
  client: string;
  content: string;
  pricing?: any;
  terms?: any;
}): Promise<void> {
  const { title, client, content } = proposalData;

  // Create temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '210mm'; // A4 width
  container.style.padding = '20mm';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'Arial, sans-serif';

  // Generate proposal HTML
  container.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="color: #4f46e5; font-size: 32px; margin-bottom: 10px;">${title}</h1>
      <p style="color: #6b7280; font-size: 16px;">Prepared for: ${client}</p>
      <p style="color: #9ca3af; font-size: 14px;">Generated: ${new Date().toLocaleDateString()}</p>
    </div>
    <div style="line-height: 1.8; color: #1f2937;">
      ${content}
    </div>
    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
      <p style="text-align: center; color: #9ca3af; font-size: 12px;">
        Generated with ProposifyAI | proposifyai.com
      </p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    await exportToPDF(container, {
      filename: `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      margin: 0,
    });
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * Preview PDF in new window
 * @param element - HTML element to preview
 * @param options - PDF export options
 */
export async function previewPDF(
  element: HTMLElement | string,
  options: PDFExportOptions = {}
): Promise<void> {
  try {
    const blob = await generatePDFBlob(element, options);
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('PDF Preview Error:', error);
    throw new Error('Failed to preview PDF');
  }
}
