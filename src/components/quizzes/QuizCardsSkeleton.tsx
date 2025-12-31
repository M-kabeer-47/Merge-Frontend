export default function QuizCardsSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 animate-pulse">
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
  );
}
