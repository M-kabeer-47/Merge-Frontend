import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";
import { toastApiError } from "@/utils/toast-helpers";

/**
 * Hook to fetch a LiveKit participant token from the backend.
 * Returns a signed JWT scoped by user role/permissions.
 */
export default function useLiveKitToken() {
  const { isPending, mutateAsync, data } = useMutation({
    mutationFn: async ({
      sessionId,
      roomId,
    }: {
      sessionId: string;
      roomId: string;
    }) => {
      const response = await api.post<{ token: string }>("/livekit/token", {
        sessionId,
        roomId,
      });
      return response.data;
    },
    onError: (error: unknown) => {
      toastApiError(error, "Failed to connect to video session.");
    },
  });

  return {
    getToken: mutateAsync,
    isFetchingToken: isPending,
    tokenData: data,
  };
}
