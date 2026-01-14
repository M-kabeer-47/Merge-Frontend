/**
 * Skeleton loading state for the quiz review page.
 * Matches the layout of QuizReviewClient with header, question area, and navigator sidebar.
 */
export default function QuizReviewSkeleton() {
  return (
    <div className="min-h-screen bg-main-background flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-light-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left - Back button and title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg" />
            <div className="space-y-1">
              <div className="h-5 w-48 bg-secondary/20 rounded" />
              <div className="h-3 w-24 bg-secondary/10 rounded" />
            </div>
          </div>

          {/* Right - Score badge */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-success/20 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Question Display Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Question Number Badge */}
            <div className="h-6 w-28 bg-secondary/20 rounded-full" />

            {/* Question Text */}
            <div className="space-y-2">
              <div className="h-6 w-full bg-secondary/20 rounded" />
              <div className="h-6 w-3/4 bg-secondary/20 rounded" />
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-background border border-light-border rounded-xl"
                >
                  <div className="w-5 h-5 bg-secondary/20 rounded-full flex-shrink-0" />
                  <div className="h-5 w-full bg-secondary/10 rounded" />
                </div>
              ))}
            </div>

            {/* Result indicator placeholder */}
            <div className="flex items-center gap-2 pt-2">
              <div className="w-5 h-5 bg-secondary/20 rounded-full" />
              <div className="h-4 w-32 bg-secondary/10 rounded" />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-4">
              <div className="h-10 w-24 bg-secondary/20 rounded-lg" />
              <div className="h-10 w-24 bg-secondary/20 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Navigator Sidebar Skeleton */}
        <aside className="w-full lg:w-[280px] border-t lg:border-t-0 lg:border-l border-light-border bg-background p-4 lg:p-6">
          <div className="space-y-4">
            {/* Sidebar Header */}
            <div className="h-5 w-32 bg-secondary/20 rounded" />

            {/* Question Grid */}
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-secondary/10 rounded-lg" />
              ))}
            </div>

            {/* Legend */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success/20 rounded" />
                <div className="h-3 w-16 bg-secondary/10 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive/20 rounded" />
                <div className="h-3 w-16 bg-secondary/10 rounded" />
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
