import { getStudentAssignments } from "@/server-api/assignments";
import StudentAssignmentCardsClient from "./StudentAssignmentCardsClient";

interface StudentAssignmentCardsProps {
  roomId: string;
  search?: string;
  sortBy?: string;
  filter?: string;
}

// Server component that fetches student assignment data
export default async function StudentAssignmentCards({
  roomId,
  search,
  sortBy,
  filter,
}: StudentAssignmentCardsProps) {
  // Server-side fetch with Next.js caching - calls STUDENT endpoint
  const studentAssignments = await getStudentAssignments({
    roomId,
    sortBy,
    search,
  });

  return (
    <div className="flex flex-row gap-4">
      <StudentAssignmentCardsClient
        assignments={studentAssignments}
        roomId={roomId}
        filter={filter}
        searchTerm={search || ""}
      />
    </div>
  );
}
