import { Suspense } from "react";
import SuccessContent from "@/components/success/SuccessContent";
import SuccessPageSkeleton from "@/components/ui/skeletons/SuccessPageSkeleton";

export const dynamic = 'force-dynamic';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      <Suspense fallback={<SuccessPageSkeleton />}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
