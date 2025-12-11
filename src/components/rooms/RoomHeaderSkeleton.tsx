export default function RoomHeaderSkeleton() {
  return (
    <header className="bg-main-background border-b-[0.5px] border-light-border px-4 md:px-6 py-4 md:py-6 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            {/* Title skeleton */}
            <div className="h-8 md:h-9 lg:h-10 bg-gray-200 rounded w-64 md:w-80 mb-2" />
            {/* Participant count skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>

        {/* Header Actions skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-9 md:h-10 w-10 md:w-40 bg-gray-200 rounded" />
          <div className="h-9 md:h-10 w-10 md:w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </header>
  );
}
