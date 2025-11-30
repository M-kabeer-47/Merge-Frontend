import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";
import { CreateNoteType } from "@/types/note-operations";

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
    onMutate: async (newNote) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notes", newNote.folderId || null] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(["notes", newNote.folderId || null]);

      // Optimistically update to the new value
      queryClient.setQueryData(["notes", newNote.folderId || null], (old: any) => {
        if (!old) return old;

        const optimisticNote = {
          id: `temp-${Date.now()}`,
          title: newNote.title,
          content: newNote.content,
          folderId: newNote.folderId || null,
          userId: "current-user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return {
          ...old,
          notes: [...(old.notes || []), optimisticNote],
        };
      });

      // Return a context object with the snapshotted value
      return { previousData, folderId: newNote.folderId || null };
    },
    onError: async (error: any, variables, context: any) => {
      // Rollback to the previous value
      if (context?.previousData) {
        queryClient.setQueryData(["notes", context.folderId], context.previousData);
      }

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
