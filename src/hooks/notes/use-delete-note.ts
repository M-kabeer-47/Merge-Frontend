import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

interface DeleteNoteParams {
  noteId: string;
  folderId: string | null;
  searchQuery: string;
}

export default function useDeleteNote() {
  const queryClient = useQueryClient();
  const { rotateToken, isRotationPending } = usesRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const deleteNoteFunction = async (noteId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    return await apiRequest(
      axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteNote,
  } = useMutation({
    mutationFn: ({ noteId }: DeleteNoteParams) => deleteNoteFunction(noteId),
    onMutate: async ({ noteId, folderId, searchQuery }: DeleteNoteParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["notes", folderId, searchQuery]
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["notes", folderId, searchQuery]);

      // Optimistically remove the note
      queryClient.setQueryData(["notes", folderId, searchQuery], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          notes: old.notes.filter((note: any) => note.id !== noteId),
        };
      });

      // Return context for rollback
      return { previousData, folderId, searchQuery };
    },
    onError: async (error: any, variables, context: any) => {
      // Rollback to the previous value
      if (context?.previousData) {
        queryClient.setQueryData(
          ["notes", context.folderId, context.searchQuery],
          context.previousData
        );
      }

      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();
          await deleteNote(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete note. Please try again."
      );
    },
    onSuccess: () => {
      toast.success("Note deleted successfully!");
    },
  });

  return {
    deleteNote,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
    isRotationPending,
  };
}
