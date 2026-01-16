export default function RoomLayoutSkeleton() {
  return (
    <div className="flex flex-col h-full bg-main-background animate-pulse">
      {/* Room Header Skeleton */}
      <header className="bg-main-background border-b-[0.5px] border-light-border px-4 md:px-6 py-4 md:py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="min-w-0 flex-1 space-y-2">
              {/* Title skeleton */}
              <div className="h-6 md:h-7 lg:h-8 bg-secondary/10 rounded w-48 md:w-64" />
              {/* Participant count skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-secondary/10 rounded" />
                <div className="h-4 bg-secondary/10 rounded w-28" />
              </div>
            </div>
          </div>

          {/* Header Actions skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-9 md:h-10 w-10 md:w-40 bg-secondary/10 rounded-lg" />
            <div className="h-9 md:h-10 w-10 md:w-24 bg-secondary/10 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Tab Bar Skeleton */}
      <div className="bg-background">
        <div className="relative z-10 bg-main-background px-2 py-2">
          <nav className="relative overflow-x-auto">
            <div className="flex items-center relative min-w-max sm:min-w-0 justify-start gap-2 sm:gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 sm:gap-1 px-3 sm:px-4 py-3 min-w-[120px] h-[70px]"
                >
                  <div className="w-4 h-4 bg-secondary/10 rounded" />
                  <div className="h-4 w-16 bg-secondary/10 rounded hidden xs:block" />
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full bg-background p-6">
          <div className="space-y-4">
            {/* Content placeholder blocks */}
            <div className="h-[calc(100vh-200px)] bg-secondary/10 rounded-xl border border-light-border" />
          </div>
        </div>
      </main>
    </div>
  );
}
