import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import useRotateToken from "@/utils/rotate-token";
import type { ContentSortBy, ContentSortOrder } from "@/types/room-content";

interface DeleteFileParams {
  fileId: string;
  roomId: string;
  folderId: string | null;
  searchQuery: string;
  sortBy: ContentSortBy;
  sortOrder: ContentSortOrder;
}

export default function useDeleteFile() {
  const queryClient = useQueryClient();
  const { rotateToken, isRotationPending } = useRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const deleteFileFunction = async (fileId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    return await apiRequest(
      axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
  };

  const {
    isPending: isDeleting,
    isError: isDeleteError,
    isSuccess: isDeleteSuccess,
    mutateAsync: deleteFile,
  } = useMutation({
    mutationFn: ({ fileId }: DeleteFileParams) => deleteFileFunction(fileId),
    onError: async (error: any, variables) => {
      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();
          await deleteFile(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete file. Please try again."
      );
    },
    onSuccess: (
      _,
      { fileId, roomId, folderId, searchQuery, sortBy, sortOrder }
    ) => {
      // Update cache after successful deletion
      queryClient.setQueryData(
        ["room-content", roomId, folderId, searchQuery, sortBy, sortOrder],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            files: old.files.filter((file: any) => file.id !== fileId),
            total: {
              ...old.total,
              files: Math.max(0, (old.total?.files || 0) - 1),
              combined: Math.max(0, (old.total?.combined || 0) - 1),
            },
          };
        }
      );
      toast.success("File deleted successfully!");
    },
  });

  return {
    deleteFile,
    isDeleting,
    isDeleteError,
    isDeleteSuccess,
    isRotationPending,
  };
}
