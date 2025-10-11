// Submission Types for Assignment Details

export interface StudentInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
}

export interface SubmissionFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface StudentSubmissionDetail {
  id: string;
  student: StudentInfo;
  assignmentId: string;
  submittedAt?: Date;
  status: "pending" | "submitted" | "graded" | "late" | "missing";
  grade?: number;
  feedback?: string;
  files: SubmissionFile[];
  textSubmission?: string;
  linkSubmission?: string;
  isLate: boolean;
}

