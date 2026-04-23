"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { requestFCMToken } from "@/lib/firebase";
import { useRegisterFCMToken } from "@/hooks/notifications/use-register-fcm-token";
import { tryIt } from "@/utils/try-it";

// Generate a unique device ID for this browser
function getDeviceId(): string {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem("merge_device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("merge_device_id", deviceId);
  }
  return deviceId;
}

export default function NotificationTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { mutate: registerToken } = useRegisterFCMToken();
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Only run once per mount and only if param is present
    const shouldAsk = searchParams?.get("askNotifications") === "true";

    if (!shouldAsk || !isAuthenticated || hasTriggered.current) {
      return;
    }

    hasTriggered.current = true;

    // Clean the URL param, then ask for permission after a short delay

    // Trigger native Chrome permission dialSg
    const askPermission = async () => {
      // Clean URL first, then show the dialog

      // This shows Chrome's native notification permission dialog
      const [response, error] = await tryIt(Notification.requestPermission());
      if (response === "granted") {
        // User allowed - get FCM token and register
        const [token, tokenError] = await tryIt(requestFCMToken());
        if (token) {
          registerToken({
            notificationStatus: "allowed",
            token,
            deviceType: "web",
            deviceId: getDeviceId(),
          });
        } else {
          console.error("[Notifications] Error getting token:", tokenError);
        }
      } else if (response === "denied") {
        // User denied - update backend status
        registerToken({
          notificationStatus: "denied",
          deviceType: "web",
          deviceId: getDeviceId(),
        });
        console.log("[Notifications] Permission denied by user");
      } else if (error) {
        console.error("[Notifications] Error requesting permission:", error);
      }
      // If "default" (dismissed), we don't do anything - they can enable later in settings
    };

    // Use a microtask-safe approach: don't return cleanup that cancels the timer,
    // since router.replace will trigger a re-render and the cleanup would cancel it
    setTimeout(askPermission, 500);
  }, [searchParams, pathname, router, isAuthenticated, registerToken]);

  return null;
}
