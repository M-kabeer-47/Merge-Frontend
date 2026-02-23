export default function ChatLoadingSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* User message skeleton */}
        <div className="flex gap-3 flex-row-reverse animate-pulse">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/20" />
          <div className="max-w-[85%]">
            <div className="rounded-2xl px-4 py-3 bg-secondary/10 space-y-2">
              <div className="h-4 w-48 bg-secondary/20 rounded" />
              <div className="h-4 w-32 bg-secondary/20 rounded" />
            </div>
          </div>
        </div>
        {/* Assistant message skeleton */}
        <div className="flex gap-3 animate-pulse">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/20" />
          <div className="max-w-[85%]">
            <div className="rounded-2xl px-4 py-3 bg-secondary/10 space-y-2">
              <div className="h-4 w-64 bg-secondary/20 rounded" />
              <div className="h-4 w-56 bg-secondary/20 rounded" />
              <div className="h-4 w-40 bg-secondary/20 rounded" />
            </div>
          </div>
        </div>
        {/* User message skeleton */}
        <div className="flex gap-3 flex-row-reverse animate-pulse">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/20" />
          <div className="max-w-[85%]">
            <div className="rounded-2xl px-4 py-3 bg-secondary/10 space-y-2">
              <div className="h-4 w-40 bg-secondary/20 rounded" />
            </div>
          </div>
        </div>
        {/* Assistant message skeleton */}
        <div className="flex gap-3 animate-pulse">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/20" />
          <div className="max-w-[85%]">
            <div className="rounded-2xl px-4 py-3 bg-secondary/10 space-y-2">
              <div className="h-4 w-72 bg-secondary/20 rounded" />
              <div className="h-4 w-52 bg-secondary/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
