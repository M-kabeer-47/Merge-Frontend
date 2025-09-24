"use client";
import React, { useState } from "react";
import { easeOut, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import RoleSelectionCards from "./RoleSelectionCards";
import { partialUserSchema, userSchema, UserType } from "@/schemas/user/user";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "sonner";
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

export default function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });
  const submitForm = async (data: Partial<UserType>) => {
    console.log("Form submitted successfully:", data);
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast.success("Account created successfully!");
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
            Create Account
          </h1>
          <p className="text-normal-text-muted">
            Choose your role and get started with Merge
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div variants={itemVariants}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <RoleSelectionCards
                value={field.value}
                onChange={field.onChange}
                error={errors.role?.message}
              />
            )}
          />
        </motion.div>

        {/* Form Fields */}
        <motion.form
          className="space-y-5"
          variants={itemVariants}
          onSubmit={handleSubmit(submitForm)}
        >
          {/* Name Fields */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={itemVariants}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <FormField
                  label="First Name"
                  htmlFor="firstName"
                  error={errors.firstName?.message}
                >
                  <Input
                    {...field}
                    id="firstName"
                    placeholder="John"
                    error={errors.firstName?.message}
                  />
                </FormField>
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Last Name"
                  htmlFor="lastName"
                  error={errors.lastName?.message}
                >
                  <Input
                    {...field}
                    id="lastName"
                    placeholder="Doe"
                    error={errors.lastName?.message}
                  />
                </FormField>
              )}
            />
          </motion.div>

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
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                />
              </FormField>
            )}
          />

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <FormField
                label="Confirm Password"
                htmlFor="confirmPassword"
                error={errors.confirmPassword?.message}
              >
                <Input
                  {...field}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  error={errors.confirmPassword?.message}
                />
              </FormField>
            )}
          />

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full mt-8 bg-primary hover:bg-primary/90 transition-all duration-200 cursor-pointer"
              size="lg"
              onClick={() => {console.log("Errors: ", errors);}}
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner /> : "Create Account"}
            </Button>
          </motion.div>
        </motion.form>

        {/* Sign In Link */}
        <motion.div className="mt-4 text-center" variants={itemVariants}>
          <p className="text-normal-text-muted text-sm">
            Already have an account?{" "}
            <motion.a
              href="/signin"
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Sign in
            </motion.a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
