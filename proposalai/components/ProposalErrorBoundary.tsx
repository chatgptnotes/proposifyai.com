'use client'

import Link from 'next/link'
import { ErrorBoundary } from './ErrorBoundary'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/**
 * Error Boundary specifically for Proposal-related components
 * Provides proposal-specific error messaging and recovery options
 */
export function ProposalErrorBoundary({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            {/* Error Icon */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg
                  className="w-10 h-10 text-white"
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
            </div>

            {/* Error Message */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Proposal Error
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We encountered an issue loading your proposal. This might be a temporary problem.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Reload Page
              </button>
              <Link
                href="/proposals"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
              >
                View All Proposals
              </Link>
            </div>

            {/* Help Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What can you do?
              </h3>
              <div className="text-left space-y-3 text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <p>Reload the page to try again</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <p>Check your internet connection</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <p>Clear your browser cache and cookies</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 mt-1">✓</span>
                  <p>Try accessing from a different browser</p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <p className="mt-8 text-sm text-gray-500 text-center">
              Still having issues?{' '}
              <a
                href="mailto:support@proposifyai.com"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        // Log proposal-specific errors
        console.error('Proposal Error:', {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        })

        // In production, send to error tracking service
        // trackError('proposal_error', error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ProposalErrorBoundary
