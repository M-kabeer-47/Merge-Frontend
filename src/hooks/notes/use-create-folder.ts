import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

interface CreateFolderPayload {
  name: string;
  type: "notes" | "room";
  parentFolderId?: string | null;
  roomId?: string;
}

interface UseCreateFolderOptions {
  searchQuery: string;
  sortBy?: string | null;
  sortOrder?: string | null;
}

export default function useCreateFolder({
  searchQuery,
  sortBy,
  sortOrder,
}: UseCreateFolderOptions) {
  const queryClient = useQueryClient();
  const { rotateToken, isRotationPending } = usesRotateToken({
    oldToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken") || ""
        : "",
  });

  const createFolderFunction = async (payload: CreateFolderPayload) => {
    const accessToken = localStorage.getItem("accessToken");

    // Different endpoints and body structure for notes vs room folders
    if (payload.type === "notes") {
      // Notes folder endpoint
      const body: any = {
        name: payload.name,
      };

      // Only add parentFolderId if provided
      if (payload.parentFolderId) {
        body.parentFolderId = payload.parentFolderId;
      }

      const response = await apiRequest(
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/folders/create/notes-folder`,
          body,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );
      return response.data;
    } else {
      // Room content folder endpoint
      const body: any = {
        name: payload.name,
        roomId: payload.roomId,
      };

      // Only add parentFolderId if provided
      if (payload.parentFolderId) {
        body.parentFolderId = payload.parentFolderId;
      }

      const response = await apiRequest(
        axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/folders/create/room-folder`,
          body,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );
      return response.data;
    }
  };

  const {
    isPending: isCreating,
    isError: isCreateError,
    isSuccess: isCreateSuccess,
    mutateAsync: createFolder,
  } = useMutation({
    mutationFn: createFolderFunction,
    onSuccess: (createdFolder, variables) => {
      // Determine the query key based on folder type
      const queryKey =
        variables.type === "room"
          ? [
              "room-content",
              variables.roomId,
              variables.parentFolderId || null,
              searchQuery,
              sortBy,
              sortOrder,
            ]
          : ["notes", variables.parentFolderId || null, searchQuery];
      console.log("queryKey", queryKey);
      console.log("Created Folder: ", createdFolder);
      // Update cache with the actual fol der data from API response
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          folders: [...(old.folders || []), createdFolder],
          total: {
            ...old.total,
            folders: (old.total?.folders || 0) + 1,
            combined: (old.total?.combined || 0) + 1,
          },
        };
      });
      toast.success("Folder created successfully!");
    },
    onError: async (error: any, variables) => {
      if (error?.response?.data?.statusCode === 401) {
        try {
          await rotateToken();
          await createFolder(variables);
        } catch (rotationError) {
          toast.error("Session expired. Please sign in again.");
        }
        return;
      }
      toast.error(
        error?.response?.data?.message ||
          "Failed to create folder. Please try again."
      );
    },
  });

  return {
    createFolder,
    isCreating,
    isCreateError,
    isCreateSuccess,
    isRotationPending,
  };
}
