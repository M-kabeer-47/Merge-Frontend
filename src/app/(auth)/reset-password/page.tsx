import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import AuthPageSkeleton from "@/components/ui/skeletons/AuthPageSkeleton";

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      <Suspense fallback={<AuthPageSkeleton />}>
        <ResetPasswordForm />
      </Suspense>

    </div>
  );
}
