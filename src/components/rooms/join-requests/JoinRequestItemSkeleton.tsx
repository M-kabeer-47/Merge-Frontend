/**
 * Skeleton loader for JoinRequestItem
 */
export default function JoinRequestItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border border-light-border rounded-lg bg-background animate-pulse">
      {/* Avatar and text skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary/20" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-secondary/20 rounded" />
          <div className="h-3 w-48 bg-secondary/20 rounded" />
          <div className="h-3 w-20 bg-secondary/20 rounded" />
        </div>
      </div>

      {/* Button skeletons */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-secondary/20 rounded" />
        <div className="h-8 w-20 bg-secondary/20 rounded" />
      </div>
    </div>
  );
}
