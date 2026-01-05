import { Suspense } from "react";
import { cookies } from "next/headers";
import AssignmentListHeader from "@/components/assignments/AssignmentListHeader";
import StudentAssignmentCards from "@/components/assignments/StudentAssignmentCards";
import InstructorAssignmentCards from "@/components/assignments/InstructorAssignmentCards";
import AssignmentCardsSkeleton from "@/components/assignments/AssignmentCardsSkeleton";
import type { AssignmentFilterType } from "@/types/assignment";

interface AssignmentsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
  }>;
}

export default async function AssignmentsPage({
  params,
  searchParams,
}: AssignmentsPageProps) {
  const { id: roomId } = await params;
  const { search, sortBy, sortOrder, filter } = await searchParams;

  // Get user role from cookies (set during authentication)
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value || "student";
  const isInstructor = true;

  // Create a key that changes when search params change
  // This forces Suspense to re-trigger and show the fallback
  const suspenseKey = `${search}-${sortBy}-${sortOrder}-${filter}`;

  return (
    <div className="h-full flex flex-col bg-main-background">
      {/* Header - always visible */}
      <AssignmentListHeader
        roomId={roomId}
        isInstructor={isInstructor}
        initialSearch={search}
        initialSort={sortBy}
        initialFilter={filter as AssignmentFilterType}
      />

      {/* Assignment Cards - shows skeleton during loading */}
      <Suspense key={suspenseKey} fallback={<AssignmentCardsSkeleton />}>
        {isInstructor ? (
          <InstructorAssignmentCards
            roomId={roomId}
            search={search}
            sortBy={sortBy}
            filter={filter}
          />
        ) : (
          <StudentAssignmentCards
            roomId={roomId}
            search={search}
            sortBy={sortBy}
            filter={filter}
          />
        )}
      </Suspense>
    </div>
  );
}
