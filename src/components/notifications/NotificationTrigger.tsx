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
    deviceId = `web_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
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
    const shouldAsk = searchParams?.get("askNotifications") === "true" || true;
    console.log("[Notifications] shouldAsk:", shouldAsk);
    console.log("[Notifications] isAuthenticated:", isAuthenticated);
    console.log("[Notifications] hasTriggered:", hasTriggered.current);

    if (!shouldAsk || !isAuthenticated || hasTriggered.current) {
      return;
    }

    hasTriggered.current = true;

    // Remove the param from URL immediately (clean URL)
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("askNotifications");
    const newUrl = newParams.toString() ? `${pathname}?${newParams}` : pathname;
    router.replace(newUrl, { scroll: false });

    // Trigger native Chrome permission dialog
    const askPermission = async () => {
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

    const timer = setTimeout(askPermission, 500);
    return () => clearTimeout(timer);
  }, [searchParams, pathname, router, isAuthenticated, registerToken]);

  return null;
}
