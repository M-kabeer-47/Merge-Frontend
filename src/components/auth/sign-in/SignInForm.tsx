"use client";
import React from "react";
import { easeOut, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { signInSchema, SignInType } from "@/schemas/auth/signIn";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
import Link from "next/link";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easeOut,
    },
  },
};

export default function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const signInWithGoogle = () => {
    console.log("Sign in with Google clicked");
    toast.info("Google Sign-In integration coming soon!");
  };

  const submitForm = (data: SignInType) => {
    console.log("Form submitted successfully:", data);
    toast.success("Welcome back!");
  };

  return (
    <motion.div
      className="flex flex-col h-full justify-center px-8 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full mx-auto">
        {/* Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-raleway font-bold text-heading mb-2">
            Welcome Back
          </h1>
          <p className="text-para-muted">
            Sign in to continue your learning journey
          </p>
        </motion.div>

        {/* Google Sign In Button */}
        <motion.div className="mb-6" variants={itemVariants}>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            onClick={signInWithGoogle}
          >
            <motion.div
              className="flex items-center justify-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-para font-medium">
                Continue with Google
              </span>
            </motion.div>
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div className="mb-6" variants={itemVariants}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-para-muted">
                Or continue with email
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form Fields */}
        <motion.form
          className="space-y-5"
          variants={itemVariants}
          onSubmit={handleSubmit(submitForm)}
        >
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormField
                label="Email"
                htmlFor="email"
                error={errors.email?.message}
              >
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                />
              </FormField>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormField
                label="Password"
                htmlFor="password"
                error={errors.password?.message}
              >
                <Input
                  {...field}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                />
              </FormField>
            )}
          />

          {/* Remember Me & Forgot Password */}
          <motion.div
            className="flex items-center justify-between"
            variants={itemVariants}
          >
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full mt-4 bg-primary hover:bg-primary/90 transition-all duration-200"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner /> : "Sign In"}
            </Button>
          </motion.div>
        </motion.form>

        {/* Sign Up Link */}
        <motion.div className="mt-6 text-center" variants={itemVariants}>
          <p className="text-para-muted text-sm">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
