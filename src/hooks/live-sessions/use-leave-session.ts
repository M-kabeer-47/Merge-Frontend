import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

interface LeaveSessionPayload {
  sessionId: string;
  roomId: string;
  actingHostId?: string;
}

interface UseLeaveSessionOptions {
  onSuccess?: () => void;
}

export default function useLeaveSession({ onSuccess }: UseLeaveSessionOptions = {}) {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async ({ sessionId, roomId, actingHostId }: LeaveSessionPayload) => {
      const response = await api.post(`/live-sessions/${sessionId}/leave?roomId=${roomId}`, {
        actingHostId,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["live-sessions", variables.roomId] });
      queryClient.invalidateQueries({ queryKey: ["live-session", variables.sessionId, variables.roomId] });
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toastApiError(error, "Failed to leave session.");
    },
  });

  return {
    leaveSession: mutateAsync,
    isLeaving: isPending,
  };
}
