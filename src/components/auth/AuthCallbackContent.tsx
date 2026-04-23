"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { requestFCMToken } from "@/lib/firebase";
import { useRegisterFCMToken } from "@/hooks/notifications/use-register-fcm-token";

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let deviceId = localStorage.getItem("merge_device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("merge_device_id", deviceId);
  }
  return deviceId;
}

export default function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: registerToken } = useRegisterFCMToken();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Note: Backend sets cookies via Set-Cookie headers through the proxy
      // We just need to redirect after OAuth callback
      const token = searchParams?.get("token");
      const refreshToken = searchParams?.get("refreshToken");
      const notificationStatus = searchParams?.get("notificationStatus");
      const redirect = searchParams?.get("redirect") || "/rooms";

      if (token && refreshToken) {
        // Invalidate the user query so it refetches with the new token
        queryClient.invalidateQueries({ queryKey: ["user"] });

        // Handle notification registration based on backend status
        let finalRedirect = redirect;
        if (notificationStatus === "allowed") {
          // User already allowed — silently register token
          try {
            const fcmToken = await requestFCMToken();
            if (fcmToken) {
              localStorage.setItem("merge_fcm_token", fcmToken);
              registerToken({
                notificationStatus: "allowed",
                token: fcmToken,
                deviceType: "web",
                deviceId: getDeviceId(),
              });
            }
          } catch {
            // Non-blocking
          }
        } else if (notificationStatus === "default") {
          // User hasn't been asked yet — trigger permission prompt
          const separator = redirect.includes("?") ? "&" : "?";
          finalRedirect = `${redirect}${separator}askNotifications=true`;
        }

        // Redirect to the intended destination
        router.replace(finalRedirect);
      } else {
        setError(
          "Missing authentication tokens. Please try logging in again.",
        );
      }
    };

    handleCallback();
  }, [searchParams, router, queryClient, registerToken]);

  if (error) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-heading mb-4">
            Authentication Error
          </h1>
          <p className="text-para-muted mb-6">{error}</p>
          <a
            href="/sign-in"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-para-muted">Completing authentication...</p>
      </div>
    </div>
  );
}
