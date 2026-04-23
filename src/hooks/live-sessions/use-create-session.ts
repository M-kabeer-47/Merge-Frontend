import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

export interface CreateSessionData {
  roomId: string;
  title: string;
  description?: string;
  scheduledAt?: string; // ISO 8601 format
}

interface UseCreateSessionOptions {
  onSuccess?: () => void;
}

/**
 * Hook to create a new live session.
 * If scheduledAt is provided, session is scheduled. Otherwise it starts immediately.
 */
export default function useCreateSession({
  onSuccess,
}: UseCreateSessionOptions = {}) {
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: CreateSessionData) => {
      const response = await api.post("/live-sessions/create", data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["live-sessions", variables.roomId],
      });

      const message = variables.scheduledAt
        ? "Session scheduled successfully!"
        : "Session started successfully!";
      toast.success(message);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      toastApiError(error, "Failed to create session. Please try again.");
    },
  });

  return {
    createSession: mutateAsync,
    isCreating: isPending,
  };
}
