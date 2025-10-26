'use client';

export default function ProposalCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          {/* Client skeleton */}
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
        {/* Favorite button skeleton */}
        <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* Status badge skeleton */}
        <div className="h-6 bg-gray-100 rounded-full w-24"></div>
        {/* Copy button skeleton */}
        <div className="w-8 h-8 bg-gray-100 rounded"></div>
      </div>

      {/* Value skeleton */}
      <div className="mb-3">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Date skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-100 rounded w-48"></div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <div className="h-10 bg-gray-100 rounded flex-1"></div>
        <div className="h-10 bg-gray-100 rounded flex-1"></div>
      </div>
    </div>
  );
}

export function ProposalListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProposalCardSkeleton key={idx} />
      ))}
    </div>
  );
}
