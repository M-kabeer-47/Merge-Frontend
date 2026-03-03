import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";
import { refreshFolderCache } from "@/server-actions/room-content";

interface UseDeleteFileOptions {
  roomId: string;
  folderId?: string | null;
  searchQuery?: string;
  sortBy?: ContentSortBy;
  sortOrder?: ContentSortOrder;
}

export default function useDeleteFile({
  roomId,
  folderId,
  searchQuery = "",
  sortBy,
  sortOrder,
}: UseDeleteFileOptions) {
  const queryClient = useQueryClient();

  const deleteFileFunction = async (fileId: string) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteFile,
  } = useMutation({
    mutationFn: deleteFileFunction,
    onSuccess: (_, deletedFileId) => {
      // Update the cache to remove the deleted file
      const queryKey = [
        "room-content",
        roomId,
        folderId || null,
        searchQuery,
        sortBy,
        sortOrder,
      ];

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          files: (old.files || []).filter(
            (file: any) => file.id !== deletedFileId
          ),
          total: {
            ...old.total,
            files: Math.max((old.total?.files || 1) - 1, 0),
            combined: Math.max((old.total?.combined || 1) - 1, 0),
          },
        };
      });
      refreshFolderCache(roomId);
      toast.success("File deleted successfully!");
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to delete file. Please try again.");
    },
  });

  return {
    deleteFile,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
  };
}
