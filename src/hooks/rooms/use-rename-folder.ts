import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

interface RenameFolderParams {
  folderId: string;
  newName: string;
  parentFolderId?: string | null;
}

interface UseRenameFolderOptions {
  roomId: string;
  parentFolderId?: string | null;
}

export default function useRenameFolder({
  roomId,
  parentFolderId,
}: UseRenameFolderOptions) {
  const queryClient = useQueryClient();

  const renameFolderFunction = async ({
    folderId,
    newName,
  }: RenameFolderParams) => {
    const response = await api.patch(`/folders/${folderId}`, {
      name: newName,
    });
    return response.data;
  };

  const {
    isPending: isRenaming,
    isError: isRenameError,
    isSuccess: isRenameSuccess,
    mutateAsync: renameFolder,
  } = useMutation({
    mutationFn: renameFolderFunction,
    onSuccess: (updatedFolder, { folderId, newName }) => {
      // Update the default cache (search="", sort=null)
      const queryKey = [
        "room-content",
        roomId,
        parentFolderId || null,
        "",
        null,
        null,
      ];

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          folders: (old.folders || []).map((folder: any) =>
            folder.id === folderId ? { ...folder, name: newName } : folder
          ),
        };
      });

      toast.success("Folder renamed successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to rename folder. Please try again."
      );
    },
  });

  return {
    renameFolder,
    isRenaming,
    isRenameError,
    isRenameSuccess,
  };
}
