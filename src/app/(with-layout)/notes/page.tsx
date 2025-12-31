import { Suspense } from "react";
import { Metadata } from "next";
import NotesPageClient from "@/page-components/notes/NotesPage";
import NotesDataWrapper from "@/components/notes/NotesDataWrapper";
import NotesGridSkeleton from "@/components/notes/NotesGridSkeleton";

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
 * Notes Page - Server Component
 * Uses the same architecture as Rooms page:
 * - Server prefetches default data for initial load
 * - Client handles filter/search changes via React Query
 */
export default function Page() {
  return (
    <NotesPageClient>
      <Suspense fallback={<NotesGridSkeleton />}>
        <NotesDataWrapper />
      </Suspense>
    </NotesPageClient>
  );
}
