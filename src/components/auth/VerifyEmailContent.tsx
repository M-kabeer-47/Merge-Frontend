"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import useVerifyEmail from "@/hooks/auth/use-verify-email";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail, isPending, isError } = useVerifyEmail({
    token: token || "",
  });

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else if (isError || !token) {
      router.push("/sign-in?error=no-token");
    }
  }, [token, verifyEmail, router, isError]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
    >
      {/* Loading State */}
      {isPending && (
        <>
          <div className="mb-4">
            <LoadingSpinner children={<></>} loaderColor="heading" size="md" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Your Email
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </>
      )}

      {/* Error State */}
      {isError && (
        <>
          <motion.div
            className="mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't verify your email. The link may have expired or is
            invalid
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/sign-in")}
              variant="default"
              className="w-full"
              size={"lg"}
            >
              Go to Sign In
            </Button>
            <Button
              onClick={() => router.push("/sign-up")}
              variant="outline"
              className="w-full"
              size={"lg"}
            >
              Create New Account
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
}
