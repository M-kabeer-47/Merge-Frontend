// Quiz Types for Quiz Module

export type QuizStatus = "published" | "draft" | "closed";

export type QuizAttemptStatus = "pending" | "completed" | "missed";

export type QuizSortOption = "endAt" | "createdAt" | "totalScore";

export type QuizFilterType =
  | "all"
  | "pending"
  | "completed"
  | "missed"
  | "active"
  | "closed";

// Quiz Author (same as Assignment)
export interface QuizAuthor {
  id: string;
  name: string;
  role: "instructor" | "student" | "ta";
  avatarUrl?: string;
  initials: string;
}

// Single quiz question
export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOption: string;
  points: number;
}

// For creating a quiz (without IDs)
export interface CreateQuizQuestion {
  text: string;
  options: string[];
  correctOption: string;
  points: number;
}

// Instructor-specific stats (matches API response)
// Note: These fields are directly on InstructorQuiz, not nested

// Student attempt data
export interface StudentAttempt {
  id?: string;
  attemptedAt?: Date;
  status: QuizAttemptStatus;
  score?: number;
  totalPoints?: number;
  answers?: Record<string, string>; // questionId -> selectedOption
}

// Base quiz structure
export interface BaseQuiz {
  id: string;
  title: string;
  author: QuizAuthor;
  createdAt: Date;
  deadline: Date;
  timeLimitMin: number; // Time limit in minutes
  status: QuizStatus;
  questions: QuizQuestion[];
  totalPoints: number; // Sum of all question points
}

// For instructor view - includes attempt counts
export interface InstructorQuiz extends BaseQuiz {
  attempts: number; // Number of students who attempted
  totalAttempts: number; // Total number of students in room
}

// For student view
export interface StudentQuiz extends BaseQuiz {
  attempt: StudentAttempt;
  submissionStatus?: QuizAttemptStatus; // Same pattern as assignments
}

// Union type for general use
export type Quiz = InstructorQuiz | StudentQuiz;

// Type guards
export function isInstructorQuiz(quiz: Quiz): quiz is InstructorQuiz {
  return "totalAttempts" in quiz;
}

export function isStudentQuiz(quiz: Quiz): quiz is StudentQuiz {
  return "attempt" in quiz || "submissionStatus" in quiz;
}

// API Payloads
export interface CreateQuizPayload {
  roomId: string;
  title: string;
  timeLimitMin: number;
  deadline: string; // ISO 8601 format
  questions: CreateQuizQuestion[];
}

export interface AttemptQuizPayload {
  quizId: string;
  roomId: string;
  answers: Record<string, string>; // questionId -> selectedAnswer
}

export interface AttemptQuizResponse {
  id: string;
  submittedAt: string;
  answers: Record<string, string>;
  score: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  quiz: {
    id: string;
    title: string;
    totalScore: number;
  };
}
