// Assignment Types for Assignments Tab

export type AssignmentStatus = "published" | "draft" | "closed";

export type SubmissionStatus = "pending" | "submitted" | "graded" | "missed";

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
  grade?: number;
  feedback?: string;
  attachments?: AssignmentAttachment[];
}

export interface BaseAssignment {
  id: string;
  title: string;
  description: string;
  author: AssignmentAuthor;
  createdAt: Date;
  dueDate: Date;
  endAt: Date;
  points: number;
  totalScore: number;
  attachments?: AssignmentAttachment[];
}

// For instructor view - includes attempt stats from API
export interface InstructorAssignment extends BaseAssignment {
  totalAttempts: number;
  gradedAttempts: number;
  ungradedAttempts: number;
}

// For student view - includes flattened submission fields for convenience
export interface StudentAssignment extends BaseAssignment {
  submissionStatus?: SubmissionStatus;
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
