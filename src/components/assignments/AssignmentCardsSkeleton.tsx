export default function AssignmentCardsSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-background border border-light-border rounded-xl p-4 sm:p-5 space-y-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-secondary/10 rounded w-3/4" />
              <div className="h-4 bg-secondary/10 rounded w-1/2" />
            </div>
            <div className="h-6 w-20 bg-secondary/10 rounded-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-secondary/10 rounded w-full" />
            <div className="h-4 bg-secondary/10 rounded w-5/6" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <div className="h-4 bg-secondary/10 rounded w-24" />
              <div className="h-4 bg-secondary/10 rounded w-20" />
            </div>
            <div className="h-9 w-32 bg-secondary/10 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
