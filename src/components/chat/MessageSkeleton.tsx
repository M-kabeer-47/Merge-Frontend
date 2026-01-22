import React from "react";

export default function MessageSkeleton({ isOwn }: { isOwn?: boolean }) {
  return (
    <div
      className={`flex items-end gap-3 py-3 px-4 max-w-2xl w-full ${isOwn ? "justify-end ml-auto" : ""}`}
    >
      {/* Avatar Skeleton */}
      {!isOwn && (
        <div className="w-10 h-10 rounded-full bg-secondary/10 flex-shrink-0" />
      )}
      {/* Message Bubble Skeleton */}
      <div
        className={`rounded-xl p-4 border border-light-border bg-background shadow-sm flex-1 min-w-0 animate-pulse ${isOwn ? "ml-auto" : ""}`}
      >
        {/* Header (Name/Meta) */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-24 bg-secondary/10 rounded" />
          <div className="h-3 w-12 bg-secondary/10 rounded" />
        </div>
        {/* Message Lines */}
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-secondary/10 rounded" />
          <div className="h-4 w-2/3 bg-secondary/10 rounded" />
        </div>
      </div>
    </div>
  );
}
