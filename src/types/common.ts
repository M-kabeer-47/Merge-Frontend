/**
 * Shared type definitions used across multiple resource types.
 */

/**
 * Base author shape matching the API's user object.
 * Used by announcements, quizzes, and other resources that share this structure.
 *
 * Note: AssignmentAuthor uses a different shape (name, initials, avatarUrl)
 * and is kept separate in assignment.ts.
 */
export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string | null;
  role?: string;
}
