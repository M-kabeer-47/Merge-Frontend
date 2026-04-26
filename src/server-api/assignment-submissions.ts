import { getWithAuth } from "@/server-api/fetch-with-auth";
import type { InstructorAssignment, StudentAssignment } from "@/types/assignment";
import { API_BASE_URL } from "@/lib/constants/api";

/**
 * Server-side fetch for instructor assignment view.
 * Returns full assignment data including initial attempts.
 */
export async function getAssignmentForInstructor(
  roomId: string,
  assignmentId: string
): Promise<InstructorAssignment | null> {
  if (!roomId || !assignmentId) {
    console.error(
      "getAssignmentForInstructor: roomId and assignmentId are required"
    );
    return null;
  }
  
  const { data, error } = await getWithAuth<InstructorAssignment>(
    `${API_BASE_URL}/assignments/instructor/${assignmentId}?roomId=${roomId}`,
    {
      next: {
        revalidate: 0,
        tags: [
          "assignments",
          `assignment-${assignmentId}`,
          `assignment-instructor-${assignmentId}`,
        ],
      },
    }
  );
  console.log("Data",JSON.stringify(data?.attempts));
  if (error || !data) {
    console.error("Error fetching instructor assignment:", error);
    return null;
  }

  return data;
}

/**
 * Server-side fetch for student assignment view.
 * Returns assignment data with student-specific submission info.
 */
export async function getAssignmentForStudent(
  roomId: string,
  assignmentId: string
): Promise<StudentAssignment | null> {
  if (!roomId || !assignmentId) {
    console.error(
      "getAssignmentForStudent: roomId and assignmentId are required"
    );
    return null;
  }

  const { data, error } = await getWithAuth<StudentAssignment>(
    `${API_BASE_URL}/assignments/student/${assignmentId}?roomId=${roomId}`,
    {
      next: {
        revalidate: 0,
        tags: [
          "assignments",
          `assignment-${assignmentId}`,
          `assignment-student-${assignmentId}`,
        ],
      },
    }
  );

  if (error || !data) {
    console.error("Error fetching student assignment:", error);
    return null;
  }

  return data;
}
