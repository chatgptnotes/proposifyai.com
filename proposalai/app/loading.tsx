export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-white font-bold text-4xl">P</span>
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600"></div>
        </div>

        {/* Loading Text */}
        <p className="text-xl text-gray-600 font-medium animate-pulse">
          Loading your AI-powered proposals...
        </p>
      </div>
    </div>
  )
}
