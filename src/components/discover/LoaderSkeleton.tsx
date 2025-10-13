"use client";

export default function LoaderSkeleton() {
  return (
    <div className="bg-background border border-light-border rounded-xl p-5 shadow-sm animate-pulse">
      {/* Thumbnail */}
      <div className="w-full h-40 bg-secondary/10 rounded-lg mb-4" />

      {/* Creator */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-secondary/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary/10 rounded w-32" />
          <div className="h-3 bg-secondary/10 rounded w-24" />
        </div>
      </div>

      {/* Title */}
      <div className="h-6 bg-secondary/10 rounded w-3/4 mb-2" />

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-secondary/10 rounded w-full" />
        <div className="h-3 bg-secondary/10 rounded w-5/6" />
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-secondary/10 rounded-full w-20" />
        <div className="h-6 bg-secondary/10 rounded-full w-16" />
        <div className="h-6 bg-secondary/10 rounded-full w-24" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-light-border">
        <div className="h-4 bg-secondary/10 rounded w-24" />
        <div className="flex gap-2">
          <div className="h-10 bg-secondary/10 rounded w-24" />
          <div className="h-10 bg-secondary/10 rounded w-20" />
        </div>
      </div>
    </div>
  );
}
