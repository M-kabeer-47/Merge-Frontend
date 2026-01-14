"use client";

/**
 * Skeleton loading state for the assignment detail page.
 * Shows header, content, and sidebar placeholders while data loads.
 */
export default function AssignmentDetailSkeleton({
  isInstructor = false,
}: {
  isInstructor?: boolean;
}) {
  return (
    <div className="h-full flex flex-col bg-main-background animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-light-border bg-background px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Back button and title */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-secondary/20 rounded" />
              <div className="h-4 w-32 bg-secondary/10 rounded" />
            </div>
          </div>

          {/* Right - Action buttons */}
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 bg-secondary/10 rounded" />
            {!isInstructor && (
              <div className="h-10 w-28 bg-secondary/20 rounded-lg" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col lg:flex-row gap-6 px-4 sm:px-6 py-4">
          {isInstructor ? <InstructorViewSkeleton /> : <StudentViewSkeleton />}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for instructor view - Instructions + Stats + Table
 */
function InstructorViewSkeleton() {
  return (
    <div className="w-full space-y-6">
      {/* Instructions Section */}
      <div className="bg-background border border-light-border rounded-xl p-6 space-y-4">
        <div className="h-5 w-32 bg-secondary/20 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-secondary/10 rounded" />
          <div className="h-4 w-11/12 bg-secondary/10 rounded" />
          <div className="h-4 w-3/4 bg-secondary/10 rounded" />
        </div>
        {/* Files */}
        <div className="flex gap-2 pt-4">
          <div className="h-10 w-40 bg-secondary/10 rounded-lg" />
          <div className="h-10 w-40 bg-secondary/10 rounded-lg" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-background border border-light-border rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 bg-secondary/5 rounded-lg border border-light-border/50"
            >
              <div className="w-8 h-8 bg-secondary/20 rounded" />
              <div className="space-y-1">
                <div className="h-6 w-8 bg-secondary/20 rounded" />
                <div className="h-3 w-16 bg-secondary/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-background border border-light-border rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-border">
          <div className="h-5 w-44 bg-secondary/20 rounded" />
          <div className="h-10 w-36 bg-secondary/20 rounded-lg" />
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-secondary/5 border-b border-light-border">
          {["Student", "Submitted", "Status", "Score", "Details"].map(
            (label) => (
              <div key={label} className="h-4 w-16 bg-secondary/10 rounded" />
            )
          )}
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-4 px-4 py-4 border-b border-light-border last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary/20 rounded-full" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-secondary/20 rounded" />
                <div className="h-3 w-32 bg-secondary/10 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-secondary/10 rounded self-center" />
            <div className="h-6 w-16 bg-secondary/10 rounded-full self-center" />
            <div className="h-8 w-20 bg-secondary/10 rounded self-center" />
            <div className="h-8 w-8 bg-secondary/10 rounded self-center ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for student view - Instructions + Sidebar
 */
function StudentViewSkeleton() {
  return (
    <>
      {/* Left Column - Main Content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Instructions Section */}
        <div className="bg-background border border-light-border rounded-xl p-6 space-y-4">
          <div className="h-5 w-32 bg-secondary/20 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-secondary/10 rounded" />
            <div className="h-4 w-11/12 bg-secondary/10 rounded" />
            <div className="h-4 w-3/4 bg-secondary/10 rounded" />
          </div>
          {/* Files */}
          <div className="flex gap-2 pt-4">
            <div className="h-10 w-40 bg-secondary/10 rounded-lg" />
            <div className="h-10 w-40 bg-secondary/10 rounded-lg" />
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-background border border-light-border rounded-xl p-6 space-y-4">
          <div className="h-5 w-24 bg-secondary/20 rounded" />
          <div className="flex gap-2">
            <div className="h-12 w-48 bg-secondary/10 rounded-lg" />
            <div className="h-12 w-48 bg-secondary/10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
        {/* Due Date Card */}
        <div className="bg-background border border-light-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-secondary/20 rounded" />
            <div className="h-4 w-16 bg-secondary/20 rounded" />
          </div>
          <div className="h-5 w-32 bg-secondary/10 rounded" />
        </div>

        {/* Your Work Card */}
        <div className="bg-background border border-light-border rounded-xl p-4 space-y-4">
          <div className="h-5 w-24 bg-secondary/20 rounded" />
          <div className="h-10 w-24 bg-secondary/10 rounded-lg" />
          <div className="border-2 border-dashed border-light-border rounded-lg p-6 flex flex-col items-center">
            <div className="w-10 h-10 bg-secondary/10 rounded-full mb-2" />
            <div className="h-4 w-32 bg-secondary/10 rounded" />
            <div className="h-3 w-24 bg-secondary/10 rounded mt-1" />
          </div>
          <div className="h-20 bg-secondary/10 rounded-lg" />
        </div>
      </div>
    </>
  );
}
