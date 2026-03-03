import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";
import { refreshFolderCache } from "@/server-actions/room-content";

interface UseDeleteContentFolderOptions {
  roomId: string;
  parentFolderId?: string | null;
  searchQuery?: string;
  sortBy?: ContentSortBy;
  sortOrder?: ContentSortOrder;
}

export default function useDeleteContentFolder({
  roomId,
  parentFolderId,
  searchQuery = "",
  sortBy,
  sortOrder,
}: UseDeleteContentFolderOptions) {
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
    mutationFn: deleteFolderFunction,
    onSuccess: (_, deletedFolderId) => {
      // Update the cache to remove the deleted folder
      const queryKey = [
        "room-content",
        roomId,
        parentFolderId || null,
        searchQuery,
        sortBy,
        sortOrder,
      ];

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          folders: (old.folders || []).filter(
            (folder: any) => folder.id !== deletedFolderId
          ),
          total: {
            ...old.total,
            folders: Math.max((old.total?.folders || 1) - 1, 0),
            combined: Math.max((old.total?.combined || 1) - 1, 0),
          },
        };
      });
      refreshFolderCache(roomId, parentFolderId);
      toast.success("Folder deleted successfully!");
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to delete folder. Please try again.");
    },
  });

  return {
    deleteFolder,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
  };
}
