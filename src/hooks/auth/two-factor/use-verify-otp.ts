import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

interface UseVerifyOTPProps {
  email: string;
  otp: string;
}

export default function useVerifyOTP({ email, otp }: UseVerifyOTPProps) {
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
    onSuccess: (data) => {
      toast.success("OTP verified successfully");
      // Backend sets cookies via Set-Cookie headers through the proxy
      if (data?.token && data?.refreshToken) {
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
