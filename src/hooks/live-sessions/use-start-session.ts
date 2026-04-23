import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

interface UseStartSessionOptions {
  onSuccess?: () => void;
}

/**
 * Hook to start a scheduled session (transition SCHEDULED → LIVE).
 */
export default function useStartSession({
  onSuccess,
}: UseStartSessionOptions = {}) {
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
        `/live-sessions/${sessionId}/start?roomId=${roomId}`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["live-sessions", variables.roomId],
      });
      toast.success("Session is now live!");
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toastApiError(error, "Failed to start session.");
    },
  });

  return {
    startSession: mutateAsync,
    isStarting: isPending,
  };
}
