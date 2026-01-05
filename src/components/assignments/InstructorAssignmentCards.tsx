import { getInstructorAssignments } from "@/server-api/assignments";
import InstructorAssignmentCardsClient from "./InstructorAssignmentCardsClient";

interface InstructorAssignmentCardsProps {
  roomId: string;
  search?: string;
  sortBy?: string;
  filter?: string;
}

// Server component that fetches instructor assignment data
export default async function InstructorAssignmentCards({
  roomId,
  search,
  sortBy,
  filter,
}: InstructorAssignmentCardsProps) {
  // Server-side fetch with Next.js caching - calls INSTRUCTOR endpoint
  const instructorAssignments = await getInstructorAssignments({
    roomId,
    sortBy,
    search,
  });

  return (
    <div className="flex gap-4">
      <InstructorAssignmentCardsClient
        assignments={instructorAssignments}
        roomId={roomId}
        filter={filter}
        searchTerm={search || ""}
      />
    </div>
  );
}
