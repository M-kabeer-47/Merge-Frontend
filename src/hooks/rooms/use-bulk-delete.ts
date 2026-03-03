import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";

interface UseBulkDeleteOptions {
  roomId: string;
  folderId?: string | null;
  searchQuery?: string;
  sortBy?: ContentSortBy;
  sortOrder?: ContentSortOrder;
  onSuccess?: () => void;
}

interface BulkDeletePayload {
  fileIds: string[];
  folderIds: string[];
}

export default function useBulkDelete({
  roomId,
  folderId,
  onSuccess,
}: UseBulkDeleteOptions) {
  const queryClient = useQueryClient();

  const bulkDeleteFunction = async (payload: BulkDeletePayload) => {
    const response = await api.delete(`/room/${roomId}/course-content/bulk`, {
      data: payload,
    });
    return response.data;
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: bulkDelete,
  } = useMutation({
    mutationFn: bulkDeleteFunction,
    onSuccess: (_, { fileIds, folderIds }) => {
      // Always update the default (unfiltered) cache
      const defaultQueryKey = [
        "room-content",
        roomId,
        folderId || null,
        "", // empty searchQuery
        null, // null sortBy
        null, // null sortOrder
      ];

      queryClient.setQueryData(defaultQueryKey, (old: any) => {
        if (!old) return old;

        const deletedFileCount = fileIds.length;
        const deletedFolderCount = folderIds.length;

        return {
          ...old,
          files: (old.files || []).filter(
            (file: any) => !fileIds.includes(file.id)
          ),
          folders: (old.folders || []).filter(
            (folder: any) => !folderIds.includes(folder.id)
          ),
          total: {
            ...old.total,
            files: Math.max((old.total?.files || 0) - deletedFileCount, 0),
            folders: Math.max(
              (old.total?.folders || 0) - deletedFolderCount,
              0
            ),
            combined: Math.max(
              (old.total?.combined || 0) -
                deletedFileCount -
                deletedFolderCount,
              0
            ),
          },
        };
      });

      const totalDeleted = fileIds.length + folderIds.length;
      toast.success(
        `${totalDeleted} item${
          totalDeleted > 1 ? "s" : ""
        } deleted successfully!`
      );

      // Call onSuccess callback to reset filters in parent
      onSuccess?.();
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to delete items. Please try again.");
    },
  });

  return {
    bulkDelete,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
  };
}
