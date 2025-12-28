"use client";

export default function QuizzesSkeleton() {
  return (
    <div className="h-full flex flex-col bg-main-background animate-pulse">
      {/* Header Skeleton */}
      <div className="px-4 sm:px-6 py-4 border-b border-light-border space-y-4">
        {/* Search and Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <div className="h-10 bg-secondary/10 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-32 bg-secondary/10 rounded-lg" />
            <div className="h-9 w-28 bg-secondary/10 rounded-lg" />
          </div>
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex gap-2 max-w-[400px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 bg-secondary/10 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Quiz Cards Skeleton */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-background border border-light-border rounded-xl p-4 space-y-3"
          >
            {/* Title */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 w-3/4 bg-secondary/10 rounded" />
                <div className="h-4 w-1/2 bg-secondary/10 rounded" />
              </div>
              <div className="h-6 w-20 bg-secondary/10 rounded-full" />
            </div>

            {/* Details */}
            <div className="flex items-center gap-4">
              <div className="h-4 w-24 bg-secondary/10 rounded" />
              <div className="h-4 w-24 bg-secondary/10 rounded" />
              <div className="h-4 w-24 bg-secondary/10 rounded" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <div className="h-8 w-20 bg-secondary/10 rounded-lg" />
              <div className="h-8 w-20 bg-secondary/10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
