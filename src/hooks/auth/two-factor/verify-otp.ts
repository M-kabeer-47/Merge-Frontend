import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

interface UseVerifyOTPProps {
  email: string;
  otp: string;
}

export default function useVerifyOTP({ email, otp }: UseVerifyOTPProps) {
  const verifyOTPFunction = async () => {
    let response = await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin/otp`, {
        otpCode: otp,
        email: email.toLowerCase(),
      })
    );
    return response.data;
  };

  const {
    isPending: isVerifying,
    isError: isVerifyError,
    mutateAsync: verifyOTP,
  } = useMutation({
    mutationFn: verifyOTPFunction,
    onError: async (error: any) => {
      toast.error("Failed to verify OTP. Please try again.");
    },
    onSuccess: (data) => {
      toast.success("OTP verified successfully");
      if (data?.token && data?.refreshToken && data?.userId) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userId", data.userId);
        window.location.href = "/dashboard";
      }
    },
  });

  return {
    verifyOTP,
    isVerifyError,
    isVerifying,
  };
}
