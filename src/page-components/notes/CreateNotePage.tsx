"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useCreateNote from "@/hooks/notes/use-create-note";
import NoteEditorSkeleton from "@/components/ui/skeletons/NotesEditorSkeleton";

const DynamicNoteEditor = dynamic(
  () => import("@/components/notes/NoteEditor"),

  { ssr: false, loading: () => <NoteEditorSkeleton /> }
);

export default function CreateNotePage() {
  const router = useRouter();
  const { createNote, isCreating, isCreateSuccess } = useCreateNote();

  const handleSave = async (data: { title: string; content: string }) => {
    alert("Title: " + data.title);
    await createNote({
      title: data.title,
      content: data.content,
    });
    if (isCreateSuccess) {
      router.push("/notes");
    } else {
      throw new Error("Note creation failed");
    }
  };

  return (
    <DynamicNoteEditor
      type="create"
      onSave={handleSave}
      isSaving={isCreating}
    />
  );
}
