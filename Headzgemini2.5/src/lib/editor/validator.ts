import { Block } from '../stores/editorStore';

export interface ValidationError {
  blockId: string;
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a single block
 */
export function validateBlock(block: Block): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (block.type) {
    case 'text':
      if (!block.content.html || block.content.html.trim() === '') {
        errors.push({
          blockId: block.id,
          field: 'html',
          message: 'Text content cannot be empty',
        });
      }
      break;

    case 'image':
      if (!block.content.url) {
        errors.push({
          blockId: block.id,
          field: 'url',
          message: 'Image URL is required',
        });
      } else if (!isValidURL(block.content.url)) {
        errors.push({
          blockId: block.id,
          field: 'url',
          message: 'Invalid image URL',
        });
      }
      break;

    case 'pricing':
      if (!block.content.items || block.content.items.length === 0) {
        errors.push({
          blockId: block.id,
          field: 'items',
          message: 'At least one pricing item is required',
        });
      } else {
        block.content.items.forEach((item: any, index: number) => {
          if (!item.name || item.name.trim() === '') {
            errors.push({
              blockId: block.id,
              field: `items[${index}].name`,
              message: 'Item name is required',
            });
          }
          if (typeof item.quantity !== 'number' || item.quantity <= 0) {
            errors.push({
              blockId: block.id,
              field: `items[${index}].quantity`,
              message: 'Quantity must be a positive number',
            });
          }
          if (typeof item.price !== 'number' || item.price < 0) {
            errors.push({
              blockId: block.id,
              field: `items[${index}].price`,
              message: 'Price must be a non-negative number',
            });
          }
        });
      }
      break;

    case 'video':
      if (!block.content.url) {
        errors.push({
          blockId: block.id,
          field: 'url',
          message: 'Video URL is required',
        });
      } else if (!isValidVideoURL(block.content.url)) {
        errors.push({
          blockId: block.id,
          field: 'url',
          message: 'Invalid video URL. Supported: YouTube, Vimeo, Loom',
        });
      }
      break;

    case 'testimonial':
      if (!block.content.quote || block.content.quote.trim() === '') {
        errors.push({
          blockId: block.id,
          field: 'quote',
          message: 'Testimonial quote is required',
        });
      }
      if (!block.content.author || block.content.author.trim() === '') {
        errors.push({
          blockId: block.id,
          field: 'author',
          message: 'Author name is required',
        });
      }
      if (block.content.avatar && !isValidURL(block.content.avatar)) {
        errors.push({
          blockId: block.id,
          field: 'avatar',
          message: 'Invalid avatar URL',
        });
      }
      break;

    case 'cta':
      if (!block.content.title || block.content.title.trim() === '') {
        errors.push({
          blockId: block.id,
          field: 'title',
          message: 'CTA title is required',
        });
      }
      if (!block.content.buttonText || block.content.buttonText.trim() === '') {
        errors.push({
          blockId: block.id,
          field: 'buttonText',
          message: 'Button text is required',
        });
      }
      if (block.content.buttonUrl && !isValidURL(block.content.buttonUrl)) {
        errors.push({
          blockId: block.id,
          field: 'buttonUrl',
          message: 'Invalid button URL',
        });
      }
      break;

    case 'signature':
      if (!block.content.name || block.content.name.trim() === '') {
        errors.push({
          blockId: block.id,
          field: 'name',
          message: 'Signer name is required',
        });
      }
      if (block.content.signature && !isValidURL(block.content.signature)) {
        errors.push({
          blockId: block.id,
          field: 'signature',
          message: 'Invalid signature image URL',
        });
      }
      break;
  }

  return errors;
}

/**
 * Validate all blocks in a proposal
 */
export function validateBlocks(blocks: Block[]): ValidationResult {
  const allErrors: ValidationError[] = [];

  blocks.forEach((block) => {
    const blockErrors = validateBlock(block);
    allErrors.push(...blockErrors);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validate proposal metadata
 */
export function validateProposalMetadata(title: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!title || title.trim() === '') {
    errors.push({
      blockId: 'proposal',
      field: 'title',
      message: 'Proposal title is required',
    });
  }

  if (title && title.length > 200) {
    errors.push({
      blockId: 'proposal',
      field: 'title',
      message: 'Proposal title must be less than 200 characters',
    });
  }

  return errors;
}

/**
 * Check if proposal is ready to send
 */
export function canSendProposal(title: string, blocks: Block[]): ValidationResult {
  const titleErrors = validateProposalMetadata(title);
  const blockValidation = validateBlocks(blocks);

  return {
    isValid: titleErrors.length === 0 && blockValidation.isValid,
    errors: [...titleErrors, ...blockValidation.errors],
  };
}

// Helper functions

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidVideoURL(url: string): boolean {
  const videoPatterns = [
    /youtube\.com\/watch\?v=[\w-]+/,
    /youtu\.be\/[\w-]+/,
    /vimeo\.com\/\d+/,
    /loom\.com\/share\/[\w-]+/,
  ];

  return videoPatterns.some((pattern) => pattern.test(url)) || isValidURL(url);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeContent(content: any, blockType: Block['type']): any {
  // Basic sanitization - in production, use a library like DOMPurify
  const sanitizeString = (str: string): string => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  };

  switch (blockType) {
    case 'text':
      return {
        ...content,
        html: content.html, // DOMPurify would be used here in production
      };

    case 'image':
      return {
        ...content,
        url: sanitizeString(content.url),
        alt: sanitizeString(content.alt || ''),
        caption: sanitizeString(content.caption || ''),
      };

    case 'video':
      return {
        ...content,
        url: sanitizeString(content.url),
        caption: sanitizeString(content.caption || ''),
      };

    case 'testimonial':
      return {
        ...content,
        quote: sanitizeString(content.quote),
        author: sanitizeString(content.author),
        role: sanitizeString(content.role || ''),
        company: sanitizeString(content.company || ''),
        avatar: sanitizeString(content.avatar || ''),
      };

    case 'cta':
      return {
        ...content,
        title: sanitizeString(content.title),
        description: sanitizeString(content.description || ''),
        buttonText: sanitizeString(content.buttonText),
        buttonUrl: sanitizeString(content.buttonUrl || ''),
      };

    case 'signature':
      return {
        ...content,
        name: sanitizeString(content.name),
        title: sanitizeString(content.title || ''),
        date: content.date,
        signature: sanitizeString(content.signature || ''),
      };

    default:
      return content;
  }
}
