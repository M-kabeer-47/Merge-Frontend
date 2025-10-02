"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

export default function OTPInput({
  length = 6,
  onComplete,
  loading = false,
  error,
  className = "",
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

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
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
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

    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  // Clear OTP when loading changes to false (for retry scenarios)
  useEffect(() => {
    if (!loading) {
      setOtp(new Array(length).fill(""));
    }
  }, [loading, length]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={loading}
            className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg 
              transition-all duration-200 focus:outline-none
              ${
                error
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20"
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
          className="text-sm text-red-600 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
