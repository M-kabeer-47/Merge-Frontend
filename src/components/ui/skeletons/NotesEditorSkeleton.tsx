"use client";

export default function NoteEditorSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-main-background animate-pulse">
      {/* Navbar Skeleton */}
      <div className="border-b border-light-border bg-background">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Left side - Back button */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg" />
            <div className="h-5 w-24 bg-secondary/10 rounded" />
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-20 bg-secondary/10 rounded-lg" />
            <div className="h-9 w-24 bg-secondary/10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Editor Content Skeleton */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-6 sm:px-14 py-8 overflow-y-auto">
          {/* Title Skeleton */}
          <div className="mb-8 space-y-3">
            <div className="h-12 bg-secondary/10 rounded-lg w-3/4" />
            <div className="h-12 bg-secondary/10 rounded-lg w-1/2" />
          </div>

          {/* Content Blocks Skeleton */}
          <div className="space-y-6 max-w-none">
            {/* Paragraph block */}
            <div className="space-y-2">
              <div className="h-5 bg-secondary/10 rounded w-full" />
              <div className="h-5 bg-secondary/10 rounded w-11/12" />
              <div className="h-5 bg-secondary/10 rounded w-4/5" />
            </div>

            {/* Paragraph block */}
            <div className="space-y-2">
              <div className="h-5 bg-secondary/10 rounded w-full" />
              <div className="h-5 bg-secondary/10 rounded w-10/12" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
    </div>
  );
}
