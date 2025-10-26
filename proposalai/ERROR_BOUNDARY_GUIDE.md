# Error Boundary Implementation Guide

**Project:** Proposify AI
**Version:** 2.8.0
**Date:** October 26, 2025

---

## 📋 Overview

Error boundaries are implemented throughout the application to provide graceful error handling and better user experience when JavaScript errors occur.

---

## 🎯 Components Created

### 1. Base Error Boundary
**File:** `components/ErrorBoundary.tsx`

Generic error boundary component that can be used anywhere in the application.

**Features:**
- Catches JavaScript errors in child components
- Provides default fallback UI
- Supports custom fallback components
- Automatic error logging
- Development vs production error display
- Reset functionality
- Reset keys for automatic recovery

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// With error handler
<ErrorBoundary
  onError={(error, errorInfo) => {
    console.log('Custom error handler', error)
  }}
>
  <YourComponent />
</ErrorBoundary>

// With reset keys
<ErrorBoundary resetKeys={[userId, proposalId]}>
  <YourComponent />
</ErrorBoundary>
```

### 2. Proposal Error Boundary
**File:** `components/ProposalErrorBoundary.tsx`

Specialized error boundary for proposal-related components with proposal-specific messaging and recovery options.

**Features:**
- Full-page error UI matching app design
- Proposal-specific error messages
- Quick recovery actions (reload, view proposals, contact support)
- Helpful troubleshooting steps

**Usage:**
```tsx
import { ProposalErrorBoundary } from '@/components/ProposalErrorBoundary'

// In proposal pages
<ProposalErrorBoundary>
  <ProposalEditor />
</ProposalErrorBoundary>
```

### 3. Dashboard Error Boundary
**File:** `components/DashboardErrorBoundary.tsx`

Specialized error boundary for dashboard components with dashboard-specific quick actions.

**Features:**
- Compact error UI for dashboard contexts
- Quick action buttons (refresh, view proposals, create new)
- User-agent logging for debugging
- Dashboard-specific error tracking

**Usage:**
```tsx
import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary'

// In dashboard page
<DashboardErrorBoundary>
  <DashboardContent />
</DashboardErrorBoundary>
```

### 4. Form Error Boundary
**File:** `components/FormErrorBoundary.tsx`

Specialized error boundary for form components that helps preserve user data.

**Features:**
- Form-specific error messaging
- Data preservation hints
- Form name tracking
- Reload with form recovery suggestion

**Usage:**
```tsx
import { FormErrorBoundary } from '@/components/FormErrorBoundary'

<FormErrorBoundary formName="Proposal Creation Form">
  <ProposalForm />
</FormErrorBoundary>
```

### 5. Error Handler Utilities
**File:** `lib/error-handler.ts`

Centralized error handling utilities for consistent error management.

**Functions:**

#### `handleApiError(error: unknown): AppError`
Extracts meaningful error information from any error type.

```tsx
import { handleApiError } from '@/lib/error-handler'

try {
  await fetch('/api/proposals')
} catch (error) {
  const appError = handleApiError(error)
  console.log(appError.message, appError.code, appError.statusCode)
}
```

#### `logError(context: string, error: unknown, additionalData?: Record<string, unknown>): AppError`
Logs errors with context. In development, logs to console. In production, sends to error tracking service.

```tsx
import { logError } from '@/lib/error-handler'

try {
  await saveProposal(data)
} catch (error) {
  logError('Save Proposal', error, { proposalId, userId })
}
```

#### `getUserFriendlyMessage(error: unknown): string`
Returns user-friendly error messages.

```tsx
import { getUserFriendlyMessage } from '@/lib/error-handler'

try {
  await apiCall()
} catch (error) {
  toast.error(getUserFriendlyMessage(error))
}
```

#### `apiErrorResponse(error: unknown): Response`
Handles errors in API routes and returns appropriate response.

```tsx
import { apiErrorResponse } from '@/lib/error-handler'

// In API route
export async function POST(request: Request) {
  try {
    // API logic
  } catch (error) {
    return apiErrorResponse(error)
  }
}
```

#### `safeAsync<T>(fn: () => Promise<T>, context: string): Promise<{ data?: T; error?: AppError }>`
Wraps async functions with error handling.

```tsx
import { safeAsync } from '@/lib/error-handler'

const { data, error } = await safeAsync(
  () => fetchProposal(id),
  'Fetch Proposal'
)

if (error) {
  // Handle error
} else {
  // Use data
}
```

#### `retryWithBackoff<T>(fn: () => Promise<T>, maxRetries?: number, initialDelay?: number): Promise<T>`
Retries failed operations with exponential backoff.

```tsx
import { retryWithBackoff } from '@/lib/error-handler'

const data = await retryWithBackoff(
  () => fetch('/api/proposals').then(r => r.json()),
  3,    // max retries
  1000  // initial delay (ms)
)
```

#### `handleBoundaryError(error: Error, errorInfo: { componentStack: string })`
Handles errors caught by error boundaries.

```tsx
// Automatically called by ErrorBoundary components
// Can be used in custom error boundaries
```

#### `handleValidationErrors(errors: Record<string, string[]>): string`
Handles form validation errors.

```tsx
import { handleValidationErrors } from '@/lib/error-handler'

const validationErrors = {
  email: ['Invalid email format'],
  password: ['Too short', 'Missing special character']
}

const message = handleValidationErrors(validationErrors)
// "email: Invalid email format; password: Too short, Missing special character"
```

---

## 📱 Built-in Next.js Error Handling

### app/error.tsx
Global error boundary for the entire application (already exists).

**When it's used:**
- Errors in page components
- Errors in layouts
- Errors in server components

### app/not-found.tsx
404 error page (already exists).

**When it's used:**
- Page not found
- Invalid routes

---

## 🎨 Error Boundary Patterns

### Pattern 1: Granular Error Boundaries
Wrap individual components with specific error boundaries.

```tsx
export default function ProposalPage() {
  return (
    <div>
      <ProposalErrorBoundary>
        <ProposalHeader />
      </ProposalErrorBoundary>

      <DashboardErrorBoundary>
        <ProposalStats />
      </DashboardErrorBoundary>

      <FormErrorBoundary formName="Proposal Editor">
        <ProposalEditor />
      </FormErrorBoundary>
    </div>
  )
}
```

### Pattern 2: Page-Level Error Boundaries
Wrap entire page content.

```tsx
export default function Dashboard() {
  return (
    <DashboardErrorBoundary>
      <DashboardLayout>
        <DashboardStats />
        <ProposalList />
        <RecentActivity />
      </DashboardLayout>
    </DashboardErrorBoundary>
  )
}
```

### Pattern 3: Layout-Level Error Boundaries
Wrap specific sections of a layout.

```tsx
export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
      <main>
        {children}
      </main>
    </div>
  )
}
```

### Pattern 4: Nested Error Boundaries
Multiple levels for different contexts.

```tsx
<DashboardErrorBoundary>
  <DashboardLayout>
    <ProposalErrorBoundary>
      <ProposalSection>
        <FormErrorBoundary formName="Quick Create">
          <QuickCreateForm />
        </FormErrorBoundary>
      </ProposalSection>
    </ProposalErrorBoundary>
  </DashboardLayout>
</DashboardErrorBoundary>
```

---

## 🔧 Integration Examples

### Example 1: Wrap Proposal Editor
```tsx
// app/proposals/[id]/page.tsx
import { ProposalErrorBoundary } from '@/components/ProposalErrorBoundary'
import ProposalEditor from '@/components/ProposalEditor'

export default function ProposalPage({ params }: { params: { id: string } }) {
  return (
    <ProposalErrorBoundary>
      <ProposalEditor proposalId={params.id} />
    </ProposalErrorBoundary>
  )
}
```

### Example 2: Wrap Dashboard with Reset Keys
```tsx
// app/dashboard/page.tsx
import { DashboardErrorBoundary } from '@/components/DashboardErrorBoundary'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string>()

  return (
    <ErrorBoundary resetKeys={[userId]}>
      <DashboardErrorBoundary>
        <DashboardContent userId={userId} />
      </DashboardErrorBoundary>
    </ErrorBoundary>
  )
}
```

### Example 3: API Error Handling
```tsx
// app/api/proposals/[id]/route.ts
import { apiErrorResponse, ApplicationError } from '@/lib/error-handler'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const proposal = await getProposal(params.id)

    if (!proposal) {
      throw new ApplicationError(
        'Proposal not found',
        'NOT_FOUND',
        404
      )
    }

    return Response.json(proposal)
  } catch (error) {
    return apiErrorResponse(error)
  }
}
```

### Example 4: Form with Error Handling
```tsx
// components/ProposalForm.tsx
import { FormErrorBoundary } from '@/components/FormErrorBoundary'
import { getUserFriendlyMessage } from '@/lib/error-handler'
import toast from 'react-hot-toast'

export default function ProposalForm() {
  const handleSubmit = async (data: FormData) => {
    try {
      await saveProposal(data)
      toast.success('Proposal saved!')
    } catch (error) {
      toast.error(getUserFriendlyMessage(error))
    }
  }

  return (
    <FormErrorBoundary formName="Proposal Form">
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </FormErrorBoundary>
  )
}
```

---

## 🧪 Testing Error Boundaries

### Development Test Component
```tsx
// components/ErrorTest.tsx (for development only)
'use client'

import { useState } from 'react'

export function ErrorTest() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('Test error boundary!')
  }

  return (
    <button
      onClick={() => setShouldError(true)}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      Trigger Error (Dev Only)
    </button>
  )
}
```

### Testing in Development
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorTest } from '@/components/ErrorTest'

<ErrorBoundary>
  <ErrorTest />
</ErrorBoundary>
```

---

## 📊 Error Tracking Integration

### Sentry Integration Example
```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs'

export function initErrorTracking() {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    })
  }
}

export function trackError(
  context: string,
  error: Error,
  additionalData?: Record<string, unknown>
) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      contexts: { custom: { context, ...additionalData } },
    })
  }
}
```

---

## ✅ Best Practices

### 1. Granular Boundaries
- Place error boundaries at meaningful component boundaries
- Don't wrap entire app in single boundary
- Allow errors to be caught at appropriate level

### 2. Meaningful Fallbacks
- Provide context-specific error messages
- Offer recovery actions
- Match app design and UX

### 3. Error Logging
- Always log errors with context
- Include timestamp and relevant IDs
- Send to error tracking service in production

### 4. User Experience
- Don't expose technical details to users
- Provide clear next steps
- Make recovery easy

### 5. Testing
- Test error boundaries in development
- Simulate various error scenarios
- Verify fallback UIs render correctly

---

## 🔍 Troubleshooting

### Error Boundaries Not Catching Errors

**Problem:** Error boundary not catching certain errors

**Common Causes:**
- Event handlers (not caught by error boundaries)
- Async code (promises, setTimeout)
- Server-side rendering errors
- Errors in error boundary itself

**Solutions:**
```tsx
// For event handlers - use try-catch
const handleClick = async () => {
  try {
    await riskyOperation()
  } catch (error) {
    logError('Button Click', error)
  }
}

// For async code - use error handlers
useEffect(() => {
  fetchData().catch(error => {
    logError('Fetch Data', error)
  })
}, [])

// For SSR errors - use error.tsx
// Already handled by Next.js
```

---

## 📚 Further Reading

**React Error Boundaries:**
- https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

**Next.js Error Handling:**
- https://nextjs.org/docs/app/building-your-application/routing/error-handling

**Error Tracking Services:**
- Sentry: https://sentry.io
- LogRocket: https://logrocket.com
- Bugsnag: https://www.bugsnag.com

---

## ✅ Implementation Checklist

### Phase 1: Core Components ✅
- [x] Create base ErrorBoundary component
- [x] Create ProposalErrorBoundary component
- [x] Create DashboardErrorBoundary component
- [x] Create FormErrorBoundary component
- [x] Create error handler utilities

### Phase 2: Integration (Manual)
- [ ] Wrap proposal pages with ProposalErrorBoundary
- [ ] Wrap dashboard with DashboardErrorBoundary
- [ ] Wrap forms with FormErrorBoundary
- [ ] Update API routes to use error handlers
- [ ] Add error tracking service integration

### Phase 3: Testing (Manual)
- [ ] Test each error boundary type
- [ ] Verify fallback UIs render correctly
- [ ] Test error logging
- [ ] Test recovery actions
- [ ] Test in production

---

**Version:** 1.0
**Date:** October 26, 2025
**Status:** Core components complete, integration pending

**Next Steps:**
1. Integrate error boundaries into existing pages
2. Update API routes to use error handlers
3. Set up error tracking service (Sentry/LogRocket)
4. Test all error scenarios
