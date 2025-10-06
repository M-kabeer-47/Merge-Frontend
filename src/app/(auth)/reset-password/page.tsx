"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import useResetPassword from "@/hooks/auth/reset-password";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  resetPasswordSchema,
  type ResetPasswordType,
} from "@/schemas/auth/reset-password";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword, isPending, isSuccess } = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const onSubmit = async (data: ResetPasswordType) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    try {
      await resetPassword({ token, newPassword: data.password });
    } catch (error) {
      console.error("Failed to reset password:", error);
    }
  };

  // Redirect if no token
  if (!token) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background border border-light-border rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <h2 className="text-2xl font-bold text-heading mb-4">
            Invalid Reset Link
          </h2>
          <p className="text-para mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Button
            onClick={() => router.push("/forgot-password")}
            className="w-full"
          >
            Request New Link
          </Button>
        </motion.div>
      </div>
    );
  }

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
          onClick={() => router.push("/signin")}
          className="flex items-center gap-2 text-para-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Sign In</span>
        </button>

        {!isSuccess ? (
          <>
            {/* Lock Icon */}
            <motion.div
              className="mx-auto mb-6 w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center"
              transition={{
                stiffness: 200,
                damping: 15,
                duration: 0.2,
              }}
            >
              <Lock className="w-8 h-8 text-primary" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-bold text-heading text-center mb-2"
            >
              Reset Your Password
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-para text-center mb-8"
            >
              Please enter your new password below. Make sure it's strong and
              secure.
            </motion.p>

            {/* Password Reset Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* New Password Input */}
              <FormField
                label="New Password"
                htmlFor="password"
                error={errors.password?.message}
              >
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-para-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Confirm Password Input */}
              <FormField
                label="Confirm Password"
                htmlFor="confirmPassword"
                error={errors.confirmPassword?.message}
              >
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-para-muted hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Password Requirements */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending || !isValid}
                className="w-full"
              >
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
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </Button>
            </motion.form>
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
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
              Password Reset Successful!
            </motion.h1>

            {/* Success Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-para text-center mb-8"
            >
              Your password has been successfully reset. You can now sign in
              with your new password.
            </motion.p>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button onClick={() => router.push("/signin")} className="w-full">
                Continue to Sign In
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
          🔒 Your password is encrypted and secure
        </motion.p>
      </motion.div>
    </div>
  );
}
