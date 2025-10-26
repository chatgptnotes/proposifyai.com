'use client'

import Link from 'next/link'
import { ErrorBoundary } from './ErrorBoundary'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Error Boundary specifically for Dashboard components
 * Provides dashboard-specific error messaging and quick actions
 */
export function DashboardErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[600px] flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-yellow-600"
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
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Dashboard Temporarily Unavailable
                  </h3>
                  <p className="text-sm text-yellow-800 mb-4">
                    We&apos;re having trouble loading your dashboard. This is usually temporary.
                  </p>

                  {/* Quick Actions */}
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full inline-flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
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
                      Refresh Dashboard
                    </button>

                    <Link
                      href="/proposals"
                      className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-yellow-600 text-yellow-700 rounded-lg font-medium hover:bg-yellow-50 transition-colors"
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Proposals Instead
                    </Link>

                    <Link
                      href="/proposals/new"
                      className="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-yellow-600 text-yellow-700 rounded-lg font-medium hover:bg-yellow-50 transition-colors"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create New Proposal
                    </Link>
                  </div>

                  {/* Help Text */}
                  <p className="text-xs text-yellow-700">
                    If this problem persists, please{' '}
                    <a
                      href="mailto:support@proposifyai.com"
                      className="font-medium underline hover:text-yellow-900"
                    >
                      contact support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        // Log dashboard-specific errors
        console.error('Dashboard Error:', {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        })

        // In production, track dashboard errors separately
        // trackError('dashboard_error', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default DashboardErrorBoundary
