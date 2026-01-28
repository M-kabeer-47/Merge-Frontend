export default function AnnouncementCardsSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border-[0.5px] border-light-border rounded-lg p-4 bg-background"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 w-full">
              {/* Avatar Skeleton */}
              <div className="w-10 h-10 rounded-full bg-gray-200" />

              <div className="flex-1 space-y-2">
                {/* Name & Role Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                {/* Time Skeleton */}
                <div className="h-3 bg-gray-200 rounded w-1/6" />
              </div>
            </div>
          </div>

          {/* Title Skeleton */}
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />

          {/* Content Skeleton */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          {/* Attachments Skeleton */}
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="h-8 w-32 bg-gray-200 rounded-md" />
            <div className="h-8 w-24 bg-gray-200 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
