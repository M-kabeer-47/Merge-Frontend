import { Metadata } from "next";
import { Suspense } from "react";
import AuthCallbackContent from "@/components/auth/AuthCallbackContent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Authenticating... | Merge",
  description: "Completing your authentication",
};

function CallbackFallback() {
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-para-muted">Loading...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
