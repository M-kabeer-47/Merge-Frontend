import apiRequest from "@/utils/api-request";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import usesRotateToken from "@/utils/rotate-token";

interface UseResendOTPProps {
  email: string;
  setCanResend: (value: boolean) => void;
  setResendTimer: (value: number) => void;
}

export default function useResendOTP({
  email,
  setCanResend,
  setResendTimer,
}: UseResendOTPProps) {
  const resendOTPFunction = async () => {
    return await apiRequest(
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/resend-otp`, {
        email: email.toLowerCase(),
      })
    );
  };

  const {
    isPending: isResending,
    isError: isResendError,
    mutateAsync: resendOTP,
  } = useMutation({
    mutationFn: resendOTPFunction,
    onError: async (error: any) => {
      toast.error("Failed to resend OTP. Please try again.");
    },
    onSuccess: (data) => {
      setResendTimer(60);
      setCanResend(false);
      toast.success("OTP resent successfully");
    },
  });

  return {
    resendOTP,
    isResending,
  };
}
