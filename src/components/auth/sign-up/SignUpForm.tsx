"use client";
import { useEffect, useRef } from "react";
import { easeOut, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import RoleSelectionCards from "./RoleSelectionCards";
import { userSchema, UserType } from "@/schemas/user/user";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useSignUp from "@/hooks/auth/use-sign-up";

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
  const { signUpUser, isError, isPending } = useSignUp();
  const {
    register,
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
      role: "student",
    },
  });

  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);
  const submitForm = async (data: Partial<UserType>) => {
    let formData = {
      ...data,
    };
    delete formData.confirmPassword;
    signUpUser(formData as UserType);
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
          <p className="text-para-muted">
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
            <FormField
              label="First Name"
              htmlFor="firstName"
              error={errors.firstName?.message}
            >
              <Input
                {...register("firstName")}
                id="firstName"
                placeholder="John"
                error={errors.firstName?.message}
              />
            </FormField>

            <FormField
              label="Last Name"
              htmlFor="lastName"
              error={errors.lastName?.message}
            >
              <Input
                {...register("lastName")}
                id="lastName"
                placeholder="Doe"
                error={errors.lastName?.message}
              />
            </FormField>
          </motion.div>

          {/* Email */}
          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email?.message}
          >
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
            />
          </FormField>

          {/* Password */}
          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
          >
            <PasswordInput
              {...register("password")}
              id="password"
              placeholder="Create a strong password"
              error={errors.password?.message}
            />
          </FormField>

          {/* Confirm Password */}
          <FormField
            label="Confirm Password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              {...register("confirmPassword")}
              id="confirmPassword"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
            />
          </FormField>

          {/* Submit Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full mt-8 bg-primary hover:bg-primary/90 transition-all duration-200 cursor-pointer"
              size="sm"
              onClick={() => {
                console.log("Errors: ", errors);
              }}
              disabled={isPending}
            >
              {isPending ? <LoadingSpinner /> : "Create Account"}
            </Button>
          </motion.div>
        </motion.form>

        {/* Sign In Link */}
        <motion.div className="mt-4 text-center" variants={itemVariants}>
          <p className="text-para-muted text-sm">
            Already have an account?{" "}
            <motion.a
              href="/sign-in"
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
