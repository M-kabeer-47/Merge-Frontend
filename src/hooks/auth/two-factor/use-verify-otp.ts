import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";
import { requestFCMToken } from "@/lib/firebase";
import { useRegisterFCMToken } from "@/hooks/notifications/use-register-fcm-token";

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

interface UseVerifyOTPProps {
  email: string;
  otp: string;
}

export default function useVerifyOTP({ email, otp }: UseVerifyOTPProps) {
  const { mutate: registerToken } = useRegisterFCMToken();

  const verifyOTPFunction = async () => {
    const response = await api.post("/auth/signin/otp", {
      otpCode: otp,
      email: email.toLowerCase(),
    });
    return response.data;
  };

  const {
    isPending: isVerifying,
    isError: isVerifyError,
    mutateAsync: verifyOTP,
  } = useMutation({
    mutationFn: verifyOTPFunction,
    onError: () => {
      toast.error("Failed to verify OTP. Please try again.");
    },
    onSuccess: async (data) => {
      toast.success("OTP verified successfully");
      // Backend sets cookies via Set-Cookie headers through the proxy
      if (data?.token && data?.refreshToken) {
        const notificationStatus = data.notificationStatus || "default";
        let redirect = "/rooms";

        // If browser already has permission (granted), ensure token is registered
        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
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
        } else if (
          notificationStatus === "default" &&
          typeof Notification !== "undefined" &&
          Notification.permission === "default"
        ) {
          // Browser hasn't been asked yet — trigger permission prompt
          redirect = "/rooms?askNotifications=true";
        }

        window.location.href = redirect;
      }
    },
  });

  return {
    verifyOTP,
    isVerifyError,
    isVerifying,
  };
}
