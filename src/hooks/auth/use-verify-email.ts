import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { setAuthTokens } from "@/utils/auth-tokens";

export default function VerifyPage({ token }: { token: string }) {
  const router = useRouter();

  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async () => {
      const response = await api.get(`/auth/verify?token=${token}`);
      return response.data;
    },
    onSuccess: (data) => {
      // Store tokens in cookies if provided
      if (data.token && data.refreshToken) {
        setAuthTokens(data.token, data.refreshToken);
      }

      // Only ask for notification permission if browser hasn't been asked yet
      const notificationStatus = data.notificationStatus || "default";
      const browserNotAsked =
        typeof Notification !== "undefined" &&
        Notification.permission === "default";
      const askParam =
        notificationStatus === "default" && browserNotAsked
          ? "&askNotifications=true"
          : "";

      setTimeout(() => {
        router.push(`/success?type=email_verified${askParam}`);
      }, 500);
    },
    onError: (err) => {
      console.error("Verification failed:", err);
    },
  });

  return { verifyEmail: mutateAsync, isPending, isError };
}
