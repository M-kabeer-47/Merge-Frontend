import type { QueryClient } from "@tanstack/react-query";

/**
 * Generic cache helper factory.
 *
 * Eliminates the repeated add-to-cache and invalidate patterns
 * across assignments, quizzes, and other entity types.
 */
export function createCacheHelpers<T extends { id: string; title?: string }>(
  entityName: string,
  queryKeyPrefix: string,
) {
  return {
    /**
     * Optimistically add a new item to instructor cache.
     * Used when instructor creates an item - it appears immediately.
     */
    addToCache(
      queryClient: QueryClient,
      roomId: string,
      newItem: T,
    ): void {
      console.log(
        `[Cache] Adding ${entityName}: ${newItem.title || newItem.id}`,
      );

      queryClient.setQueriesData<T[]>(
        { queryKey: [queryKeyPrefix, roomId, "instructor"] },
        (old) => {
          if (!old) return [newItem];
          if (old.some((item) => item.id === newItem.id)) return old;
          return [newItem, ...old];
        },
      );
    },

    /**
     * Invalidate student cache.
     * Used when notification is received - triggers background refetch.
     */
    invalidateStudentCache(
      queryClient: QueryClient,
      roomId: string,
    ): void {
      console.log(
        `[Cache] Invalidating student ${queryKeyPrefix} for room: ${roomId}`,
      );

      queryClient.invalidateQueries({
        queryKey: [queryKeyPrefix, roomId, "student"],
      });
    },
  };
}
