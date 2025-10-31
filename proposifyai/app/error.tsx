'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-3xl">!</span>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Oops!
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Don&apos;t worry, our AI is already working on fixing this. Please try again.
          </p>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6 text-left">
            <h3 className="font-semibold text-red-900 mb-2">Error Details:</h3>
            <p className="text-sm text-red-800 font-mono break-all">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
          >
            Go Home
          </a>
        </div>

        {/* Helpful Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What can you do?
          </h3>
          <div className="text-left space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">✓</span>
              <p>Click &quot;Try Again&quot; to reload the page</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">✓</span>
              <p>Clear your browser cache and cookies</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">✓</span>
              <p>Try a different browser or device</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">✓</span>
              <p>Check back in a few minutes</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <p className="mt-8 text-sm text-gray-500">
          Problem persisting?{' '}
          <a href="mailto:support@proposifyai.com" className="text-primary-600 hover:text-primary-700 font-medium">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  )
}
