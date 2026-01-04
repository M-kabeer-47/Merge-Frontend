"use server";

import { revalidateTag } from "next/cache";
import { getRoomContent } from "@/server-api/room-content";

/**
 * Invalidate and immediately re-prefetch a folder to keep cache warm
 * Use after mutations (create folder, upload file, delete)
 */
export async function refreshFolderCache(
  roomId: string,
  folderId?: string | null
) {
  const folderTag = `room-content-${roomId}-${folderId || "root"}`;
  console.log(`[Cache] Refreshing folder: ${folderTag}`);
  revalidateTag(folderTag, { expire: 0 });
  // Re-prefetch to warm cache (fire-and-forget)
  getRoomContent({ roomId, folderId });
}

/**
 * Invalidate entire room's content cache
 * Use sparingly - only for room-level changes
 */
export async function revalidateRoomContentCache(roomId: string) {
  console.log(`[Cache] Revalidating entire room: room-content-${roomId}`);
  revalidateTag(`room-content-${roomId}`, { expire: 0 });
}
