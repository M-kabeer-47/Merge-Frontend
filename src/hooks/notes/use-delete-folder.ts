import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { revalidateNotesCache } from "@/server-actions/notes";

interface DeleteFolderParams {
  folderId: string;
  parentFolderId: string | null;
  searchQuery: string;
}

export default function useDeleteFolder() {
  const queryClient = useQueryClient();

  const deleteFolderFunction = async (folderId: string) => {
    const response = await api.delete(`/folders/${folderId}`);
    return response.data;
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteFolder,
  } = useMutation({
    mutationFn: ({ folderId }: DeleteFolderParams) =>
      deleteFolderFunction(folderId),
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete folder. Please try again."
      );
    },
    onSuccess: (_, { folderId, parentFolderId, searchQuery }) => {
      // Optimistic update - instantly remove folder from cache
      queryClient.setQueryData(
        ["notes", parentFolderId, searchQuery],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            folders: old.folders.filter(
              (folder: any) => folder.id !== folderId
            ),
          };
        }
      );
      // Invalidate server cache (fire and forget - don't block UI)
      
      revalidateNotesCache();

      toast.success("Folder deleted successfully!");
    },
  });

  return {
    deleteFolder,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
  };
}
