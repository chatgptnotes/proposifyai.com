/**
 * Rate Limiting Middleware for API Routes
 * Protects API endpoints from abuse and ensures fair usage
 */

import { NextRequest, NextResponse } from 'next/server'

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limit tracking
// In production, use Redis or a distributed cache
const rateLimitStore: RateLimitStore = {}

/**
 * Rate Limiter Class
 */
export class RateLimiter {
  private interval: number
  private maxRequests: number

  constructor(config: RateLimitConfig) {
    this.interval = config.interval
    this.maxRequests = config.uniqueTokenPerInterval
  }

  /**
   * Check if request should be rate limited
   */
  async check(identifier: string): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
  }> {
    const now = Date.now()
    const key = identifier

    // Clean up expired entries
    this.cleanup(now)

    // Get or create entry
    if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + this.interval,
      }

      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: rateLimitStore[key].resetTime,
      }
    }

    // Check if limit exceeded
    if (rateLimitStore[key].count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: rateLimitStore[key].resetTime,
      }
    }

    // Increment count
    rateLimitStore[key].count++

    return {
      allowed: true,
      remaining: this.maxRequests - rateLimitStore[key].count,
      resetTime: rateLimitStore[key].resetTime,
    }
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup(now: number) {
    Object.keys(rateLimitStore).forEach((key) => {
      if (rateLimitStore[key].resetTime < now - this.interval) {
        delete rateLimitStore[key]
      }
    })
  }
}

/**
 * Get identifier for rate limiting (IP address or user ID)
 */
export function getIdentifier(request: NextRequest): string {
  // Try to get user ID from headers (if authenticated)
  const userId = request.headers.get('x-user-id')
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

  return `ip:${ip}`
}

/**
 * Rate limit middleware factory
 */
export function rateLimit(config: RateLimitConfig) {
  const limiter = new RateLimiter(config)

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const identifier = getIdentifier(request)
    const result = await limiter.check(identifier)

    // Add rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', config.uniqueTokenPerInterval.toString())
    headers.set('X-RateLimit-Remaining', result.remaining.toString())
    headers.set('X-RateLimit-Reset', result.resetTime.toString())

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'You have exceeded the rate limit. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            ...Object.fromEntries(headers.entries()),
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    return null // Allow request to proceed
  }
}

/**
 * Preset rate limit configurations
 */
export const RATE_LIMIT_PRESETS = {
  // Standard API endpoints - 100 requests per minute
  standard: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 100,
  },

  // Strict rate limit for sensitive endpoints - 10 requests per minute
  strict: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10,
  },

  // AI endpoints - 20 requests per minute
  ai: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 20,
  },

  // Public endpoints - 30 requests per minute per IP
  public: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30,
  },

  // Authentication endpoints - 5 requests per minute
  auth: {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 5,
  },
}

/**
 * Helper to apply rate limiting in API routes
 */
export async function applyRateLimit(
  request: NextRequest,
  config: RateLimitConfig = RATE_LIMIT_PRESETS.standard
): Promise<NextResponse | null> {
  const middleware = rateLimit(config)
  return middleware(request)
}
