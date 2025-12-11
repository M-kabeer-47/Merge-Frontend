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
}

export default function useCreateFolder({
  searchQuery,
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

    // Prepare body
    const body: any = {
      name: payload.name,
      type: payload.type,
    };

    // Only add parentFolderId if it's explicitly provided (can be null for root)
    if (payload.parentFolderId !== undefined) {
      body.parentFolderId = payload.parentFolderId;
    }

    // Add roomId for room folders
    if (payload.type === "room" && payload.roomId) {
      body.roomId = payload.roomId;
    }

    let response = await apiRequest(
      axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/folders/create`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    );
    return response.data;
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
            ]
          : ["notes", variables.parentFolderId || null, searchQuery];

      // Update cache with the actual folder data from API response
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
