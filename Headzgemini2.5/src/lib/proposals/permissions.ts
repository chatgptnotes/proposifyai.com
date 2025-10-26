import bcrypt from 'bcryptjs';
import { Proposal } from './validation';

// Permission types
export enum PermissionLevel {
  OWNER = 'owner',
  VIEWER = 'viewer',
  NONE = 'none',
}

// Check if user owns the proposal
export function isProposalOwner(proposal: Proposal, userId: string): boolean {
  return proposal.userId === userId;
}

// Check if user can view the proposal
export function canView(proposal: Proposal, userId?: string): boolean {
  // Owner can always view
  if (userId && isProposalOwner(proposal, userId)) {
    return true;
  }

  // Public proposals can be viewed by anyone
  if (proposal.sharedLink) {
    return true;
  }

  return false;
}

// Check if user can edit the proposal
export function canEdit(proposal: Proposal, userId: string): boolean {
  return isProposalOwner(proposal, userId);
}

// Check if user can delete the proposal
export function canDelete(proposal: Proposal, userId: string): boolean {
  return isProposalOwner(proposal, userId);
}

// Check if user can share the proposal
export function canShare(proposal: Proposal, userId: string): boolean {
  return isProposalOwner(proposal, userId);
}

// Check if user can send the proposal via email
export function canSendEmail(proposal: Proposal, userId: string): boolean {
  return isProposalOwner(proposal, userId);
}

// Get user permission level
export function getPermissionLevel(proposal: Proposal, userId?: string): PermissionLevel {
  if (userId && isProposalOwner(proposal, userId)) {
    return PermissionLevel.OWNER;
  }

  if (proposal.sharedLink) {
    return PermissionLevel.VIEWER;
  }

  return PermissionLevel.NONE;
}

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure share token
export function generateShareToken(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }

  return token;
}

// Validate access to proposal
export interface AccessValidation {
  canAccess: boolean;
  reason?: string;
  requiresPassword?: boolean;
}

export async function validateProposalAccess(
  proposal: Proposal,
  password?: string,
  userId?: string
): Promise<AccessValidation> {
  // Owner always has access
  if (userId && isProposalOwner(proposal, userId)) {
    return { canAccess: true };
  }

  // Check if proposal is expired
  if (proposal.expiresAt && new Date() > new Date(proposal.expiresAt)) {
    return {
      canAccess: false,
      reason: 'This proposal has expired',
    };
  }

  // Check if proposal is shared
  if (!proposal.sharedLink) {
    return {
      canAccess: false,
      reason: 'This proposal is not publicly accessible',
    };
  }

  // Check password protection
  if (proposal.isPasswordProtected) {
    if (!password) {
      return {
        canAccess: false,
        requiresPassword: true,
        reason: 'This proposal is password protected',
      };
    }

    if (proposal.password) {
      const isValid = await verifyPassword(password, proposal.password);
      if (!isValid) {
        return {
          canAccess: false,
          requiresPassword: true,
          reason: 'Invalid password',
        };
      }
    }
  }

  return { canAccess: true };
}

// Rate limiting helper
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up expired rate limit records
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}
