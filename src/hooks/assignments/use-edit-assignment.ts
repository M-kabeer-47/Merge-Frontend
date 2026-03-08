import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type { Assignment } from "@/types/assignment";

export interface EditAssignmentData {
  title: string;
  description?: string;
  totalScore: number;
  endAt: string;
  isTurnInLateEnabled: boolean;
}

interface EditAssignmentParams {
  assignmentId: string;
  roomId: string;
  data: EditAssignmentData;
}

interface AssignmentsResponse {
  assignments: Assignment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface UseEditAssignmentOptions {
  onSuccess?: () => void;
}

export default function useEditAssignment({
  onSuccess,
}: UseEditAssignmentOptions = {}) {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({ assignmentId, roomId, data }: EditAssignmentParams) => {
      const response = await api.patch(
        `/assignments/${assignmentId}?roomId=${roomId}`,
        data,
      );
      return response.data;
    },
    onSuccess: (updatedAssignment, { roomId }) => {
      // Update all assignment list caches for this room
      const queryCache = queryClient.getQueryCache();
      const assignmentQueries = queryCache.findAll({
        queryKey: ["assignments", roomId],
      });

      assignmentQueries.forEach((query) => {
        queryClient.setQueryData(
          query.queryKey,
          (old: AssignmentsResponse | Assignment[] | undefined) => {
            if (!old) return old;

            if (Array.isArray(old)) {
              return old.map((a) =>
                a.id === updatedAssignment.id
                  ? { ...a, ...updatedAssignment }
                  : a,
              );
            }

            if (old.assignments && Array.isArray(old.assignments)) {
              return {
                ...old,
                assignments: old.assignments.map((a: Assignment) =>
                  a.id === updatedAssignment.id
                    ? { ...a, ...updatedAssignment }
                    : a,
                ),
              };
            }

            return old;
          },
        );
      });

      // Also invalidate the single assignment query if it exists
      queryClient.invalidateQueries({
        queryKey: ["assignment", updatedAssignment.id],
      });

      toast.success("Assignment updated successfully");
      onSuccess?.();
    },
    onError: (error: any) => {
      toastApiError(error, "Failed to update assignment. Please try again.");
    },
  });

  return {
    editAssignment: mutateAsync,
    isEditing: isPending,
  };
}
