import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";
import type {
  JoinRequest,
  JoinRequestAction,
  ReviewJoinRequestData,
} from "@/types/join-request";

interface UseReviewJoinRequestParams {
  roomId: string;
  onSuccess?: () => void;
}

/**
 * Accept or reject a join request (instructor only)
 */
export default function useReviewJoinRequest({
  roomId,
  onSuccess,
}: UseReviewJoinRequestParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ReviewJoinRequestData) => {
      const response = await api.post(
        `/room/${roomId}/join-requests/review`,
        data
      );
      return response.data;
    },
    onMutate: async ({ requestId }) => {
      // Cancel ongoing fetches
      await queryClient.cancelQueries({ queryKey: ["join-requests", roomId] });

      // Snapshot current data
      const previousRequests = queryClient.getQueryData<JoinRequest[]>([
        "join-requests",
        roomId,
      ]);

      // Optimistically remove the request
      queryClient.setQueryData<JoinRequest[]>(
        ["join-requests", roomId],
        (old) => old?.filter((r) => r.id !== requestId) ?? []
      );

      return { previousRequests };
    },
    onError: (error: any, _, context) => {
      // Rollback on error
      if (context?.previousRequests) {
        queryClient.setQueryData(
          ["join-requests", roomId],
          context.previousRequests
        );
      }
      toastApiError(error, "Failed to process request");
    },
    onSuccess: (_, { action }) => {
      const message =
        action === "accepted"
          ? "Request accepted! User has been added to the room."
          : "Request rejected.";
      toast.success(message);
      onSuccess?.();
    },
  });
}
