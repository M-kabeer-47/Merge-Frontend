import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

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
    mutationFn: deleteNoteFunction,
    onError: async (error: any, variables) => {
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
      queryClient.invalidateQueries({ queryKey: ["notes"] });
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
