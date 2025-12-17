"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import useCreateNote from "@/hooks/notes/use-create-note";
import NoteEditorSkeleton from "@/components/ui/skeletons/NotesEditorSkeleton";
import { Suspense } from "react";

const DynamicNoteEditor = dynamic(
  () => import("@/components/notes/NoteEditor"),

  { ssr: false, loading: () => <NoteEditorSkeleton /> }
);

function CreateNotePageFunction() {
  const searchParams = useSearchParams();
  const folderId = searchParams?.get("folderId");
  const { createNote, isCreating } = useCreateNote();

  const handleSave = async (data: { title: string; content: string }) => {
    await createNote({
      title: data.title,
      content: data.content,
      folderId: folderId || "",
    });
  };

  return (
    <DynamicNoteEditor
      type="create"
      onSave={handleSave}
      isSaving={isCreating}
    />
  );
}

export default function CreateNotePage() {
  return (
    <Suspense fallback={<NoteEditorSkeleton />}>
      <CreateNotePageFunction />
    </Suspense>
  );
}
