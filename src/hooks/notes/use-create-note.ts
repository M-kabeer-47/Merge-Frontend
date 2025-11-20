import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";
import { CreateNoteType } from "@/schemas/note/create-note";

export default function useCreateNote() {
  const queryClient = useQueryClient();
  const { rotateToken, isRotationPending } = usesRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const createNoteFunction = async (data: CreateNoteType) => {
    const accessToken = localStorage.getItem("accessToken");
    return await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/create`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  const {
    isPending: isCreating,
    isSuccess: isCreateSuccess,
    mutateAsync: createNote,
    data: createdNote,
  } = useMutation({
    mutationFn: createNoteFunction,
    onError: async (error: any, variables) => {
      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();
          await createNote(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message ||
          "Failed to create note. Please try again."
      );
    },
    onSuccess: (data) => {
      toast.success("Note created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    createNote,
    isCreating,
    isCreateSuccess,
    createdNote,
    isRotationPending,
  };
}
