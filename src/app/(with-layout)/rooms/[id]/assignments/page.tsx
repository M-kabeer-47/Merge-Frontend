import { Suspense } from "react";
import AssignmentListHeader from "@/components/assignments/AssignmentListHeader";
import AssignmentsDataWrapper from "@/components/assignments/AssignmentsDataWrapper";
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
  const { search, sortBy, filter } = await searchParams;

  // Create a key that changes when search params change
  const suspenseKey = `${search}-${sortBy}-${filter}`;

  return (
    <div className="h-full flex flex-col bg-main-background">
      <AssignmentListHeader
        roomId={roomId}
        initialSearch={search}
        initialSort={sortBy}
        initialFilter={filter as AssignmentFilterType}
      />
      <Suspense key={suspenseKey} fallback={<AssignmentCardsSkeleton />}>
        <AssignmentsDataWrapper
          roomId={roomId}
          search={search}
          sortBy={sortBy}
          filter={filter}
        />
      </Suspense>
    </div>
  );
}
