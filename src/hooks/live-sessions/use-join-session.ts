import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

interface UseJoinSessionOptions {
  onSuccess?: () => void;
}

/**
 * Hook to join a live session (creates a SessionAttendee record on the backend).
 */
export default function useJoinSession({
  onSuccess,
}: UseJoinSessionOptions = {}) {
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
        `/live-sessions/${sessionId}/join?roomId=${roomId}`
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["live-sessions", variables.roomId],
      });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toastApiError(error, "Failed to join session.");
    },
  });

  return {
    joinSession: mutateAsync,
    isJoining: isPending,
  };
}
