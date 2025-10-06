import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

interface UseToggleTwoFactorProps {
  twoFactorEnabled: boolean;
  password: string;
}

export default function useToggleTwoFactor({
  twoFactorEnabled,
  password,
}: UseToggleTwoFactorProps) {
  const { isRotationSuccess, rotateToken } = usesRotateToken({
    oldToken: localStorage.getItem("refreshToken") || "",
  });

  const toggleTwoFactorFunction = async () => {
    return await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/2fa/toggle`, {
        enable: !twoFactorEnabled,
        password,
      })
    );
  };

  const {
    isPending: isToggling,
    isError: isToggleError,
    mutateAsync: toggleTwoFactor,
  } = useMutation({
    mutationFn: toggleTwoFactorFunction,
    onError: async (error: any) => {
      if (error?.response?.data?.statusCode === 401) {
        await rotateToken();
        if (isRotationSuccess) {
          await toggleTwoFactorFunction();
        }
      }
      toast.error(
        "Failed to toggle two-factor authentication. Please try again."
      );
    },
    onSuccess: (data) => {
      toast.success("Two-factor authentication toggled successfully");
    },
  });

  return {
    toggleTwoFactor,
    isToggling,
    isToggleError,
  };
}
