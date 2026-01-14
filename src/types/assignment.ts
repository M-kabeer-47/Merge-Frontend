// Assignment Types for Assignments Tab

export type AssignmentStatus = "published" | "draft" | "closed";

export type SubmissionStatus =
  | "pending"
  | "completed"
  | "graded"
  | "missed"
  | "submitted";

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
  name: string;
  role: "instructor" | "student" | "ta";
  avatarUrl?: string;
  initials: string;
}

export interface AssignmentAttachment {
  id: string;
  name: string;
  type: "file" | "link";
  url: string;
  size?: number;
}

// Instructor-specific data - matches API response
export interface AssignmentSubmissionStats {
  totalAttempts: number;
  gradedAttempts: number;
  ungradedAttempts: number;
}

// Student-specific data
export interface StudentSubmission {
  id: string;
  submittedAt?: Date;
  status: SubmissionStatus;
  submitAt?: Date;
  score?: number;
  feedback?: string;
  attachments?: AssignmentAttachment[];
  files?: { name: string; url: string }[]; // From API attempt response
  note?: string;
}

export interface BaseAssignment {
  id: string;
  title: string;
  description: string;
  author: AssignmentAuthor;
  createdAt: Date;
  dueDate: Date;
  endAt: Date;
  isTurnInLateEnabled: boolean;
  isClosed: boolean;
  points: number;
  totalScore: number;
  attachmentUrls?: string[];
  assignmentFiles?: { name: string; url: string }[];
}

// Attempt from instructor view
export interface InstructorAttempt {
  id: string;
  submitAt: string;
  score: number | null;
  files: { name: string; url: string }[];
  note: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
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
  status: "needs_grading" | "graded" | "no_attempts";
  totalAttempts: number;
  gradedAttempts: number;
  ungradedAttempts: number;
  attempts: AttemptsResponse;
}

// For student view - includes flattened submission fields for convenience
export interface StudentAssignment extends BaseAssignment {
  submissionStatus?: SubmissionStatus;
  note?: string;

  attempt?: StudentSubmission;
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
