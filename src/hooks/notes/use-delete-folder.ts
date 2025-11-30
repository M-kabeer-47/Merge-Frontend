import apiRequest from "@/utils/api-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

interface DeleteFolderParams {
    folderId: string;
    parentFolderId: string | null;
    searchQuery: string;
}

export default function useDeleteFolder() {
    const queryClient = useQueryClient();
    const { rotateToken, isRotationPending } = usesRotateToken({
        oldToken:
            typeof window !== "undefined"
                ? localStorage.getItem("refreshToken") || ""
                : "",
    });

    const deleteFolderFunction = async (folderId: string) => {
        const accessToken = localStorage.getItem("accessToken");
        return await apiRequest(
            axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/folders/${folderId}`, {
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
        mutateAsync: deleteFolder,
    } = useMutation({
        mutationFn: ({ folderId }: DeleteFolderParams) => deleteFolderFunction(folderId),
        onMutate: async ({ folderId, parentFolderId, searchQuery }: DeleteFolderParams) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: ["notes", parentFolderId, searchQuery]
            });

            // Snapshot the previous value
            const previousData = queryClient.getQueryData(["notes", parentFolderId, searchQuery]);

            // Optimistically remove the folder
            queryClient.setQueryData(["notes", parentFolderId, searchQuery], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    folders: old.folders.filter((folder: any) => folder.id !== folderId),
                };
            });

            // Return context for rollback
            return { previousData, parentFolderId, searchQuery };
        },
        onError: async (error: any, variables, context: any) => {
            // Rollback to the previous value
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["notes", context.parentFolderId, context.searchQuery],
                    context.previousData
                );
            }

            if (error?.response?.data?.statusCode === 401) {
                try {
                    await rotateToken();
                    await deleteFolder(variables);
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
        onSuccess: () => {
            toast.success("Folder deleted successfully!");
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
