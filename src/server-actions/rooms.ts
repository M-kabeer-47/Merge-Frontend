"use server";

import { revalidateTag } from "next/cache";
import { getRooms } from "@/server-api/rooms";
import { getRoomDetails } from "@/server-api/room";

/**
 * Invalidate room cache
 */
export async function revalidateRoomsCache() {
  revalidateTag("rooms", { expire: 0 });
}

/**
 * Prefetch rooms to warm the Next.js Data Cache
 * Reuses the server-api function which already has proper caching
 */
export async function refreshRoomsCache(
  filter: "all" | "created" | "joined" = "all"
) {
  revalidateTag(`rooms-${filter}`, { expire: 0 });
  getRooms({ filter });
}

export async function refreshRoomCache(roomId: string) {
  revalidateTag(`room-${roomId}`, { expire: 0 });
  getRoomDetails(roomId);
}
