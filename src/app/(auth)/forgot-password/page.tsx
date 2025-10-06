"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, ArrowLeft, Mail, Send } from "lucide-react";
import useForgotPassword from "@/hooks/auth/forgot-password";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { sendResetLink, isPending, isSuccess } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    try {
      await sendResetLink({ email });
    } catch (error) {
      console.error("Failed to send reset link:", error);
    }
  };

  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
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

        {!isSuccess ? (
          <>
            {/* Key Icon */}
            <motion.div
              className="mx-auto mb-6 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center"
              transition={{
                stiffness: 200,
                damping: 15,
                duration: 0.2,
              }}
            >
              <KeyRound className="w-8 h-8 text-primary" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-heading text-center mb-2"
            >
              Forgot Password?
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-para text-center mb-8"
            >
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </motion.p>

            {/* Email Input Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email Input */}
              <div className="relative">
                <FormField
                  label="Email Address"
                  htmlFor="email"
                  children={
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  }
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isPending || !email.trim()} className="w-full">
                {isPending ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </motion.form>

            {/* Sign In Link */}
          </>
        ) : (
          // Success State
          <>
            {/* Success Icon */}
            <motion.div
              className="mx-auto mb-6 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                />
              </motion.svg>
            </motion.div>

            {/* Success Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-heading text-center mb-2"
            >
              Check Your Email
            </motion.h1>

            {/* Success Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-para text-center mb-8"
            >
              We've sent a password reset link to{" "}
              <span className="font-semibold text-primary">{email}</span>
              <br />
              <br />
              Please check your inbox and follow the instructions to reset your
              password.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <Button onClick={() => router.push("/signin")} className="w-full">
                Back to Sign In
              </Button>
              <Button
                onClick={() => {
                  setEmail("");
                  window.location.reload();
                }}
                className="w-full"
                variant={"outline"}
              >
                Try Another Email
              </Button>
            </motion.div>
          </>
        )}

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-xs text-para-muted text-center mt-6"
        >
          🔒 For security, the reset link will expire in 1 hour
        </motion.p>
      </motion.div>
    </div>
  );
}
