import { Suspense } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export const dynamic = 'force-dynamic';

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-main-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
