"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useFetchNoteById from "@/hooks/notes/use-fetch-note-by-id";
import useUpdateNote from "@/hooks/notes/use-update-note";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";

const DynamicNoteEditor = dynamic(
  () => import("@/components/notes/NoteEditor"),
  { ssr: false }
);

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const { note, isLoading, isError } = useFetchNoteById(noteId);
  const { updateNote, isUpdating } = useUpdateNote(noteId);

  const handleUpdate = async (data: { title: string; content: string }) => {
    try {
      await updateNote({
        title: data.title,
        content: data.content,
      });

      setTimeout(() => {
        router.push(`/notes/${noteId}`);
      }, 500);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-2">Note Not Found</h1>
          <p className="text-para-muted mb-4">
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push("/notes")} variant="outline">
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DynamicNoteEditor
      type="update"
      initialTitle={note.title}
      initialContent={note.content}
      onSave={handleUpdate}
      isSaving={isUpdating}
      onSuccess={() => router.push(`/notes/${noteId}`)}
    />
  );
}
