import AssignmentListHeader from "@/components/assignments/AssignmentListHeader";
import AssignmentsList from "@/components/assignments/AssignmentsList";
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

  return (
    <div className="h-full flex flex-col bg-main-background">
      <AssignmentListHeader
        roomId={roomId}
        initialSearch={search}
        initialSort={sortBy}
        initialFilter={filter as AssignmentFilterType}
      />
      {/* AssignmentsList is now a client component that:
          - Uses useRoom() to get user role (already fetched in layout)
          - Uses useSearchParams() to read URL filters
          - Fetches assignments via React Query based on role
      */}
      <AssignmentsList roomId={roomId} />
    </div>
  );
}
