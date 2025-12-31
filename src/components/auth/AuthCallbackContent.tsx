"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { setAuthTokens } from "@/utils/auth-tokens";

export default function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams?.get("token");
    const refreshToken = searchParams?.get("refreshToken");
    const redirect = searchParams?.get("redirect") || "/rooms";

    if (token && refreshToken) {
      // Store tokens in both localStorage and cookies
      setAuthTokens(token, refreshToken);

      // Invalidate the user query so it refetches with the new token
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      
      // Redirect to the intended destination
      router.replace(redirect);
    } else {
      setError("Missing authentication tokens. Please try logging in again.");
    }
  }, [searchParams, router, queryClient]);

  if (error) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-heading mb-4">
            Authentication Error
          </h1>
          <p className="text-para-muted mb-6">{error}</p>
          <a
            href="/sign-in"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-para-muted">Completing authentication...</p>
      </div>
    </div>
  );
}
