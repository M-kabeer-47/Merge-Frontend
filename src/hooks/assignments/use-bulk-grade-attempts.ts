import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import type {
  InstructorAssignment,
  AttemptsResponse,
} from "@/types/assignment";

interface AttemptScore {
  attemptId: string;
  score: number;
}

interface BulkGradeData {
  roomId: string;
  assignmentId: string;
  attempts: AttemptScore[];
}

interface UseBulkGradeAttemptsOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Hook to bulk grade assignment attempts
 * POST /assignments/attempts/bulk-score
 */
export default function useBulkGradeAttempts({
  onSuccess,
  onError,
}: UseBulkGradeAttemptsOptions = {}) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: BulkGradeData) => {
      const response = await api.post("/assignments/attempts/bulk-score", {
        roomId: data.roomId,
        attempts: data.attempts,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Create a map of attemptId -> newScore for quick lookup
      const scoreMap = new Map(
        variables.attempts.map((a) => [a.attemptId, a.score]),
      );

      // Update single assignment detail cache
      let newlyGradedCount = 0;
      queryClient.setQueryData(
        ["assignment", variables.assignmentId, "instructor"],
        (old: InstructorAssignment | undefined) => {
          if (!old) return old;

          // Update the specific attempts in the attempts list
          const updatedAttemptsData = (old.attempts?.data ?? []).map((attempt) => {
            const newScore = scoreMap.get(attempt.id);
            if (newScore !== undefined) {
              // Check if this was previously ungraded
              if (attempt.score === null) {
                newlyGradedCount++;
              }
              return { ...attempt, score: newScore };
            }
            return attempt;
          });

          return {
            ...old,
            gradedAttempts: old.gradedAttempts + newlyGradedCount,
            ungradedAttempts: Math.max(
              0,
              old.ungradedAttempts - newlyGradedCount,
            ),
            attempts: {
              ...old.attempts,
              data: updatedAttemptsData,
            },
          };
        },
      );

      // Update the submissions cache - this is what the UI actually reads from
      // The query key uses ["submissions", assignmentId, filter, subFilter, page]
      // We update all queries that start with ["submissions", assignmentId]
      queryClient.setQueriesData<AttemptsResponse>(
        { queryKey: ["submissions", variables.assignmentId], exact: false },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((attempt) => {
              const newScore = scoreMap.get(attempt.id);
              if (newScore !== undefined) {
                return { ...attempt, score: newScore };
              }
              return attempt;
            }),
          };
        },
      );

      // Also update assignments list cache for the room
      queryClient.setQueriesData<InstructorAssignment[]>(
        { queryKey: ["assignments", variables.roomId, "instructor"] },
        (old) => {
          if (!old) return old;
          return old.map((assignment) => {
            if (assignment.id === variables.assignmentId) {
              return {
                ...assignment,
                gradedAttempts: assignment.gradedAttempts + newlyGradedCount,
                ungradedAttempts: Math.max(
                  0,
                  assignment.ungradedAttempts - newlyGradedCount,
                ),
              };
            }
            return assignment;
          });
        },
      );

      toast.success("All grades saved successfully");
      onSuccess?.();
    },
    onError: (err) => {
      toast.error("Failed to save grades");
      onError?.(err);
    },
  });

  return {
    bulkGradeAttempts: mutateAsync,
    isGrading: isPending,
  };
}
