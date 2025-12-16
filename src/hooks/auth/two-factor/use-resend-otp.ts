import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/utils/api";

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
    const response = await api.post("/auth/resend-otp", {
      email: email.toLowerCase(),
    });
    return response.data;
  };

  const {
    isPending: isResending,
    isError: isResendError,
    mutateAsync: resendOTP,
  } = useMutation({
    mutationFn: resendOTPFunction,
    onError: () => {
      toast.error("Failed to resend OTP. Please try again.");
    },
    onSuccess: () => {
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
