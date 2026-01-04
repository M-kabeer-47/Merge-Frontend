import { Suspense } from "react";
import NotesPageClient from "@/page-components/notes/NotesPage";
import NotesDataWrapper from "@/components/notes/NotesDataWrapper";
import NotesGridSkeleton from "@/components/notes/NotesGridSkeleton";

interface NotesPageProps {
  searchParams: Promise<{ folderId?: string }>;
}

export default async function Page({ searchParams }: NotesPageProps) {
  const { folderId = null } = await searchParams;

  return (
    <NotesPageClient folderId={folderId}>
      <Suspense fallback={<NotesGridSkeleton />}>
        <NotesDataWrapper />
      </Suspense>
    </NotesPageClient>
  );
}
