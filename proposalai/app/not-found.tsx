import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-3xl">P</span>
          </div>
        </div>

        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Looks like this proposal got lost in the AI cloud. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Helpful Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:border-primary-600 hover:text-primary-600 transition-all duration-200"
          >
            View Dashboard
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Looking for something specific?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/proposals"
              className="text-primary-600 hover:text-primary-700 font-medium transition"
            >
              My Proposals
            </Link>
            <Link
              href="/proposals/new"
              className="text-primary-600 hover:text-primary-700 font-medium transition"
            >
              New Proposal
            </Link>
            <Link
              href="/templates"
              className="text-primary-600 hover:text-primary-700 font-medium transition"
            >
              Templates
            </Link>
            <Link
              href="/settings"
              className="text-primary-600 hover:text-primary-700 font-medium transition"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <p className="mt-8 text-sm text-gray-500">
          Still can&apos;t find what you&apos;re looking for?{' '}
          <a href="mailto:support@proposifyai.com" className="text-primary-600 hover:text-primary-700 font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  )
}
