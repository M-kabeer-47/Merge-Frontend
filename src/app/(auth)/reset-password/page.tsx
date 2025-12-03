import { Suspense } from "react";
import { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthPageSkeleton from "@/components/ui/skeletons/AuthPageSkeleton";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Reset Password | Merge",
  description: "Create a new password for your Merge account",
  openGraph: {
    title: "Reset Password | Merge",
    description: "Create a new password for your Merge account",
    type: "website",
  },
};

function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      <Suspense fallback={<AuthPageSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

export default ResetPasswordPage;
