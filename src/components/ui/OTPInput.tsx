"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  loading?: boolean;
  error?: string;
  className?: string;
  otp: string[];
  setOTP: (otp: string[]) => void;
}

export default function OTPInput({
  otp,
  setOTP,
  length = 6,
  onComplete,
  loading = false,
  error,
  className = "",
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOTP(newOtp);

    // Move to next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOTP(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOTP(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < length; i++) {
      if (!isNaN(Number(pastedData[i]))) {
        newOtp[i] = pastedData[i];
      }
    }

    setOTP(newOtp);

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  // Clear OTP when loading changes to false (for retry scenarios)
  useEffect(() => {
    if (!loading) {
      setOTP(new Array(length).fill(""));
    }
  }, [loading, length]);

  useEffect(() => {
    // Focus the first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={loading}
            className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg 
              transition-all duration-200 focus:outline-none text-heading
              ${
                error
                  ? "border-destructive/50 bg-destructive/5 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                  : "border-light-border hover:border-secondary/30 focus:border-1 focus:border-white focus:ring-2 focus:ring-secondary/70"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : ""}
              ${digit ? "border-secondary bg-secondary/5" : ""}
            `}
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive text-center font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
