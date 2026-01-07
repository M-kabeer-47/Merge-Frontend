import {
  getStudentAssignments,
  getInstructorAssignments,
} from "@/server-api/assignments";
import AssignmentsList from "./AssignmentsList";

interface AssignmentsDataWrapperProps {
  roomId: string;
  search?: string;
  sortBy?: string;
  filter?: string;
}

export default async function AssignmentsDataWrapper({
  roomId,
  search,
  sortBy,
  filter,
}: AssignmentsDataWrapperProps) {
  // Fetch both in parallel - one will be used based on user role
  const [instructorAssignments, studentAssignments] = await Promise.all([
    [],
    getStudentAssignments({ roomId, search, sortBy, filter }),
  ]);

  return (
    <AssignmentsList
      instructorAssignments={instructorAssignments}
      studentAssignments={studentAssignments}
      roomId={roomId}
      filter={filter}
      searchTerm={search || ""}
    />
  );
}
