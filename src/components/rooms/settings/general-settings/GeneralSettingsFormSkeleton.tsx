export function GeneralSettingsFormSkeleton() {
  return (
    <div className="bg-background border border-light-border rounded-xl p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-secondary/10 rounded" />
          <div className="h-4 w-64 bg-secondary/10 rounded" />
        </div>
        <div className="h-4 w-32 bg-secondary/10 rounded" />
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-5">
        {/* Title field */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-secondary/10 rounded" />
          <div className="h-10 w-full bg-secondary/10 rounded-lg" />
          <div className="h-3 w-48 bg-secondary/10 rounded" />
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-secondary/10 rounded" />
          <div className="h-24 w-full bg-secondary/10 rounded-lg" />
          <div className="flex justify-between">
            <div className="h-3 w-64 bg-secondary/10 rounded" />
            <div className="h-3 w-16 bg-secondary/10 rounded" />
          </div>
        </div>

        {/* Tags field */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-secondary/10 rounded" />
          <div className="h-10 w-full bg-secondary/10 rounded-lg" />
          <div className="h-3 w-56 bg-secondary/10 rounded" />
        </div>
      </div>
    </div>
  );
}
