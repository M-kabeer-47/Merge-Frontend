import { Suspense } from "react";
import { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dashboard | Merge",
  description: "Your personalized learning dashboard - track progress, view courses, and manage your learning journey",
  keywords: ["dashboard", "learning", "courses", "progress", "student"],
  openGraph: {
    title: "Dashboard | Merge",
    description: "Your personalized learning dashboard",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-main-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
