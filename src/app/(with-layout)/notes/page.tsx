import { Suspense } from "react";
import { Metadata } from "next";
import NotesPage from "@/page-components/notes/NotesPage";
import NotesListSkeleton from "@/components/notes/NotesListSkeleton";

export const metadata: Metadata = {
  title: "Notes | Merge",
  description: "Manage your notes, folders, and study materials",
  keywords: ["notes", "study materials", "folders", "organization"],
  openGraph: {
    title: "Notes | Merge",
    description: "Manage your notes, folders, and study materials",
    type: "website",
  },
};

/**
 * Notes Page - Server Component wrapper
 * Wraps the client component in Suspense boundary as required for useSearchParams
 */
export default function Page() {
  return (
    <Suspense fallback={<NotesPageLoadingSkeleton />}>
      <NotesPage />
    </Suspense>
  );
}

/**
 * Loading skeleton for the entire notes page
 */
function NotesPageLoadingSkeleton() {
  return (
    <div className="space-y-6 sm:px-6 px-4 sm:py-6 py-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-32 bg-light-border/50 rounded animate-pulse" />
          <div className="h-5 w-64 bg-light-border/50 rounded animate-pulse mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-light-border/50 rounded animate-pulse" />
          <div className="h-10 w-32 bg-light-border/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-10 flex-1 max-w-md bg-light-border/50 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-light-border/50 rounded animate-pulse" />
          <div className="h-10 w-40 bg-light-border/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <NotesListSkeleton />
    </div>
  );
}
