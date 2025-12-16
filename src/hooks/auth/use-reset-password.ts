import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export default function useResetPassword() {
  const resetPasswordFunction = async (payload: ResetPasswordPayload) => {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
  };

  const {
    isPending,
    isError,
    isSuccess,
    mutateAsync: resetPassword,
  } = useMutation({
    mutationFn: resetPasswordFunction,
    onError: () => {
      toast.error("Failed to reset password. Please try again.");
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
  });

  return {
    resetPassword,
    isPending,
    isError,
    isSuccess,
  };
}
