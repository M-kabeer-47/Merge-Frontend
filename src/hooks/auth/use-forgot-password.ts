import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface ForgotPasswordPayload {
  email: string;
}

export default function useForgotPassword() {
  const forgotPasswordFunction = async (payload: ForgotPasswordPayload) => {
    return await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`, payload)
    );
  };

  const {
    isPending,
    isError,
    isSuccess,
    mutateAsync: sendResetLink,
  } = useMutation({
    mutationFn: forgotPasswordFunction,
    onError: (error: any) => {
      toast.error("Failed to send reset link. Please try again.");
    },
    onSuccess: (data) => {
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
