import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

interface RenameFileParams {
  fileId: string;
  newName: string;
}

interface UseRenameFileOptions {
  roomId: string;
  folderId?: string | null;
}

export default function useRenameFile({
  roomId,
  folderId,
}: UseRenameFileOptions) {
  const queryClient = useQueryClient();

  const renameFileFunction = async ({ fileId, newName }: RenameFileParams) => {
    const response = await api.patch(`/files/${fileId}`, {
      originalName: newName,
    });
    return response.data;
  };

  const {
    isPending: isRenaming,
    isError: isRenameError,
    isSuccess: isRenameSuccess,
    mutateAsync: renameFile,
  } = useMutation({
    mutationFn: renameFileFunction,
    onSuccess: (updatedFile, { fileId, newName }) => {
      // Update the default cache (search="", sort=null)
      const queryKey = [
        "room-content",
        roomId,
        folderId || null,
        "",
        null,
        null,
      ];

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          files: (old.files || []).map((file: any) =>
            file.id === fileId ? { ...file, originalName: newName } : file
          ),
        };
      });

      toast.success("File renamed successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to rename file. Please try again."
      );
    },
  });

  return {
    renameFile,
    isRenaming,
    isRenameError,
    isRenameSuccess,
  };
}
