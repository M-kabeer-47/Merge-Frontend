import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

interface ForgotPasswordPayload {
  email: string;
}

export default function useForgotPassword() {
  const forgotPasswordFunction = async (payload: ForgotPasswordPayload) => {
    const response = await api.post("/auth/forgot-password", payload);
    return response.data;
  };

  const {
    isPending,
    isError,
    isSuccess,
    mutateAsync: sendResetLink,
  } = useMutation({
    mutationFn: forgotPasswordFunction,
    onError: () => {
      toast.error("Failed to send reset link. Please try again.");
    },
    onSuccess: () => {
      toast.success("Password reset link sent to your email");
    },
  });

  return {
    sendResetLink,
    isPending,
    isError,
    isSuccess,
  };
}
