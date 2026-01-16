"use client";

/**
 * Skeleton loader for the SubmissionsTable component.
 * Shows a loading state while submissions are being fetched.
 */
export default function SubmissionsTableSkeleton() {
  return (
    <div className="bg-background border border-light-border rounded-xl overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-light-border">
        <div className="h-6 w-48 bg-secondary/10 rounded" />
        <div className="h-9 w-32 bg-secondary/10 rounded" />
      </div>

      {/* Table */}
      <div className="px-4 py-4">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 mb-4 pb-3 border-b border-light-border">
          <div className="h-4 w-20 bg-secondary/10 rounded" />
          <div className="h-4 w-24 bg-secondary/10 rounded" />
          <div className="h-4 w-16 bg-secondary/10 rounded" />
          <div className="h-4 w-16 bg-secondary/10 rounded" />
          <div className="h-4 w-16 bg-secondary/10 rounded ml-auto" />
        </div>

        {/* Table Rows */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 py-3 border-b border-light-border/50 items-center"
          >
            {/* Student */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-secondary/10 rounded" />
                <div className="h-3 w-36 bg-secondary/10 rounded" />
              </div>
            </div>
            {/* Submitted */}
            <div className="h-4 w-24 bg-secondary/10 rounded" />
            {/* Status */}
            <div className="h-6 w-16 bg-secondary/10 rounded-full" />
            {/* Score */}
            <div className="h-8 w-20 bg-secondary/10 rounded" />
            {/* Details */}
            <div className="h-8 w-8 bg-secondary/10 rounded ml-auto" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 bg-secondary/10 rounded" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-secondary/10 rounded" />
            <div className="h-4 w-24 bg-secondary/10 rounded" />
            <div className="h-8 w-8 bg-secondary/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
