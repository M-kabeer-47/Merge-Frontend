import { Suspense } from "react";
import VerifyEmailContent from "@/components/auth/VerifyEmailContent";
import VerifyPageSkeleton from "@/components/ui/skeletons/VerifyPageSkeleton";

export const dynamic = 'force-dynamic';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <Suspense fallback={<VerifyPageSkeleton />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
