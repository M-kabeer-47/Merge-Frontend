import { getWithAuth } from "./fetch-with-auth";
import type {
  StudentAssignment,
  InstructorAssignment,
} from "@/types/assignment";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface FetchAssignmentsParams {
  roomId: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
  filter?: string;
}

interface StudentAssignmentsResponse {
  assignments?: StudentAssignment[];
}

interface InstructorAssignmentsResponse {
  assignments?: InstructorAssignment[];
}

/**
 * Server-side fetch for STUDENT assignments
 * Calls student-specific endpoint with submission data
 */
export async function getStudentAssignments(
  params: FetchAssignmentsParams
): Promise<StudentAssignment[]> {
  const { roomId, sortBy, sortOrder, search, filter } = params;

  // Build query string
  const queryParams = new URLSearchParams({ roomId });
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (sortOrder) queryParams.append("sortOrder", sortOrder.toUpperCase());
  if (search) queryParams.append("search", search);
  if (filter) queryParams.append("filter", filter);

  const { data, error } = await getWithAuth<
    StudentAssignmentsResponse | StudentAssignment[]
  >(`${API_BASE_URL}/assignments/student?${queryParams.toString()}`, {
    next: {
      revalidate: 60,
      tags: ["assignments", `student-assignments-${roomId}`],
    },
  });

  if (error || !data) {
    console.error("Error fetching student assignments:", error?.message);

    return [];
  }
  console.log("Data: " + JSON.stringify(data));

  return Array.isArray(data) ? data : data.assignments || [];
}

/**
 * Server-side fetch for INSTRUCTOR assignments
 * Calls instructor-specific endpoint with submission stats
 */
export async function getInstructorAssignments(
  params: FetchAssignmentsParams
): Promise<InstructorAssignment[]> {
  const { roomId, sortBy, sortOrder, search, filter = "all" } = params;

  // Build query string
  const queryParams = new URLSearchParams({ roomId });
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (sortOrder) queryParams.append("sortOrder", sortOrder);
  if (search) queryParams.append("search", search);
  if (filter) queryParams.append("filter", filter);

  const { data, error } = await getWithAuth<
    InstructorAssignmentsResponse | InstructorAssignment[]
  >(`${API_BASE_URL}/assignments/instructor?${queryParams.toString()}`, {
    next: {
      revalidate: false,
      tags: ["assignments", `instructor-assignments-${roomId}`],
    },
  });

  if (error || !data) {
    console.error("Error fetching instructor assignments:", error);
    return [];
  }

  return Array.isArray(data) ? data : data.assignments || [];
}

export async function getAssignmentById(assignmentId: string) {
  const url = `/assignments/${assignmentId}`;

  const data = await getWithAuth(url, {
    next: {
      revalidate: false,
      tags: ["assignments", `assignment-${assignmentId}`],
    },
  });

  return data;
}
