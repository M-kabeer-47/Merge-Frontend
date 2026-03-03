import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import { revalidateNotesCache } from "@/server-actions/notes";
import { refreshFolderCache } from "@/server-actions/room-content";

interface CreateFolderPayload {
  name: string;
  type: "notes" | "room";
  parentFolderId?: string | null;
  roomId?: string;
}

export default function useCreateFolder() {
  const queryClient = useQueryClient();

  const createFolderFunction = async (payload: CreateFolderPayload) => {
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

      const response = await api.post("/folders/create/notes-folder", body);
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

      const response = await api.post("/folders/create/room-folder", body);
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
      // Use default values (no search/sort filters) to update the base cache
      const queryKey =
        variables.type === "room"
          ? [
              "room-content",
              variables.roomId,
              variables.parentFolderId || null,
              "", // searchQuery - default empty
              null, // sortBy - default null
              null, // sortOrder - default null
            ]
          : ["notes", variables.parentFolderId || null, ""];
      console.log("Created Folder: ", createdFolder);
      // Update cache with the actual folder data from API response
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          folders: [
            ...(old.folders || []),
            { ...createdFolder, updatedAt: "Just now" },
          ],
          total: {
            ...old.total,
            folders: (old.total?.folders || 0) + 1,
            combined: (old.total?.combined || 0) + 1,
          },
        };
      });

      // Invalidate server cache for notes folders (fire and forget)
      if (variables.type === "notes") {
        revalidateNotesCache();
      } else if (variables.type === "room" && variables.roomId) {
        refreshFolderCache(variables.roomId, variables.parentFolderId);
      }

      toast.success("Folder created successfully!");
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to create folder. Please try again.");
    },
  });

  return {
    createFolder,
    isCreating,
    isCreateError,
    isCreateSuccess,
  };
}
