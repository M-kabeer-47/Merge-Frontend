export function GeneralSettingsFormSkeleton() {
  return (
    <div className="bg-background border border-light-border rounded-xl p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="h-6 w-48 bg-skeleton rounded mb-2" />
          <div className="h-4 w-64 bg-skeleton rounded" />
        </div>
        <div className="h-4 w-32 bg-skeleton rounded" />
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-5">
        {/* Title field */}
        <div>
          <div className="h-4 w-24 bg-skeleton rounded mb-2" />
          <div className="h-10 w-full bg-skeleton rounded" />
          <div className="h-3 w-48 bg-skeleton rounded mt-1.5" />
        </div>

        {/* Description field */}
        <div>
          <div className="h-4 w-32 bg-skeleton rounded mb-2" />
          <div className="h-24 w-full bg-skeleton rounded" />
          <div className="flex justify-between mt-1.5">
            <div className="h-3 w-64 bg-skeleton rounded" />
            <div className="h-3 w-16 bg-skeleton rounded" />
          </div>
        </div>

        {/* Tags field */}
        <div>
          <div className="h-4 w-16 bg-skeleton rounded mb-2" />
          <div className="h-10 w-full bg-skeleton rounded" />
          <div className="h-3 w-56 bg-skeleton rounded mt-1.5" />
        </div>
      </div>
    </div>
  );
}
