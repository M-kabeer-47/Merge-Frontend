import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import type { InstructorAssignment } from "@/types/assignment";

interface GradeAttemptData {
  attemptId: string;
  assignmentId: string;
  score: number;
}

interface UseGradeAttemptOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Hook to grade an assignment attempt
 * PUT /assignments/attempts/:attemptId/score
 */
export default function useGradeAttempt({
  onSuccess,
  onError,
}: UseGradeAttemptOptions = {}) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: GradeAttemptData) => {
      const response = await api.put(
        `/assignments/attempts/${data.attemptId}/score`,
        { score: data.score }
      );
      return response.data;
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["assignment", newData.assignmentId, "instructor"],
      });

      // Snapshot the previous value
      const previousAssignment = queryClient.getQueryData([
        "assignment",
        newData.assignmentId,
        "instructor",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["assignment", newData.assignmentId, "instructor"],
        (old: InstructorAssignment | undefined) => {
          if (!old) return old;

          // Update the specific attempt in the attempts list
          const updatedAttemptsData = (old.attempts?.data ?? []).map((attempt) => {
            if (attempt.id === newData.attemptId) {
              return { ...attempt, score: newData.score };
            }
            return attempt;
          });

          // Calculate new stats (simple approximation for optimistic UI)
          const wasGraded =
            (old.attempts?.data ?? []).find((a) => a.id === newData.attemptId)?.score !==
            null;

          let newGradedCount = old.gradedAttempts;
          let newUngradedCount = old.ungradedAttempts;

          // If it wasn't graded before, increment graded count
          if (!wasGraded) {
            newGradedCount++;
            newUngradedCount = Math.max(0, newUngradedCount - 1);
          }

          return {
            ...old,
            gradedAttempts: newGradedCount,
            ungradedAttempts: newUngradedCount,
            attempts: {
              ...old.attempts,
              data: updatedAttemptsData,
            },
          };
        }
      );

      return { previousAssignment };
    },
    onError: (err, newData, context) => {
      // Rollback to the previous value
      if (context?.previousAssignment) {
        queryClient.setQueryData(
          ["assignment", newData.assignmentId, "instructor"],
          context.previousAssignment
        );
      }
      toast.error("Failed to save grade");
      onError?.(err);
    },
    onSuccess: () => {
      toast.success("Grade saved");
      onSuccess?.();
    },
    onSettled: (_, __, newData) => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({
        queryKey: ["assignment", newData.assignmentId, "instructor"],
      });
    },
  });

  return {
    gradeAttempt: mutateAsync,
    isGrading: isPending,
  };
}
