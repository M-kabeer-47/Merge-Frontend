import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { CreateNoteType } from "@/types/note-operations";
import { useRouter } from "next/navigation";

export default function useCreateNote() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const createNoteFunction = async (data: CreateNoteType) => {
    const response = await api.post("/notes/create", data);
    return response.data;
  };

  const { isPending: isCreating, mutateAsync: createNote } = useMutation({
    mutationFn: createNoteFunction,
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create note. Please try again."
      );
    },
    onSuccess: (data, variables) => {
      // Add the newly created note to the cache
      const folderId = variables.folderId || null;
      queryClient.setQueryData(["notes", folderId, ""], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notes: [...(old.notes || []), data],
        };
      });
      localStorage.removeItem("note-draft");
      toast.success("Note created successfully!");
      router.push("/notes?folderId=" + variables.folderId);
    },
  });

  return {
    createNote,
    isCreating,
  };
}
