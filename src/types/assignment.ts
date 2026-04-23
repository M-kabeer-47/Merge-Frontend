// Assignment Types for Assignments Tab — matches backend API response

export type SubmissionStatus = "pending" | "submitted" | "graded" | "missed";

export type InstructorAssignmentStatus =
  | "closed"
  | "needs_grading"
  | "graded";

export type AssignmentSortOption = "dueDate" | "points" | "title" | "status";

export type AssignmentFilterType =
  // Student filters
  | "all"
  | "pending"
  | "missed"
  | "submitted"
  // Instructor filters
  | "needs_grading"
  | "graded";

export interface AssignmentAuthor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

export interface BaseAssignment {
  id: string;
  title: string;
  description: string | null;
  author: AssignmentAuthor | null;
  createdAt: Date;
  startAt: Date | null;
  endAt: Date | null;
  isTurnInLateEnabled: boolean;
  isClosed: boolean;
  totalScore: number;
  assignmentFiles: { name: string; url: string }[];
  room: { id: string; title: string } | null;
}

// Attempt from instructor view
export interface InstructorAttempt {
  id: string;
  submitAt: Date;
  score: number | null;
  files: { name: string; url: string }[];
  note: string | null;
  isLate: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  } | null;
}

// Paginated attempts response
export interface AttemptsResponse {
  data: InstructorAttempt[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// For instructor view - includes attempt stats and attempts list from API
export interface InstructorAssignment extends BaseAssignment {
  status: InstructorAssignmentStatus;
  totalAttempts: number;
  gradedAttempts: number;
  ungradedAttempts: number;
  attempts?: AttemptsResponse;
}

// Student attempt (nested in student assignment response)
export interface StudentAttempt {
  id: string;
  submitAt: Date;
  score: number | null;
  files: { name: string; url: string }[];
  note?: string | null;
}

// For student view - includes flattened submission fields from API
export interface StudentAssignment extends BaseAssignment {
  submissionStatus: SubmissionStatus;
  submittedAt?: Date | null;
  score?: number | null;
  attempt?: StudentAttempt | null;
}

// Union type for general use
export type Assignment = InstructorAssignment | StudentAssignment;

// Type guards
export function isInstructorAssignment(
  assignment: Assignment
): assignment is InstructorAssignment {
  return "totalAttempts" in assignment;
}

export function isStudentAssignment(
  assignment: Assignment
): assignment is StudentAssignment {
  return "submissionStatus" in assignment;
}
