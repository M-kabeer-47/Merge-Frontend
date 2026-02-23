/**
 * Build URLSearchParams from an object, automatically skipping undefined/null/empty values.
 *
 * Replaces the repeated pattern of:
 *   const params = new URLSearchParams({ roomId });
 *   if (sortBy) params.append("sortBy", sortBy);
 *   if (sortOrder) params.append("sortOrder", sortOrder);
 *   ...
 */
export function buildQueryParams(
  params: Record<string, string | number | boolean | undefined | null>,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }
  return searchParams;
}
