# 📚 Proposify AI - API Documentation

**Version:** 2.8.0
**Base URL:** `https://proposifyai.com/api`
**Authentication:** Required for most endpoints (Supabase Auth)

---

## 🔐 Authentication

All authenticated requests require a valid Supabase session token in the cookie or Authorization header.

```bash
# Cookie-based (automatic in browser)
Cookie: sb-access-token=<your-token>

# Header-based
Authorization: Bearer <your-token>
```

---

## 📋 Proposals API

### Get All Proposals
**Endpoint:** `GET /api/proposals`
**Auth:** Required
**Description:** Fetch all proposals for the authenticated user

**Response:**
```json
{
  "proposals": [
    {
      "id": "uuid",
      "title": "Q4 Marketing Proposal",
      "status": "draft",
      "created_at": "2025-10-26T12:00:00Z",
      "is_public": false,
      "share_id": null
    }
  ]
}
```

---

### Create Proposal
**Endpoint:** `POST /api/proposals`
**Auth:** Required
**Description:** Create a new proposal

**Request Body:**
```json
{
  "title": "New Proposal Title",
  "content": "<h1>Proposal Content</h1>",
  "client_name": "Acme Corp",
  "client_email": "client@acme.com"
}
```

**Response:**
```json
{
  "success": true,
  "proposal": {
    "id": "uuid",
    "title": "New Proposal Title",
    "status": "draft",
    "created_at": "2025-10-26T12:00:00Z"
  }
}
```

---

### Get Single Proposal
**Endpoint:** `GET /api/proposals/[id]`
**Auth:** Required
**Description:** Fetch a specific proposal by ID

**Response:**
```json
{
  "proposal": {
    "id": "uuid",
    "title": "Q4 Marketing Proposal",
    "content": "<h1>Content</h1>",
    "status": "sent",
    "is_public": true,
    "share_id": "ABC123DEF456",
    "created_at": "2025-10-26T12:00:00Z"
  }
}
```

---

### Update Proposal
**Endpoint:** `PUT /api/proposals/[id]`
**Auth:** Required
**Description:** Update an existing proposal

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "<h1>Updated Content</h1>",
  "status": "sent"
}
```

**Response:**
```json
{
  "success": true,
  "proposal": {
    "id": "uuid",
    "title": "Updated Title",
    "updated_at": "2025-10-26T13:00:00Z"
  }
}
```

---

### Delete Proposal
**Endpoint:** `DELETE /api/proposals/[id]`
**Auth:** Required
**Description:** Delete a proposal

**Response:**
```json
{
  "success": true,
  "message": "Proposal deleted successfully"
}
```

---

## 📧 Email API

### Send Proposal Email
**Endpoint:** `POST /api/proposals/[id]/send`
**Auth:** Required
**Description:** Send a proposal via email

**Request Body:**
```json
{
  "recipientEmail": "client@example.com",
  "recipientName": "John Doe",
  "customMessage": "Please review this proposal"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proposal sent successfully",
  "shareUrl": "https://proposifyai.com/p/ABC123DEF456"
}
```

---

## 🔓 Public Proposals API

### Get Public Proposal
**Endpoint:** `GET /api/proposals/public/[shareId]`
**Auth:** Not Required
**Description:** Fetch a publicly shared proposal

**Query Parameters:**
- `password` (optional): Password for password-protected proposals

**Response:**
```json
{
  "proposal": {
    "id": "uuid",
    "title": "Q4 Marketing Proposal",
    "content": "<h1>Content</h1>",
    "client_name": "Acme Corp",
    "status": "sent",
    "expires_at": "2025-11-26T12:00:00Z",
    "is_expired": false
  }
}
```

**Error Responses:**
```json
// Password required
{
  "error": "Password required",
  "requires_password": true
}

// Incorrect password
{
  "error": "Incorrect password"
}

// Expired
{
  "error": "This proposal has expired"
}
```

---

### Accept Proposal
**Endpoint:** `POST /api/proposals/public/[shareId]/accept`
**Auth:** Not Required
**Description:** Accept a public proposal

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "signature": "John Doe",
  "notes": "Looks great, let's proceed!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proposal accepted successfully"
}
```

---

### Reject Proposal
**Endpoint:** `POST /api/proposals/public/[shareId]/reject`
**Auth:** Not Required
**Description:** Reject a public proposal

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "reason": "Budget constraints"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Proposal rejected successfully"
}
```

---

## 📊 Analytics API

### Get Proposal Analytics
**Endpoint:** `GET /api/proposals/[id]/analytics`
**Auth:** Required
**Description:** Get analytics data for a proposal

**Response:**
```json
{
  "analytics": {
    "total_views": 42,
    "unique_visitors": 15,
    "average_time_spent": 180,
    "device_breakdown": {
      "desktop": 30,
      "mobile": 10,
      "tablet": 2
    },
    "browser_breakdown": {
      "Chrome": 25,
      "Safari": 12,
      "Firefox": 5
    },
    "recent_views": [
      {
        "viewed_at": "2025-10-26T14:30:00Z",
        "device": "desktop",
        "browser": "Chrome",
        "ip_address": "192.168.1.1"
      }
    ],
    "timeline": [
      {
        "date": "2025-10-26",
        "views": 15
      }
    ]
  },
  "actions": [
    {
      "action_type": "accepted",
      "actor_name": "John Doe",
      "actor_email": "john@example.com",
      "created_at": "2025-10-26T15:00:00Z"
    }
  ]
}
```

---

## 🤖 AI API

### Generate Proposal Content
**Endpoint:** `POST /api/ai/generate-content`
**Auth:** Required
**Description:** Generate AI-powered proposal content

**Request Body:**
```json
{
  "prompt": "Create a marketing proposal for a SaaS company",
  "tone": "professional",
  "length": "medium",
  "industry": "technology",
  "additionalContext": "Focus on B2B sales"
}
```

**Response:**
```json
{
  "success": true,
  "content": "<h1>Marketing Proposal</h1><p>Generated content...</p>",
  "metadata": {
    "tokens_used": 500,
    "model": "gpt-4"
  }
}
```

---

### Modify Text with AI
**Endpoint:** `POST /api/ai/modify-text`
**Auth:** Required
**Description:** Modify existing text using AI

**Request Body:**
```json
{
  "text": "Original text here",
  "instruction": "Make this more professional",
  "tone": "formal"
}
```

**Response:**
```json
{
  "success": true,
  "modifiedText": "Professional version of the text..."
}
```

---

### AI Website Scraping
**Endpoint:** `POST /api/ai/scrape-website`
**Auth:** Required
**Description:** Scrape and analyze a website for proposal context

**Request Body:**
```json
{
  "url": "https://example.com",
  "focusAreas": ["company_info", "services", "pain_points"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company_info": {
      "name": "Example Corp",
      "description": "Leading provider of..."
    },
    "services": ["Service 1", "Service 2"],
    "pain_points": ["Challenge 1", "Challenge 2"]
  }
}
```

---

## 🎨 Formatting Preferences API

### Get Formatting Preferences
**Endpoint:** `GET /api/formatting-preferences`
**Auth:** Required
**Description:** Get user's formatting preferences

**Response:**
```json
{
  "preferences": {
    "id": "uuid",
    "font_family": "Inter",
    "font_size": 16,
    "primary_color": "#3b82f6",
    "secondary_color": "#6366f1",
    "spacing": "normal"
  }
}
```

---

### Update Formatting Preferences
**Endpoint:** `PUT /api/formatting-preferences`
**Auth:** Required
**Description:** Update formatting preferences

**Request Body:**
```json
{
  "font_family": "Roboto",
  "font_size": 18,
  "primary_color": "#10b981"
}
```

**Response:**
```json
{
  "success": true,
  "preferences": {
    "font_family": "Roboto",
    "font_size": 18,
    "primary_color": "#10b981"
  }
}
```

---

## 💾 Saved Content API

### Get Saved Content
**Endpoint:** `GET /api/saved-content`
**Auth:** Required
**Description:** Get all saved content snippets

**Response:**
```json
{
  "content": [
    {
      "id": "uuid",
      "title": "Company Introduction",
      "content": "We are a leading...",
      "category": "introduction",
      "created_at": "2025-10-26T12:00:00Z"
    }
  ]
}
```

---

### Create Saved Content
**Endpoint:** `POST /api/saved-content`
**Auth:** Required
**Description:** Save a content snippet for reuse

**Request Body:**
```json
{
  "title": "Payment Terms",
  "content": "Net 30 payment terms...",
  "category": "terms"
}
```

**Response:**
```json
{
  "success": true,
  "content": {
    "id": "uuid",
    "title": "Payment Terms",
    "created_at": "2025-10-26T12:00:00Z"
  }
}
```

---

## 💳 Subscriptions API

### Get Current Subscription
**Endpoint:** `GET /api/subscriptions/current`
**Auth:** Required
**Description:** Get user's current subscription details

**Response:**
```json
{
  "subscription": {
    "tier": "professional",
    "status": "active",
    "billing_period": "monthly",
    "amount": 99.00,
    "next_billing_date": "2025-11-26",
    "features": {
      "proposals_limit": -1,
      "ai_generations_limit": -1,
      "email_tracking": true
    }
  }
}
```

---

### Get Usage Stats
**Endpoint:** `GET /api/subscriptions/usage`
**Auth:** Required
**Description:** Get current usage statistics

**Response:**
```json
{
  "usage": {
    "proposals_created": 45,
    "proposals_limit": -1,
    "emails_sent": 120,
    "ai_generations": 230,
    "storage_used_mb": 150
  }
}
```

---

## ⚠️ Error Responses

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional details"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | User doesn't have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 🔢 Rate Limiting

API endpoints are rate-limited to ensure fair usage:

- **Authenticated requests:** 100 requests per minute
- **Public endpoints:** 20 requests per minute per IP
- **AI endpoints:** 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698345600
```

---

## 📝 Webhooks (Coming Soon)

Subscribe to events:
- `proposal.created`
- `proposal.sent`
- `proposal.accepted`
- `proposal.rejected`
- `proposal.viewed`

---

## 🔗 SDKs & Libraries

### JavaScript/TypeScript
```bash
npm install @proposifyai/sdk
```

```typescript
import { ProposifyAI } from '@proposifyai/sdk'

const client = new ProposifyAI({
  apiKey: 'your-api-key'
})

const proposal = await client.proposals.create({
  title: 'New Proposal',
  content: 'Content here'
})
```

---

## 💡 Best Practices

1. **Authentication:** Always use environment variables for API keys
2. **Error Handling:** Implement retry logic with exponential backoff
3. **Rate Limiting:** Respect rate limits and implement queuing
4. **Caching:** Cache responses when appropriate
5. **Validation:** Validate data before sending requests

---

## 📞 Support

**Documentation:** https://proposifyai.com/docs
**API Status:** https://status.proposifyai.com
**Support Email:** api@proposifyai.com
**GitHub Issues:** https://github.com/proposifyai/issues

---

**Version:** 2.8.0
**Last Updated:** October 26, 2025
