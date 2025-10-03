import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export default function useTwoFactorVerification() {
  const resendOTPFunction = async ({ email }: { email: string }) => {
    return await apiRequest(axios.post("/auth/resend-otp", { email }));
  };
  const verifyOTPFunction = async ({
    otp,
    email,
  }: {
    otp: string;
    email: string;
  }) => {
    return await apiRequest(axios.post("/auth/signin/otp", { otp, email }));
  };

  const {
    isPending,
    isError,
    mutateAsync: resendOTP,
  } = useMutation({
    mutationFn: resendOTPFunction,
    onError: (error: any) => {
      toast.error("Failed to resend OTP. Please try again.");
    },
    onSuccess: (data) => {
      toast.success("OTP resent successfully");
    },
  });

  const {
    isPending: isVerifying,
    isError: isVerifyError,
    mutateAsync: verifyOTP,
  } = useMutation({
    mutationFn: verifyOTPFunction,
    onError: (error: any) => {
      toast.error("Failed to verify OTP. Please try again.");
    },
    onSuccess: (data) => {
      toast.success("OTP verified successfully");
    },
  });

  return {
    resendOTP,
    verifyOTP,
    isPending,
    isError,
  };
}
