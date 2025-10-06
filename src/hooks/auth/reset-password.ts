import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export default function useResetPassword() {
  const resetPasswordFunction = async (payload: ResetPasswordPayload) => {
    return await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/reset-password`, payload)
    );
  };

  const {
    isPending,
    isError,
    isSuccess,
    mutateAsync: resetPassword,
  } = useMutation({
    mutationFn: resetPasswordFunction,
    onError: (error: any) => {
      toast.error("Failed to reset password. Please try again.");
    },
    onSuccess: (data) => {
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
