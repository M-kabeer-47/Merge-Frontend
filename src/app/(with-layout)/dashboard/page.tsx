import { Suspense } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-main-background">
      <Suspense
        fallback={
          <div className="sm:px-6 px-4 sm:py-6 py-4">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-gray-200 rounded-lg" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-lg" />
                <div className="h-64 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
