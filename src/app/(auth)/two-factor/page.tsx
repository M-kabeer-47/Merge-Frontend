import { Suspense } from "react";
import { Metadata } from "next";
import TwoFactorContent from "@/components/auth/TwoFactorContent";
import AuthPageSkeleton from "@/components/ui/skeletons/AuthPageSkeleton";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Two-Factor Authentication | Merge",
  description: "Enter your verification code to complete sign in",
  openGraph: {
    title: "Two-Factor Authentication | Merge",
    description: "Enter your verification code to complete sign in",
    type: "website",
  },
};

function TwoFactorPage() {
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      <Suspense fallback={<AuthPageSkeleton />}>
        <TwoFactorContent />
      </Suspense>
    </div>
  );
}

export default TwoFactorPage;
