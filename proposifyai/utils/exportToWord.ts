/**
 * Export HTML content to a Word-compatible .docx file
 * Uses Microsoft Word's HTML import feature
 */

export function exportToWord(content: string, filename: string = 'document.docx') {
  // Prepare the HTML content with proper Word XML structure
  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Export to Word</title>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 1in;
    }
    body {
      font-family: 'Calibri', sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000000;
    }
    h1 {
      font-size: 20pt;
      font-weight: bold;
      margin-top: 12pt;
      margin-bottom: 12pt;
      color: #2e2e2e;
    }
    h2 {
      font-size: 16pt;
      font-weight: bold;
      margin-top: 10pt;
      margin-bottom: 10pt;
      color: #2e2e2e;
    }
    h3 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 8pt;
      margin-bottom: 8pt;
      color: #2e2e2e;
    }
    p {
      margin: 6pt 0;
    }
    ul, ol {
      margin: 6pt 0;
      padding-left: 20pt;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 12pt 0;
    }
    table, th, td {
      border: 1pt solid #000000;
      padding: 6pt;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

  // Create a Blob with the HTML content
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });

  // Create a download link and trigger download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Alternative method using more modern approach with better formatting
 */
export function exportToWordModern(
  content: string,
  filename: string = 'document',
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
  }
) {
  const { title = 'Document', author = 'ProposifyAI', subject = '' } = metadata || {};

  const preHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <meta name="ProgId" content="Word.Document">
      <meta name="Generator" content="Microsoft Word 15">
      <meta name="Originator" content="Microsoft Word 15">
      <title>${title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>90</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page WordSection1 {
          size: 8.5in 11in;
          margin: 1.0in 1.0in 1.0in 1.0in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        div.WordSection1 { page: WordSection1; }
        body {
          font-family: 'Calibri', sans-serif;
          font-size: 11pt;
        }
        h1 { font-size: 20pt; font-weight: bold; }
        h2 { font-size: 16pt; font-weight: bold; }
        h3 { font-size: 14pt; font-weight: bold; }
        p { margin: 0.15in 0; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid black; padding: 5px; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
  `;

  const postHtml = `
      </div>
    </body>
    </html>
  `;

  const fullHtml = preHtml + content + postHtml;

  const blob = new Blob(['\ufeff', fullHtml], {
    type: 'application/vnd.ms-word'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
