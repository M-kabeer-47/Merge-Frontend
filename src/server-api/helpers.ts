/**
 * Unwrap a fetchWithAuth result, logging errors and returning the fallback.
 *
 * Replaces the repeated pattern:
 *   if (error || !data) {
 *     console.error("Error fetching X:", error);
 *     return [];
 *   }
 */
export function unwrapOrDefault<T>(
  result: { data: T | null; error: string | null },
  context: string,
  fallback: T,
): T {
  if (result.error || !result.data) {
    console.error(`Error ${context}:`, result.error);
    return fallback;
  }
  return result.data;
}
