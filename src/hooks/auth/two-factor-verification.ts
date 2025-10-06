import useVerifyOTP from "./two-factor/verify-otp";
import useResendOTP from "./two-factor/resend-otp";
import useToggleTwoFactor from "./two-factor/toggle-two-factor";

interface UseTwoFactorVerificationProps {
  email?: string;
  setCanResend?: (value: boolean) => void;
  setResendTimer?: (value: number) => void;
  twoFactorEnabled?: boolean;
  password?: string;
}

export default function useTwoFactorVerification({
  email = "",
  setCanResend,
  setResendTimer,
  twoFactorEnabled = false,
  password = "",
}: UseTwoFactorVerificationProps) {
  // Verify OTP hook
  const verifyOTPHook = email
    ? useVerifyOTP({ email })
    : { verifyOTP: async () => {}, isVerifyError: false, isVerifying: false };

  // Resend OTP hook
  const resendOTPHook =
    email && setCanResend && setResendTimer
      ? useResendOTP({ email, setCanResend, setResendTimer })
      : {
          resendOTP: async () => {},
          isResendError: false,
          isResending: false,
        };

  // Toggle Two Factor hook
  const toggleTwoFactorHook =
    password !== ""
      ? useToggleTwoFactor({ twoFactorEnabled, password })
      : {
          toggleTwoFactor: async () => {},
          isToggling: false,
          isToggleError: false,
        };

  return {
    // Verify OTP
    verifyOTP: verifyOTPHook.verifyOTP,
    isVerifyError: verifyOTPHook.isVerifyError,
    isVerifying: verifyOTPHook.isVerifying,

    // Resend OTP
    resendOTP: resendOTPHook.resendOTP,
    isResendError: resendOTPHook.isResendError,
    isResending: resendOTPHook.isResending,

    // Toggle Two Factor
    toggleTwoFactor: toggleTwoFactorHook.toggleTwoFactor,
    isToggling: toggleTwoFactorHook.isToggling,
    isToggleError: toggleTwoFactorHook.isToggleError,
  };
}

