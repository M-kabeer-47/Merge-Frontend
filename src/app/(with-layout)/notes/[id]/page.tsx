"use client";

import { useParams, useRouter } from "next/navigation";
import useFetchNoteById from "@/hooks/notes/use-fetch-note-by-id";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Edit } from "lucide-react";
import NoteEditorSkeleton from "@/components/ui/skeletons/NotesEditorSkeleton";
import DynamicNotesViewer from "@/components/notes/DynamicNotesViewer";

export default function ViewNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const { note, isLoading, isError } = useFetchNoteById(noteId);
  
  const handleBack = () => {
    router.push("/notes");
  };

  const handleEdit = () => {
    router.push(`/notes/${noteId}/edit`);
  };

  if (isLoading) {
    return (
      <NoteEditorSkeleton />
    );
  }

  if (isError || !note) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-2">
            Note Not Found
          </h1>
          <p className="text-para-muted mb-4">
            The note you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={handleBack} variant="outline">
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-main-background/80 backdrop-blur-sm border-b border-light-border/50">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-para-muted hover:text-heading transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline text-sm">Back</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center gap-3 hover:bg-primary/5 px-3 py-2 rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <article className="w-full lg:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-[30px]">
        <div className="mt-8 sm:mt-12">
          <h1 className="text-4xl md:text-5xl font-bold font-raleway text-heading mb-6">
            {note.title}
          </h1>

          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-light-border">
            <div className="text-sm text-para-muted">
              <span>
                Last updated: {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* BlockNote Viewer */}
        {note.content && <DynamicNotesViewer content={note.content} />}
      </article>
    </div>
  );
}
