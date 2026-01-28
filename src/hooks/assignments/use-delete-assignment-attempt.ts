import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import type { Assignment, SubmissionStatus } from "@/types/assignment";
import { studentAssignmentQueryKey } from "./use-student-assignment";
import { refreshStudentAssignmentCache } from "@/server-actions/assignments";

interface UndoTurnInData {
  assignmentId: string;
  attemptId: string;
  roomId: string;
}

interface AssignmentsResponse {
  assignments: Assignment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface UseDeleteAssignmentAttemptOptions {
  onSuccess?: () => void;
}

/**
 * Hook to undo an assignment turn in with optimistic updates.
 * After undo, the attempt data (files, note) is preserved so user can modify and resubmit.
 */
export default function useDeleteAssignmentAttempt({
  onSuccess,
}: UseDeleteAssignmentAttemptOptions = {}) {
  const queryClient = useQueryClient();

  // Helper to update assignment in a list cache
  // Handles both array format and object format (with .assignments property)
  const updateAssignmentInList = (
    old: AssignmentsResponse | Assignment[] | undefined,
    assignmentId: string,
  ): AssignmentsResponse | Assignment[] | undefined => {
    if (!old) return old;

    // If it's an array, map directly
    if (Array.isArray(old)) {
      return old.map((a) =>
        a.id === assignmentId
          ? { ...a, submissionStatus: "pending" as SubmissionStatus }
          : a,
      );
    }

    // If it's an object with assignments property
    if (old.assignments && Array.isArray(old.assignments)) {
      return {
        ...old,
        assignments: old.assignments.map((a) =>
          a.id === assignmentId
            ? { ...a, submissionStatus: "pending" as SubmissionStatus }
            : a,
        ),
      };
    }

    return old;
  };

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: UndoTurnInData) => {
      // Use undo-turnin endpoint with roomId as query param
      const response = await api.delete(
        `/assignments/attempts/${data.attemptId}/undo-turnin?roomId=${data.roomId}`,
      );
      return response.data;
    },
    onSuccess: (_, data) => {
      // Update assignment detail - keep attempt data but change status to pending
      // This allows the user to modify files/note and resubmit
      queryClient.setQueryData(
        studentAssignmentQueryKey(data.assignmentId),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            submissionStatus: "pending" as SubmissionStatus,
            // Keep the attempt data so user can see their previous files/note
            // and modify them before resubmitting
          };
        },
      );

      // Update all assignment list caches
      const queryCache = queryClient.getQueryCache();
      const assignmentQueries = queryCache.findAll({
        queryKey: ["assignments", data.roomId],
      });

      assignmentQueries.forEach((query) => {
        queryClient.setQueryData(
          query.queryKey,
          (old: AssignmentsResponse | undefined) =>
            updateAssignmentInList(old, data.assignmentId),
        );
      });

      toast.success("Submission undone successfully");

      // Invalidate Next.js server cache so fresh data loads on navigation
      refreshStudentAssignmentCache(data.roomId, data.assignmentId);

      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to undo submission",
      );
    },
  });

  return {
    deleteAttempt: mutateAsync,
    isDeleting: isPending,
  };
}
