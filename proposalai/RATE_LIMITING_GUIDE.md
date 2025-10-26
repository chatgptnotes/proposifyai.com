# Rate Limiting Implementation Guide

**Project:** Proposify AI
**Version:** 2.8.0
**Date:** October 26, 2025

---

## 📋 Overview

Rate limiting protects API endpoints from abuse, ensures fair usage, and prevents denial-of-service attacks. This guide explains how to implement and use rate limiting in Proposify AI.

---

## 🎯 What's Been Implemented

### 1. Rate Limiting Library
**File:** `lib/rate-limit.ts`

Comprehensive rate limiting system with:
- In-memory rate limit tracking
- Configurable intervals and limits
- Automatic cleanup of expired entries
- Rate limit headers in responses
- Multiple preset configurations

### 2. Security Headers
**File:** `middleware.ts` (updated)

Added security headers to all responses:
- `X-DNS-Prefetch-Control`
- `Strict-Transport-Security` (HSTS)
- `X-Frame-Options` (clickjacking protection)
- `X-Content-Type-Options` (MIME sniffing protection)
- `X-XSS-Protection`
- `Referrer-Policy`
- `Permissions-Policy`

---

## 🚀 Quick Start

### Basic Usage in API Route

```typescript
// app/api/proposals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.standard)
  if (rateLimitResponse) {
    return rateLimitResponse // Return 429 if rate limited
  }

  // Process request normally
  const proposals = await getProposals()
  return NextResponse.json(proposals)
}
```

---

## 📚 Available Rate Limit Presets

### 1. Standard (100 requests/minute)
**Use for:** Most API endpoints

```typescript
import { RATE_LIMIT_PRESETS } from '@/lib/rate-limit'

const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.standard)
```

### 2. Strict (10 requests/minute)
**Use for:** Sensitive operations (email sending, account changes)

```typescript
const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.strict)
```

### 3. AI (20 requests/minute)
**Use for:** AI endpoints (content generation, text modification)

```typescript
const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.ai)
```

### 4. Public (30 requests/minute)
**Use for:** Public endpoints (proposal views, public sharing)

```typescript
const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.public)
```

### 5. Auth (5 requests/minute)
**Use for:** Authentication endpoints (login, signup, password reset)

```typescript
const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.auth)
```

---

## 🔧 Custom Rate Limit Configuration

Create custom rate limits for specific needs:

```typescript
import { applyRateLimit } from '@/lib/rate-limit'

// Custom: 50 requests per 5 minutes
const customConfig = {
  interval: 5 * 60 * 1000, // 5 minutes in milliseconds
  uniqueTokenPerInterval: 50,
}

const rateLimitResponse = await applyRateLimit(request, customConfig)
```

---

## 📝 Implementation Examples

### Example 1: Protect Email Sending Endpoint

```typescript
// app/api/proposals/[id]/send/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit'
import { apiErrorResponse } from '@/lib/error-handler'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Apply strict rate limiting for email sending
  const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.strict)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()
    await sendProposalEmail(params.id, body)

    return NextResponse.json({
      success: true,
      message: 'Proposal sent successfully',
    })
  } catch (error) {
    return apiErrorResponse(error)
  }
}
```

### Example 2: Protect AI Content Generation

```typescript
// app/api/ai/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Apply AI rate limiting
  const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.ai)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  const body = await request.json()
  const content = await generateAIContent(body.prompt)

  return NextResponse.json({ content })
}
```

### Example 3: Public Proposal with Rate Limiting

```typescript
// app/api/proposals/public/[shareId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
) {
  // Apply public rate limiting (more lenient)
  const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.public)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  const proposal = await getPublicProposal(params.shareId)

  if (!proposal) {
    return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
  }

  return NextResponse.json({ proposal })
}
```

### Example 4: Authentication Endpoint

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { applyRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Apply strict auth rate limiting to prevent brute force
  const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.auth)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  const body = await request.json()
  const session = await login(body.email, body.password)

  return NextResponse.json({ session })
}
```

---

## 🔍 Rate Limit Headers

Every response includes rate limit headers:

```
X-RateLimit-Limit: 100          # Maximum requests allowed
X-RateLimit-Remaining: 95       # Requests remaining in current window
X-RateLimit-Reset: 1698345600   # Timestamp when limit resets
```

### When Rate Limited (429 Response):

```json
{
  "error": "Too many requests",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "You have exceeded the rate limit. Please try again later.",
  "retryAfter": 45
}
```

**Additional Headers:**
```
Retry-After: 45  # Seconds until reset
```

---

## 🎨 Client-Side Rate Limit Handling

### React/TypeScript Example

```typescript
async function makeApiRequest(endpoint: string) {
  try {
    const response = await fetch(endpoint)

    // Check rate limit headers
    const limit = response.headers.get('X-RateLimit-Limit')
    const remaining = response.headers.get('X-RateLimit-Remaining')
    const reset = response.headers.get('X-RateLimit-Reset')

    console.log(`Rate limit: ${remaining}/${limit} remaining`)

    if (response.status === 429) {
      const data = await response.json()
      const retryAfter = data.retryAfter || 60

      toast.error(`Too many requests. Please wait ${retryAfter} seconds.`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    return null
  }
}
```

### Automatic Retry with Exponential Backoff

```typescript
import { retryWithBackoff } from '@/lib/error-handler'

async function makeApiRequestWithRetry(endpoint: string) {
  return retryWithBackoff(
    async () => {
      const response = await fetch(endpoint)

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        throw new Error(`Rate limited. Retry after ${retryAfter}s`)
      }

      return response.json()
    },
    3,    // max retries
    1000  // initial delay
  )
}
```

---

## 🔐 Identifier Strategy

Rate limits are tracked per identifier:

### 1. Authenticated Users
**Identifier:** `user:{userId}`
- Tracks per user account
- More accurate than IP-based
- Survives IP changes

### 2. Anonymous Users
**Identifier:** `ip:{ipAddress}`
- Tracks per IP address
- Uses X-Forwarded-For header
- Falls back to X-Real-IP

### How It Works:

```typescript
// In rate-limit.ts
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
```

---

## 📊 Rate Limit Monitoring

### Log Rate Limit Events

```typescript
import { applyRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const rateLimitResponse = await applyRateLimit(request, RATE_LIMIT_PRESETS.standard)

  if (rateLimitResponse) {
    // Log rate limit hit for monitoring
    console.warn('Rate limit exceeded:', {
      endpoint: request.url,
      identifier: getIdentifier(request),
      timestamp: new Date().toISOString(),
    })

    return rateLimitResponse
  }

  // Continue with request
}
```

---

## 🚀 Production Considerations

### Using Redis for Distributed Rate Limiting

For production with multiple servers, replace in-memory store with Redis:

```typescript
// lib/rate-limit-redis.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export class RedisRateLimiter {
  async check(identifier: string): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
  }> {
    const key = `ratelimit:${identifier}`
    const now = Date.now()
    const window = 60000 // 1 minute

    // Use Redis sorted set for sliding window
    await redis.zremrangebyscore(key, 0, now - window)
    const count = await redis.zcard(key)

    if (count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + window,
      }
    }

    await redis.zadd(key, now, `${now}-${Math.random()}`)
    await redis.expire(key, 60)

    return {
      allowed: true,
      remaining: this.maxRequests - count - 1,
      resetTime: now + window,
    }
  }
}
```

### Environment-Specific Configuration

```typescript
// Use strict limits in production, lenient in development
const getRateLimitConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return RATE_LIMIT_PRESETS.standard
  } else {
    return {
      interval: 60 * 1000,
      uniqueTokenPerInterval: 1000, // Very lenient for development
    }
  }
}
```

---

## 🧪 Testing Rate Limits

### Test Script

```bash
#!/bin/bash
# test-rate-limit.sh

ENDPOINT="http://localhost:3000/api/proposals"

echo "Testing rate limit..."
for i in {1..105}; do
  echo "Request $i:"
  curl -s -w "\nStatus: %{http_code}\n" "$ENDPOINT" | grep -E "(error|Status)"
  sleep 0.1
done
```

### Development Testing

```typescript
// Temporarily reduce limits for testing
const testConfig = {
  interval: 10 * 1000, // 10 seconds
  uniqueTokenPerInterval: 5, // Only 5 requests
}

const rateLimitResponse = await applyRateLimit(request, testConfig)
```

---

## ⚠️ Common Issues

### Issue 1: Rate Limit Too Strict

**Problem:** Users getting rate limited during normal use

**Solution:**
- Increase `uniqueTokenPerInterval`
- Increase `interval` duration
- Use different presets for different endpoints

### Issue 2: Bypassing Rate Limits

**Problem:** Users bypassing rate limits by changing IP

**Solution:**
- Implement user-based rate limiting for authenticated users
- Add device fingerprinting
- Track and block suspicious patterns

### Issue 3: Memory Leaks

**Problem:** In-memory store growing indefinitely

**Solution:**
- Automatic cleanup runs on each check
- Switch to Redis for production
- Monitor memory usage

---

## 📚 Best Practices

### 1. Choose Appropriate Limits
- **Standard endpoints:** 100/minute
- **AI/expensive operations:** 20/minute
- **Authentication:** 5/minute
- **Public views:** 30/minute

### 2. Return Clear Error Messages
Always include:
- Error message
- Error code
- Retry-After header
- Remaining quota in headers

### 3. Monitor and Adjust
- Track rate limit hits
- Adjust limits based on usage patterns
- Alert on suspicious activity

### 4. Differentiate Users
- More lenient limits for authenticated users
- Stricter limits for anonymous users
- Premium tier with higher limits

### 5. Document Limits
- Include limits in API documentation
- Show limits in developer dashboard
- Notify users before they hit limits

---

## ✅ Implementation Checklist

### Phase 1: Core Implementation ✅
- [x] Create rate limiter library
- [x] Add rate limit presets
- [x] Implement identifier strategy
- [x] Add rate limit headers
- [x] Add security headers to middleware

### Phase 2: API Integration (Manual)
- [ ] Add rate limiting to all API routes
- [ ] Test rate limits on each endpoint
- [ ] Update API documentation with limits
- [ ] Add rate limit monitoring

### Phase 3: Production (Future)
- [ ] Switch to Redis for distributed limiting
- [ ] Set up rate limit monitoring dashboard
- [ ] Add alerts for rate limit abuse
- [ ] Implement tier-based rate limits

---

## 📊 Recommended Rate Limits by Endpoint

| Endpoint Type | Preset | Requests/Min | Reasoning |
|--------------|---------|--------------|-----------|
| Proposal list | standard | 100 | High traffic, low cost |
| Proposal create | standard | 100 | Normal usage |
| Proposal update | standard | 100 | Normal usage |
| Email sending | strict | 10 | Prevent spam |
| AI generation | ai | 20 | Expensive operations |
| Public views | public | 30 | Open access |
| Login/Signup | auth | 5 | Prevent brute force |
| Password reset | auth | 5 | Prevent abuse |
| Analytics | standard | 100 | Dashboard usage |

---

## 📞 Support

**For rate limiting issues:**
- Check rate limit headers in response
- Verify endpoint uses appropriate preset
- Test with reduced limits in development
- Monitor rate limit hits in logs

**Documentation:**
- This guide: `RATE_LIMITING_GUIDE.md`
- Error handling: `ERROR_BOUNDARY_GUIDE.md`
- API documentation: `API_DOCUMENTATION.md`

---

**Version:** 1.0
**Date:** October 26, 2025
**Status:** Core implementation complete, API integration pending

**Next Steps:**
1. Add rate limiting to existing API routes
2. Test all endpoints
3. Update API documentation
4. Consider Redis for production
