"use client";

import { useParams, useRouter } from "next/navigation";
import useFetchNoteById from "@/hooks/notes/use-fetch-note-by-id";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useDeleteNote from "@/hooks/notes/use-delete-note";

export default function ViewNotePage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  
  const { note, isLoading, isError } = useFetchNoteById(noteId);
  const { deleteNote, isDeleting } = useDeleteNote();

  const handleEdit = () => {
    router.push(`/notes/${noteId}/edit`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(noteId);
        router.push("/notes");
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    }
  };

  const handleBack = () => {
    router.push("/notes");
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

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                size="sm"
                className="flex items-center gap-2"
              >
                {isDeleting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-4xl sm:text-5xl font-bold font-raleway text-heading mb-6">
          {note.title}
        </h1>
        
        <div className="text-sm text-para-muted mb-8">
          <span>Last updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>

        <div 
          className="prose prose-lg max-w-none text-para"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    </div>
  );
}
