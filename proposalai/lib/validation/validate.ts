/**
 * Validation Utilities
 * Helper functions for validating API requests with Zod schemas
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: ValidationError[]
}

/**
 * Validate request body against a Zod schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      return {
        success: false,
        errors: zodError.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }
    }

    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    }
  }
}

/**
 * Validate query parameters against a Zod schema
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    const data = schema.parse(query)

    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      return {
        success: false,
        errors: zodError.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }
    }

    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    }
  }
}

/**
 * Validate URL parameters against a Zod schema
 */
export function validateParams<T>(
  params: Record<string, string>,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const data = schema.parse(params)

    return {
      success: true,
      data,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      return {
        success: false,
        errors: zodError.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }
    }

    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    }
  }
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(errors: ValidationError[]): NextResponse {
  return NextResponse.json(
    {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors,
    },
    { status: 400 }
  )
}

/**
 * Middleware-style validation wrapper for API routes
 * Returns null if validation passes, error response if it fails
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>,
  type: 'body' | 'query' = 'body'
): Promise<{ data?: T; error?: NextResponse }> {
  let result: ValidationResult<T>

  if (type === 'body') {
    result = await validateBody(request, schema)
  } else {
    result = validateQuery(request, schema)
  }

  if (!result.success) {
    return {
      error: validationErrorResponse(result.errors!),
    }
  }

  return {
    data: result.data,
  }
}

/**
 * Safe parse wrapper that returns typed data or null
 */
export function safeParse<T>(data: unknown, schema: z.ZodSchema<T>): T | null {
  try {
    return schema.parse(data)
  } catch (error) {
    return null
  }
}

/**
 * Validate data and throw on error (useful in service layer)
 */
export function validateOrThrow<T>(data: unknown, schema: z.ZodSchema<T>): T {
  return schema.parse(data)
}

/**
 * Partial validation - validate only provided fields
 * Note: For partial validation, use schemas defined with .optional() fields
 */
export function validatePartial<T>(
  data: unknown,
  schema: z.ZodSchema<T>
): ValidationResult<T> {
  try {
    const validData = schema.parse(data)

    return {
      success: true,
      data: validData,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      return {
        success: false,
        errors: zodError.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }
    }

    return {
      success: false,
      errors: [{ field: 'unknown', message: 'Validation failed' }],
    }
  }
}

/**
 * Validate array of items
 */
export function validateArray<T>(
  data: unknown[],
  schema: z.ZodSchema<T>
): ValidationResult<T[]> {
  const errors: ValidationError[] = []
  const validatedData: T[] = []

  data.forEach((item, index) => {
    try {
      validatedData.push(schema.parse(item))
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError
        zodError.issues.forEach((err) => {
          errors.push({
            field: `[${index}].${err.path.join('.')}`,
            message: err.message,
          })
        })
      }
    }
  })

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    }
  }

  return {
    success: true,
    data: validatedData,
  }
}

/**
 * Format Zod errors into user-friendly messages
 */
export function formatZodErrors(error: z.ZodError): string {
  return error.issues
    .map((err) => {
      const field = err.path.join('.')
      return `${field}: ${err.message}`
    })
    .join(', ')
}

/**
 * Custom error messages for common validation errors
 */
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  url: 'Please enter a valid URL',
  min: (min: number) => `Minimum ${min} characters required`,
  max: (max: number) => `Maximum ${max} characters allowed`,
  pattern: 'Invalid format',
  uuid: 'Invalid ID format',
  positive: 'Must be a positive number',
  integer: 'Must be a whole number',
}

// Note: Custom error messages are defined directly in schemas using .min(), .max(), .email(), etc.
// This provides better type safety and clearer error messages
