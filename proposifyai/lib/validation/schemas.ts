/**
 * Zod Validation Schemas
 * Centralized schema definitions for API request validation
 */

import { z } from 'zod'

// ============================================================================
// Proposal Schemas
// ============================================================================

export const createProposalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().optional(),
  client_name: z.string().min(1, 'Client name is required').max(100),
  client_email: z.string().email('Invalid email address').optional(),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected']).default('draft'),
  is_public: z.boolean().default(false),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  expires_at: z.string().datetime().optional(),
})

export const updateProposalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  client_name: z.string().min(1).max(100).optional(),
  client_email: z.string().email().optional(),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected']).optional(),
  is_public: z.boolean().optional(),
  password: z.string().min(6).optional(),
  expires_at: z.string().datetime().optional(),
})

// ============================================================================
// Email Schemas
// ============================================================================

export const sendProposalEmailSchema = z.object({
  recipientEmail: z.string().email('Invalid recipient email'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  customMessage: z.string().max(500, 'Message too long').optional(),
  subject: z.string().max(200).optional(),
})

// ============================================================================
// Public Proposal Schemas
// ============================================================================

export const acceptProposalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  signature: z.string().min(1, 'Signature is required'),
  notes: z.string().max(1000, 'Notes too long').optional(),
  password: z.string().optional(),
})

export const rejectProposalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  reason: z.string().max(500, 'Reason too long').optional(),
  password: z.string().optional(),
})

// ============================================================================
// AI Schemas
// ============================================================================

export const generateContentSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(1000, 'Prompt too long'),
  tone: z.enum(['professional', 'casual', 'formal', 'friendly']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  industry: z.string().max(50).optional(),
  additionalContext: z.string().max(500).optional(),
})

export const modifyTextSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text too long'),
  instruction: z.string().min(5, 'Instruction must be at least 5 characters').max(200),
  tone: z.enum(['professional', 'casual', 'formal', 'friendly']).optional(),
})

export const scrapeWebsiteSchema = z.object({
  url: z.string().url('Invalid URL'),
  focusAreas: z.array(z.string()).optional(),
})

// ============================================================================
// Saved Content Schemas
// ============================================================================

export const createSavedContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required').max(10000),
  category: z.enum(['introduction', 'terms', 'pricing', 'clause', 'other']).default('other'),
  tags: z.array(z.string()).optional(),
})

export const updateSavedContentSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(10000).optional(),
  category: z.enum(['introduction', 'terms', 'pricing', 'clause', 'other']).optional(),
  tags: z.array(z.string()).optional(),
})

// ============================================================================
// Formatting Preferences Schemas
// ============================================================================

export const formattingPreferencesSchema = z.object({
  font_family: z.string().max(50).optional(),
  font_size: z.number().min(8).max(72).optional(),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  spacing: z.enum(['compact', 'normal', 'relaxed']).optional(),
  header_style: z.enum(['modern', 'classic', 'minimal']).optional(),
})

// ============================================================================
// Subscription Schemas
// ============================================================================

export const createCheckoutSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

// ============================================================================
// Analytics Schemas
// ============================================================================

export const trackProposalViewSchema = z.object({
  shareId: z.string().min(1),
  device: z.enum(['desktop', 'mobile', 'tablet']).optional(),
  browser: z.string().max(50).optional(),
  referrer: z.string().url().optional(),
})

// ============================================================================
// Common/Utility Schemas
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  filters: z.record(z.string(), z.string()).optional(),
})

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export const shareIdParamSchema = z.object({
  shareId: z.string().length(12, 'Invalid share ID'),
})

// ============================================================================
// Type Exports (for TypeScript inference)
// ============================================================================

export type CreateProposalInput = z.infer<typeof createProposalSchema>
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>
export type SendProposalEmailInput = z.infer<typeof sendProposalEmailSchema>
export type AcceptProposalInput = z.infer<typeof acceptProposalSchema>
export type RejectProposalInput = z.infer<typeof rejectProposalSchema>
export type GenerateContentInput = z.infer<typeof generateContentSchema>
export type ModifyTextInput = z.infer<typeof modifyTextSchema>
export type ScrapeWebsiteInput = z.infer<typeof scrapeWebsiteSchema>
export type CreateSavedContentInput = z.infer<typeof createSavedContentSchema>
export type UpdateSavedContentInput = z.infer<typeof updateSavedContentSchema>
export type FormattingPreferencesInput = z.infer<typeof formattingPreferencesSchema>
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>
export type TrackProposalViewInput = z.infer<typeof trackProposalViewSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>
