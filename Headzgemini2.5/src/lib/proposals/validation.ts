import { z } from 'zod';

// Proposal status types
export const ProposalStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  SIGNED: 'signed',
  DECLINED: 'declined',
  EXPIRED: 'expired',
} as const;

export type ProposalStatusType = typeof ProposalStatus[keyof typeof ProposalStatus];

// Proposal interface
export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  status: ProposalStatusType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  viewedAt?: Date;
  signedAt?: Date;
  declinedAt?: Date;
  sharedLink?: string;
  password?: string;
  isPasswordProtected: boolean;
  viewCount: number;
  tags?: string[];
  userId: string;
}

// Share settings interface
export interface ShareSettings {
  expirationDate?: Date;
  password?: string;
  allowDownload: boolean;
  trackViews: boolean;
  requirePassword: boolean;
}

// Validation schemas
export const proposalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  clientName: z.string().min(1, 'Client name is required').max(100),
  clientEmail: z.string().email('Invalid email address'),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD)'),
  content: z.string().min(1, 'Content is required'),
  expiresAt: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

export const shareSettingsSchema = z.object({
  expirationDate: z.date().optional(),
  password: z.string().min(4, 'Password must be at least 4 characters').optional(),
  allowDownload: z.boolean().default(true),
  trackViews: z.boolean().default(true),
  requirePassword: z.boolean().default(false),
});

export const sendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().optional(),
  includeLink: z.boolean().default(true),
  includePdf: z.boolean().default(false),
});

// Validation functions
export function validateProposal(data: unknown): z.SafeParseReturnType<unknown, z.infer<typeof proposalSchema>> {
  return proposalSchema.safeParse(data);
}

export function validateShareSettings(data: unknown): z.SafeParseReturnType<unknown, z.infer<typeof shareSettingsSchema>> {
  return shareSettingsSchema.safeParse(data);
}

export function validateSendEmail(data: unknown): z.SafeParseReturnType<unknown, z.infer<typeof sendEmailSchema>> {
  return sendEmailSchema.safeParse(data);
}

// Helper functions
export function isProposalExpired(proposal: Proposal): boolean {
  if (!proposal.expiresAt) return false;
  return new Date() > new Date(proposal.expiresAt);
}

export function canViewProposal(proposal: Proposal, password?: string): boolean {
  if (isProposalExpired(proposal)) return false;
  if (proposal.isPasswordProtected && !password) return false;
  return true;
}

export function getProposalStatusColor(status: ProposalStatusType): string {
  const colors = {
    draft: 'gray',
    sent: 'blue',
    viewed: 'purple',
    signed: 'green',
    declined: 'red',
    expired: 'orange',
  };
  return colors[status] || 'gray';
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function generateShareLink(proposalId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/view/${proposalId}`;
}
