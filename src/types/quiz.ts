// Quiz Types for Quiz Module

import type { Author } from "./common";

export type QuizAttemptStatus = "pending" | "graded" | "missed";

export type QuizSortOption = "endAt" | "createdAt" | "totalScore";

export type QuizFilterType =
  | "all"
  | "pending"
  | "graded"
  | "missed"
  | "active"
  | "closed";

// Quiz Author from API
export type QuizAuthor = Author;

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

// Room info in quiz response
export interface QuizRoom {
  id: string;
  title: string;
}

// Student attempt data (for student view)
export interface StudentAttempt {
  id?: string;
  attemptedAt?: Date;
  status: QuizAttemptStatus;
  score?: number;
  totalPoints?: number;
  answers?: Record<string, string>; // questionId -> selectedOption
}

// Attempt user info (for instructor view)
export interface AttemptUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
}

// Single attempt in the attempts list (for instructor submissions view)
export interface QuizAttemptDetail {
  id: string;
  submittedAt: string;
  score: number;
  answers: Record<string, string>; // questionId -> selected answer
  user: AttemptUser;
}

// Paginated attempts response
export interface AttemptsResponse {
  data: QuizAttemptDetail[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Base quiz structure
export interface BaseQuiz {
  id: string;
  title: string;
  author: QuizAuthor;
  createdAt: Date | string;
  deadline: Date | string;
  timeLimitMin: number;
  isClosed: boolean;
  questions: QuizQuestion[];
  totalPoints: number;
}

// For instructor list view
export interface InstructorQuiz extends BaseQuiz {
  totalAttempts: number;
  totalQuestions: number;
  status: "open" | "closed";
}

// For instructor detail view (with attempts list)
export interface InstructorQuizDetail extends InstructorQuiz {
  room: QuizRoom;
  averageScore: number;
  attempts: AttemptsResponse;
}

// For student view
export interface StudentQuiz extends BaseQuiz {
  attempt: StudentAttempt;
  submissionStatus?: QuizAttemptStatus;
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

export function isInstructorQuizDetail(
  quiz: InstructorQuiz
): quiz is InstructorQuizDetail {
  return "attempts" in quiz && typeof quiz.attempts === "object";
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
  user: AttemptUser;
  quiz: {
    id: string;
    title: string;
    totalScore: number;
  };
}
