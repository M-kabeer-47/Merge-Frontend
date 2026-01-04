// Assignment Types for Assignments Tab

export type AssignmentStatus = "published" | "draft" | "closed";

export type SubmissionStatus = "pending" | "submitted" | "graded" | "overdue";

export type AssignmentSortOption = "dueDate" | "points" | "title" | "status";

export type AssignmentFilterType =
  | "all"
  | "completed"
  | "pending"
  | "graded"
  | "overdue";

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

// Instructor-specific data
export interface AssignmentSubmissionStats {
  submitted: number;
  total: number;
  graded: number;
  pending: number;
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
  points: number;
  totalScore: number;
  status: AssignmentStatus;
  attachments?: AssignmentAttachment[];
}

// For instructor view
export interface InstructorAssignment extends BaseAssignment {
  submissionStats: AssignmentSubmissionStats;
}

// For student view
export interface StudentAssignment extends BaseAssignment {
  submission: StudentSubmission;
}

// Union type for general use
export type Assignment = InstructorAssignment | StudentAssignment;

// Type guards
export function isInstructorAssignment(
  assignment: Assignment
): assignment is InstructorAssignment {
  return "submissionStats" in assignment;
}

export function isStudentAssignment(
  assignment: Assignment
): assignment is StudentAssignment {
  return "submission" in assignment;
}
