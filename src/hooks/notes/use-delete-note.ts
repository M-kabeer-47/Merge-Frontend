import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { revalidateNotesCache } from "@/server-actions/notes";

interface DeleteNoteParams {
  noteId: string;
  folderId: string | null;
  searchQuery: string;
}

export default function useDeleteNote() {
  const queryClient = useQueryClient();

  const deleteNoteFunction = async (noteId: string) => {
    const response = await api.delete(`/notes/${noteId}`);
    return response.data;
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteNote,
  } = useMutation({
    mutationFn: ({ noteId }: DeleteNoteParams) => deleteNoteFunction(noteId),
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete note. Please try again."
      );
    },
    onSuccess: (_, { noteId, folderId, searchQuery }) => {
      // Update client cache after successful deletion
      queryClient.setQueryData(["notes", folderId, searchQuery], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notes: old.notes.filter((note: any) => note.id !== noteId),
        };
      });

      // Invalidate server cache (fire and forget - don't block UI)
      revalidateNotesCache();

      toast.success("Note deleted successfully!");
    },
  });

  return {
    deleteNote,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
  };
}
