import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

interface RenameNoteParams {
  noteId: string;
  newTitle: string;
  folderId: string | null;
  searchQuery: string;
}

export default function useRenameNote() {
  const queryClient = useQueryClient();

  const renameNoteFunction = async ({ noteId, newTitle }: RenameNoteParams) => {
    const response = await api.patch(`/notes/${noteId}`, {
      title: newTitle,
    });
    return response.data;
  };

  const {
    isPending: isRenaming,
    isError: isRenameError,
    isSuccess: isRenameSuccess,
    mutateAsync: renameNote,
  } = useMutation({
    mutationFn: renameNoteFunction,
    onSuccess: (updatedNote, { noteId, newTitle, folderId, searchQuery }) => {
      // Update the cache
      queryClient.setQueryData(["notes", folderId, searchQuery], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          notes: (old.notes || []).map((note: any) =>
            note.id === noteId ? { ...note, title: newTitle } : note
          ),
        };
      });

      // Also update the default cache (no search)
      queryClient.setQueryData(["notes", folderId, ""], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          notes: (old.notes || []).map((note: any) =>
            note.id === noteId ? { ...note, title: newTitle } : note
          ),
        };
      });

      toast.success("Note renamed successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to rename note. Please try again."
      );
    },
  });

  return {
    renameNote,
    isRenaming,
    isRenameError,
    isRenameSuccess,
  };
}
