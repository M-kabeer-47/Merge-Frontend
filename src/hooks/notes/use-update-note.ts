import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { UpdateNoteType } from "@/types/note-operations";

export default function useUpdateNote(noteId: string) {
  const queryClient = useQueryClient();

  const updateNoteFunction = async (data: UpdateNoteType) => {
    const response = await api.patch(`/notes/${noteId}`, data);
    return response.data;
  };

  const {
    isPending: isUpdating,
    isError: isUpdateError,
    isSuccess: isUpdateSuccess,
    mutateAsync: updateNote,
    data: updatedNote,
  } = useMutation({
    mutationFn: updateNoteFunction,
    onError: (error: any) => {
      toastApiError(error, "Failed to update note. Please try again.");
    },
    onSuccess: () => {
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
  };
}
