import { Suspense } from "react";
import TwoFactorContent from "@/components/auth/TwoFactorContent";
import AuthPageSkeleton from "@/components/ui/skeletons/AuthPageSkeleton";

export const dynamic = 'force-dynamic';

export default function TwoFactorPage() {
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      <Suspense fallback={<AuthPageSkeleton />}>
        <TwoFactorContent />
      </Suspense>
    </div>
  );
}
