import { UserType } from "@/schemas/user/user";
import { useMutation } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/types/api-error";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
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

export default function signIn({
  setError,
  email,
}: {
  setError: UseFormSetError<UserType>;
  email: string;
  password: string;
}) {
  const router = useRouter();
  const { mutate: registerToken } = useRegisterFCMToken();

  const signInFn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const response = await api.post("/auth/signin", {
      email,
      password,
    });
    return response.data;
  };

  const { mutateAsync, isError, isPending } = useMutation({
    mutationFn: signInFn,
    onSuccess: async (data) => {
      if (data.message === "A new OTP has been sent to your email.") {
        window.location.href = `/two-factor?email=${email}`;
        return;
      }
      // Backend sets cookies via Set-Cookie headers (same-origin via proxy)
      if (data.token && data.refreshToken && data.userId) {
        toast.success("Signed in successfully!");

        const notificationStatus = data.notificationStatus || "default";
        let redirect = "/rooms";

        // If browser already has permission (granted), ensure token is registered
        if (Notification.permission === "granted") {
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
            // Non-blocking, token refresh will handle it
          }
        } else if (
          notificationStatus === "default" &&
          Notification.permission === "default"
        ) {
          // Browser hasn't been asked yet — trigger permission prompt
          redirect = "/rooms?askNotifications=true";
        }

        setTimeout(() => {
          router.push(redirect);
        }, 500);
      }
    },
    onError: (error: ApiError) => {
      if (error?.response.data.message === "User not found") {
        toast.error("User not found. Please check your email.");
        setError("email", { type: "manual", message: "User not found" });
      } else if (
        error?.response.data.message ===
        "Please verify your email to login, A link has been sent to your email"
      ) {
        toast.error("Please verify your email.");
        setError("email", { type: "manual", message: "Email not verified" });
      } else if (error?.response.data.message === "Invalid password") {
        toast.error("Invalid password. Please try again.");
        setError("password", { type: "manual", message: "Invalid password" });
      }
    },
  });
  return { signIn: mutateAsync, isError, isPending };
}
