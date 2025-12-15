import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import useRotateToken from "@/utils/rotate-token";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";

const isClient = typeof window !== "undefined";

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

  const { rotateToken, isRotationPending } = useRotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  const deleteFolderFunction = async (folderId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/folders/${folderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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

      toast.success("Folder deleted successfully!");
    },
    onError: async (error: any, folderId) => {
      if (error?.response?.status === 401) {
        try {
          await rotateToken();
          await deleteFolder(folderId);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete folder. Please try again."
      );
    },
  });

  return {
    deleteFolder,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
    isRotationPending,
  };
}
