"use server";

import { revalidateTag } from "next/cache";
import { getRoomContent } from "@/server-api/room-content";

/**
 * Invalidate a specific folder's cache only (no refetch)
 */
export async function revalidateFolderCache(
  roomId: string,
  folderId?: string | null
) {
  const folderTag = `room-content-${roomId}-${folderId || "root"}`;
  console.log(`[Cache] Revalidating folder: ${folderTag}`);
  revalidateTag(folderTag, { expire: 0 });
}

/**
 * Invalidate and immediately re-prefetch to keep cache warm
 * Use after mutations to ensure fast navigation
 */
export async function refreshFolderCache(
  roomId: string,
  folderId?: string | null
) {
  const folderTag = `room-content-${roomId}-${folderId || "root"}`;
  console.log(`[Cache] Refreshing folder: ${folderTag}`);
  revalidateTag(folderTag, { expire: 0 });
  // Re-prefetch to warm cache (fire-and-forget)
  getRoomContent({ roomId, folderId }).catch(() => {});
}

/**
 * Invalidate entire room's content cache
 * Use sparingly - only for room-level changes
 */
export async function revalidateRoomContentCache(roomId: string) {
  console.log(`[Cache] Revalidating entire room: room-content-${roomId}`);
  revalidateTag(`room-content-${roomId}`, { expire: 0 });
}
