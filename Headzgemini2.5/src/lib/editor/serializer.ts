import { Block } from '../stores/editorStore';

export interface SerializedProposal {
  html: string;
  json: string;
  plainText: string;
}

/**
 * Convert blocks to HTML for email/preview
 */
export function blocksToHTML(blocks: Block[]): string {
  const html = blocks
    .sort((a, b) => a.position - b.position)
    .map((block) => {
      switch (block.type) {
        case 'text':
          return `<div class="text-block" data-block-id="${block.id}">${block.content.html || ''}</div>`;

        case 'image':
          return `
            <div class="image-block" data-block-id="${block.id}">
              <img src="${block.content.url}" alt="${block.content.alt || ''}" style="max-width: 100%; height: auto;" />
              ${block.content.caption ? `<p class="caption">${block.content.caption}</p>` : ''}
            </div>
          `;

        case 'pricing':
          return `
            <div class="pricing-block" data-block-id="${block.id}">
              <h3>${block.content.title || 'Pricing'}</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 12px; border-bottom: 2px solid #ddd;">Item</th>
                    <th style="text-align: right; padding: 12px; border-bottom: 2px solid #ddd;">Quantity</th>
                    <th style="text-align: right; padding: 12px; border-bottom: 2px solid #ddd;">Price</th>
                    <th style="text-align: right; padding: 12px; border-bottom: 2px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${(block.content.items || [])
                    .map(
                      (item: any) => `
                    <tr>
                      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
                      <td style="text-align: right; padding: 12px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                      <td style="text-align: right; padding: 12px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
                      <td style="text-align: right; padding: 12px; border-bottom: 1px solid #eee;">$${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="text-align: right; padding: 12px; font-weight: bold;">Total:</td>
                    <td style="text-align: right; padding: 12px; font-weight: bold;">$${calculateTotal(block.content.items).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          `;

        case 'video':
          return `
            <div class="video-block" data-block-id="${block.id}">
              ${getVideoEmbed(block.content.url)}
              ${block.content.caption ? `<p class="caption">${block.content.caption}</p>` : ''}
            </div>
          `;

        case 'testimonial':
          return `
            <div class="testimonial-block" data-block-id="${block.id}" style="background: #f9fafb; padding: 24px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <blockquote style="margin: 0; font-style: italic; color: #374151;">
                "${block.content.quote}"
              </blockquote>
              <div style="margin-top: 16px; display: flex; align-items: center; gap: 12px;">
                ${block.content.avatar ? `<img src="${block.content.avatar}" alt="${block.content.author}" style="width: 48px; height: 48px; border-radius: 50%;" />` : ''}
                <div>
                  <p style="margin: 0; font-weight: 600; color: #111827;">${block.content.author}</p>
                  ${block.content.role ? `<p style="margin: 0; font-size: 14px; color: #6b7280;">${block.content.role}</p>` : ''}
                  ${block.content.company ? `<p style="margin: 0; font-size: 14px; color: #6b7280;">${block.content.company}</p>` : ''}
                </div>
              </div>
            </div>
          `;

        case 'cta':
          return `
            <div class="cta-block" data-block-id="${block.id}" style="text-align: center; padding: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; color: white;">
              <h2 style="margin: 0 0 16px 0; color: white;">${block.content.title}</h2>
              ${block.content.description ? `<p style="margin: 0 0 24px 0; font-size: 18px; opacity: 0.9;">${block.content.description}</p>` : ''}
              <a href="${block.content.buttonUrl || '#'}" style="display: inline-block; padding: 12px 32px; background: white; color: #667eea; text-decoration: none; border-radius: 6px; font-weight: 600;">
                ${block.content.buttonText || 'Get Started'}
              </a>
            </div>
          `;

        case 'signature':
          return `
            <div class="signature-block" data-block-id="${block.id}" style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280;">Signature:</p>
              ${block.content.signature ? `<img src="${block.content.signature}" alt="Signature" style="max-width: 300px; height: auto;" />` : '<div style="height: 80px; border-bottom: 2px solid #000; width: 300px;"></div>'}
              <p style="margin: 16px 0 0 0; font-weight: 600;">${block.content.name || '_____________________'}</p>
              ${block.content.title ? `<p style="margin: 4px 0 0 0; color: #6b7280;">${block.content.title}</p>` : ''}
              ${block.content.date ? `<p style="margin: 4px 0 0 0; color: #6b7280;">Date: ${block.content.date}</p>` : ''}
            </div>
          `;

        default:
          return '';
      }
    })
    .join('\n');

  return wrapInHTMLTemplate(html);
}

/**
 * Convert blocks to JSON for storage
 */
export function blocksToJSON(blocks: Block[]): string {
  return JSON.stringify(blocks, null, 2);
}

/**
 * Convert blocks to plain text
 */
export function blocksToPlainText(blocks: Block[]): string {
  return blocks
    .sort((a, b) => a.position - b.position)
    .map((block) => {
      switch (block.type) {
        case 'text':
          return stripHTML(block.content.html || '');

        case 'image':
          return `[Image: ${block.content.alt || 'Image'}]${block.content.caption ? '\n' + block.content.caption : ''}`;

        case 'pricing':
          const items = (block.content.items || [])
            .map((item: any) => `${item.name} - Qty: ${item.quantity} - $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`)
            .join('\n');
          return `${block.content.title || 'Pricing'}\n${items}\nTotal: $${calculateTotal(block.content.items).toFixed(2)}`;

        case 'video':
          return `[Video: ${block.content.url}]${block.content.caption ? '\n' + block.content.caption : ''}`;

        case 'testimonial':
          return `"${block.content.quote}"\n- ${block.content.author}${block.content.role ? ', ' + block.content.role : ''}${block.content.company ? ' at ' + block.content.company : ''}`;

        case 'cta':
          return `${block.content.title}\n${block.content.description || ''}\n${block.content.buttonText || 'Get Started'}: ${block.content.buttonUrl || ''}`;

        case 'signature':
          return `Signature: ${block.content.name || '___________'}\n${block.content.title || ''}\n${block.content.date ? 'Date: ' + block.content.date : ''}`;

        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Parse JSON to blocks
 */
export function jsonToBlocks(json: string): Block[] {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return [];
  }
}

/**
 * Serialize proposal to all formats
 */
export function serializeProposal(blocks: Block[]): SerializedProposal {
  return {
    html: blocksToHTML(blocks),
    json: blocksToJSON(blocks),
    plainText: blocksToPlainText(blocks),
  };
}

// Helper functions

function calculateTotal(items: any[]): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function getVideoEmbed(url: string): string {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${youtubeMatch[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `<iframe width="100%" height="400" src="https://player.vimeo.com/video/${vimeoMatch[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([^&\s]+)/);
  if (loomMatch) {
    return `<iframe width="100%" height="400" src="https://www.loom.com/embed/${loomMatch[1]}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
  }

  // Default video tag
  return `<video width="100%" controls><source src="${url}" /></video>`;
}

function wrapInHTMLTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposal</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .text-block,
    .image-block,
    .pricing-block,
    .video-block,
    .testimonial-block,
    .cta-block,
    .signature-block {
      margin-bottom: 32px;
    }
    .caption {
      margin-top: 8px;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `.trim();
}
