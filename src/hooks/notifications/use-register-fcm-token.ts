/**
 * FCM Token Registration Hook
 *
 * Sends FCM token to backend API for push notification targeting.
 */

import { useMutation } from "@tanstack/react-query";
import api from "@/utils/api";
import type { RegisterFCMTokenRequest } from "@/types/notification";

interface RegisterFCMTokenResponse {
  success: boolean;
  message?: string;
}

/**
 * Hook to register FCM token with backend
 */
export function useRegisterFCMToken() {
  return useMutation({
    mutationFn: async (
      data: RegisterFCMTokenRequest,
    ): Promise<RegisterFCMTokenResponse> => {
      const response = await api.post<RegisterFCMTokenResponse>(
        "/user/fcm-token",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("[FCM] Token registered with backend");
    },
    onError: (error) => {
      console.error("[FCM] Failed to register token:", error);
    },
  });
}
