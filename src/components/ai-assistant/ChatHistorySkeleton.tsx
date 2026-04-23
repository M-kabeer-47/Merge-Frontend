export default function ChatHistorySkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-3 py-2.5 rounded-lg animate-pulse">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-secondary/20 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-secondary/20 rounded w-3/4 mb-1.5" />
              <div className="h-3 bg-secondary/15 rounded w-full mb-1.5" />
              <div className="flex items-center gap-2">
                <div className="h-3 bg-secondary/10 rounded w-12" />
                <div className="h-3 bg-secondary/10 rounded w-14" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
