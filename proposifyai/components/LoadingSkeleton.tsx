interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
  count?: number
}

export default function LoadingSkeleton({
  className = '',
  variant = 'rectangular',
  width = 'w-full',
  height = 'h-4',
  count = 1,
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const items = Array.from({ length: count }, (_, i) => i)

  return (
    <>
      {items.map((index) => (
        <div
          key={index}
          className={`${baseClasses} ${variantClasses[variant]} ${width} ${height} ${className} ${
            index < count - 1 ? 'mb-3' : ''
          }`}
          style={{
            animation: 'shimmer 2s infinite',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  )
}

// Specialized skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <LoadingSkeleton height="h-6" width="w-3/4" className="mb-4" />
      <LoadingSkeleton height="h-4" count={3} className="mb-2" />
      <div className="flex gap-2 mt-6">
        <LoadingSkeleton height="h-10" width="w-24" />
        <LoadingSkeleton height="h-10" width="w-24" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-200">
      {Array.from({ length: columns }).map((_, i) => (
        <LoadingSkeleton key={i} height="h-5" width={i === 0 ? 'w-32' : 'w-full'} />
      ))}
    </div>
  )
}

export function ProposalCardSkeleton() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <LoadingSkeleton height="h-7" width="w-2/3" className="mb-3" />
          <LoadingSkeleton height="h-4" width="w-full" count={2} />
        </div>
        <LoadingSkeleton variant="circular" width="w-12" height="h-12" />
      </div>
      <div className="flex gap-4 mb-4">
        <LoadingSkeleton height="h-6" width="w-24" />
        <LoadingSkeleton height="h-6" width="w-32" />
      </div>
      <div className="flex gap-3 mt-6">
        <LoadingSkeleton height="h-10" width="w-32" />
        <LoadingSkeleton height="h-10" width="w-28" />
      </div>
    </div>
  )
}
