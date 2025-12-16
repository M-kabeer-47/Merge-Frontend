import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

interface UseToggleTwoFactorProps {
  twoFactorEnabled: boolean;
  password: string;
}

export default function useToggleTwoFactor({
  twoFactorEnabled,
  password,
}: UseToggleTwoFactorProps) {
  const toggleTwoFactorFunction = async () => {
    const response = await api.post("/auth/2fa/toggle", {
      enable: !twoFactorEnabled,
      password,
    });
    return response.data;
  };

  const {
    isPending: isToggling,
    isError: isToggleError,
    mutateAsync: toggleTwoFactor,
  } = useMutation({
    mutationFn: toggleTwoFactorFunction,
    onError: () => {
      toast.error(
        "Failed to toggle two-factor authentication. Please try again."
      );
    },
    onSuccess: () => {
      toast.success("Two-factor authentication toggled successfully");
    },
  });

  return {
    toggleTwoFactor,
    isToggling,
    isToggleError,
  };
}
