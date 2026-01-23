/**
 * Cache Utilities
 *
 * Centralized utilities for React Query cache operations.
 * Organized by context for easy imports.
 */

// Assignments
export {
  addAssignmentToCache,
  invalidateStudentAssignmentsCache,
} from "./assignments";

// Quizzes
export { addQuizToCache, invalidateStudentQuizzesCache } from "./quizzes";

// Notifications
export { addNotificationToCache } from "./notifications";
