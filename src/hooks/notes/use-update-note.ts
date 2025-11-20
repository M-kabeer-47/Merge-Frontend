import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";
import { UpdateNoteType } from "@/schemas/note/update-note";

export default function useUpdateNote(noteId: string) {
  const queryClient = useQueryClient();
  const { rotateToken, isRotationPending } = usesRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const updateNoteFunction = async (data: UpdateNoteType) => {
    const accessToken = localStorage.getItem("accessToken");
    return await apiRequest(
      axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/${noteId}`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  const {
    isPending: isUpdating,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    mutateAsync: updateNote,
    data: updatedNote,
  } = useMutation({
    mutationFn: updateNoteFunction,
    onError: async (error: any, variables) => {
      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();
          await updateNote(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message || 
        "Failed to update note. Please try again."
      );
    },
    onSuccess: (data) => {
      toast.success("Note updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", noteId] });
    },
  });

  return {
    updateNote,
    isUpdating,
    isUpdateError,
    isUpdateSuccess,
    updatedNote,
    isRotationPending,
  };
}
