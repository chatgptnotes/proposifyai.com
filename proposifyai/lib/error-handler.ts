/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling across the application
 */

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: Record<string, unknown>
}

export class ApplicationError extends Error {
  code: string
  statusCode: number
  details?: Record<string, unknown>

  constructor(message: string, code: string = 'UNKNOWN_ERROR', statusCode: number = 500, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApplicationError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}

/**
 * API Error Handler
 * Extracts meaningful error messages from API responses
 */
export function handleApiError(error: unknown): AppError {
  // Handle ApplicationError
  if (error instanceof ApplicationError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    }
  }

  // Handle standard Error
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    }
  }

  // Handle fetch/network errors
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const fetchError = error as { status: number; statusText?: string }
    return {
      message: fetchError.statusText || 'Network error',
      code: 'NETWORK_ERROR',
      statusCode: fetchError.status,
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
    }
  }

  // Fallback for unknown error types
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  }
}

/**
 * Error Logger
 * Logs errors with context in development, sends to service in production
 */
export function logError(
  context: string,
  error: unknown,
  additionalData?: Record<string, unknown>
) {
  const errorInfo = handleApiError(error)

  const logData = {
    context,
    timestamp: new Date().toISOString(),
    ...errorInfo,
    ...additionalData,
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, logData)
  } else {
    // In production, send to error tracking service
    // Example: Sentry, LogRocket, etc.
    // sendToErrorTrackingService(logData)
  }

  return errorInfo
}

/**
 * User-friendly error messages
 * Maps error codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'Network error. Please check your internet connection and try again.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You don&apos;t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again in a few minutes.',
  INTERNAL_ERROR: 'An internal error occurred. Please try again later.',
  TIMEOUT: 'The request timed out. Please try again.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
}

/**
 * Get User-Friendly Error Message
 * Returns a user-friendly message for the given error
 */
export function getUserFriendlyMessage(error: unknown): string {
  const appError = handleApiError(error)

  if (appError.code && ERROR_MESSAGES[appError.code]) {
    return ERROR_MESSAGES[appError.code]
  }

  return appError.message || 'An unexpected error occurred. Please try again.'
}

/**
 * API Error Response Handler
 * Handles errors in API routes and returns appropriate response
 */
export function apiErrorResponse(error: unknown) {
  const appError = handleApiError(error)

  // Log the error
  logError('API Error', error)

  return new Response(
    JSON.stringify({
      error: appError.message,
      code: appError.code,
      ...(process.env.NODE_ENV === 'development' && { details: appError.details }),
    }),
    {
      status: appError.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * Safe Async Error Handler
 * Wraps async functions with error handling
 */
export function safeAsync<T>(
  fn: () => Promise<T>,
  context: string
): Promise<{ data?: T; error?: AppError }> {
  return fn()
    .then((data) => ({ data }))
    .catch((error) => ({
      error: logError(context, error),
    }))
}

/**
 * Retry with Exponential Backoff
 * Retries failed operations with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Error Boundary Error Handler
 * Handles errors caught by error boundaries
 */
export function handleBoundaryError(
  error: Error,
  errorInfo: { componentStack: string }
) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error Boundary Error:', errorData)
  } else {
    // In production, send to error tracking service
    // sendToErrorTrackingService('boundary_error', errorData)
  }
}

/**
 * Form Validation Error Handler
 * Handles form validation errors
 */
export function handleValidationErrors(
  errors: Record<string, string[]>
): string {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('; ')

  return errorMessages || 'Validation failed'
}
