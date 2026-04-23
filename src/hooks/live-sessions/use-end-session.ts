import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

interface UseEndSessionOptions {
  onSuccess?: () => void;
}

/**
 * Hook to end a live session (transition LIVE → ENDED).
 */
export default function useEndSession({
  onSuccess,
}: UseEndSessionOptions = {}) {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({
      sessionId,
      roomId,
    }: {
      sessionId: string;
      roomId: string;
    }) => {
      const response = await api.post(
        `/live-sessions/${sessionId}/end?roomId=${roomId}`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["live-sessions", variables.roomId],
      });
      toast.success("Session ended.");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toastApiError(error, "Failed to end session.");
    },
  });

  return {
    endSession: mutateAsync,
    isEnding: isPending,
  };
}
