'use client'

import { ErrorBoundary } from './ErrorBoundary'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  formName?: string
}

/**
 * Error Boundary specifically for Form components
 * Provides form-specific error messaging and preserves user data when possible
 */
export function FormErrorBoundary({ children, formName = 'form' }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="w-full max-w-md mx-auto p-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-orange-900 mb-2">
                  Form Error
                </h3>
                <p className="text-sm text-orange-800 mb-4">
                  We encountered an issue with the {formName}. Your data may have been preserved.
                </p>

                {/* Recovery Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white text-sm rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Reload and Try Again
                  </button>

                  <p className="text-xs text-orange-700 text-center">
                    Check your browser&apos;s form recovery to restore your data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        // Log form-specific errors with form name
        console.error(`Form Error (${formName}):`, {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        })

        // In production, track form errors to identify problematic forms
        // trackError('form_error', error, { formName, ...errorInfo })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default FormErrorBoundary
