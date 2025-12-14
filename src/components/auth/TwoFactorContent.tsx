"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Mail } from "lucide-react";
import OTPInput from "@/components/ui/OTPInput";
import useVerifyOTP from "@/hooks/auth/two-factor/use-verify-otp";
import useResendOTP from "@/hooks/auth/two-factor/use-resend-otp";

export default function TwoFactorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") || "your email";
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { verifyOTP, isVerifyError, isVerifying } = useVerifyOTP({
    email: email || "",
    otp: otp.join(""),
  });
  const { resendOTP, isResending } = useResendOTP({
    email: email || "",
    setCanResend,
    setResendTimer,
  });

  const handleOTPComplete = (otp: string) => {
    verifyOTP();
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    resendOTP();
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background border border-light-border rounded-2xl shadow-2xl p-8 max-w-md w-full"
    >
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-para-muted hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Shield Icon */}
      <motion.div
        className="mx-auto mb-6 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.3,
        }}
      >
        <Shield className="w-8 h-8 text-primary" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-heading text-center mb-2"
      >
        Two-Factor Authentication
      </motion.h1>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 text-para text-center mb-8"
      >
        <Mail className="w-4 h-4 text-secondary" />
        <p className="text-sm whitespace-nowrap">
          We've sent a verification code to your email
        </p>
      </motion.div>

      {/* OTP Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <OTPInput
          length={6}
          onComplete={handleOTPComplete}
          loading={isVerifying || isResending}
          error={isVerifyError ? "Invalid code. Please try again." : undefined}
          setOTP={setOtp}
          otp={otp}
        />
      </motion.div>

      {/* Resend Code */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <p className="text-sm text-para-muted mb-2">
          Didn't receive the code?
        </p>
        <button
          onClick={handleResendCode}
          disabled={!canResend || isResending || isVerifying}
          className={`text-sm font-semibold transition-colors ${
            canResend && !isResending && !isVerifying
              ? "text-primary hover:text-primary cursor-pointer"
              : "text-para-muted cursor-not-allowed"
          }`}
        >
          {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
        </button>
      </motion.div>

      {/* Security Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-para-muted text-center mt-6"
      >
        🔒 This extra layer of security helps protect your account
      </motion.p>
    </motion.div>
  );
}
