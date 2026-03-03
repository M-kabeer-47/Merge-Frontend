import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type { Assignment } from "@/types/assignment";

interface DeleteAssignmentParams {
  assignmentId: string;
  roomId: string;
}

interface AssignmentsResponse {
  assignments: Assignment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface UseDeleteAssignmentOptions {
  onSuccess?: () => void;
}

/**
 * Hook to delete an assignment with optimistic updates.
 * Only instructors/moderators can delete assignments.
 *
 * API: DELETE /assignments/:assignmentId?roomId=room-uuid-here
 */
export default function useDeleteAssignment({
  onSuccess,
}: UseDeleteAssignmentOptions = {}) {
  const queryClient = useQueryClient();

  // Helper to remove assignment from list cache
  const removeAssignmentFromList = (
    old: AssignmentsResponse | Assignment[] | undefined,
    assignmentId: string,
  ): AssignmentsResponse | Assignment[] | undefined => {
    if (!old) return old;

    // If it's an array, filter directly
    if (Array.isArray(old)) {
      return old.filter((a) => a.id !== assignmentId);
    }

    // If it's an object with assignments property
    if (old.assignments && Array.isArray(old.assignments)) {
      return {
        ...old,
        assignments: old.assignments.filter((a) => a.id !== assignmentId),
        total: old.total - 1,
      };
    }

    return old;
  };

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({ assignmentId, roomId }: DeleteAssignmentParams) => {
      const response = await api.delete(
        `/assignments/${assignmentId}?roomId=${roomId}`,
      );
      return response.data;
    },
    onSuccess: (_, { assignmentId, roomId }) => {
      // Update all assignment list caches for this room
      const queryCache = queryClient.getQueryCache();
      const assignmentQueries = queryCache.findAll({
        queryKey: ["assignments", roomId],
      });

      assignmentQueries.forEach((query) => {
        queryClient.setQueryData(
          query.queryKey,
          (old: AssignmentsResponse | Assignment[] | undefined) =>
            removeAssignmentFromList(old, assignmentId),
        );
      });
      toast.success("Assignment deleted successfully");
      onSuccess?.();
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to delete assignment. Please try again.");
    },
  });

  return {
    deleteAssignment: mutateAsync,
    isDeleting: isPending,
  };
}
