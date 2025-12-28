"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Invalidate room cache
 */
export async function revalidateRoomsCache() {
  revalidateTag("rooms", { expire: 0 }); // Immediate expiration
}

/**
 * Prefetch rooms to warm the Next.js Data Cache
 * Call this AFTER revalidateTag to populate fresh cache
 */
export async function prefetchRoomsOnServer(filter: string = "all") {
  console.log("Prefetching rooms for filter:", filter);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // This fetch populates the Data Cache for subsequent server renders
  await fetch(`${API_BASE_URL}/user/rooms?filter=${filter}`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    next: {
      revalidate: false, // Cache forever until manual invalidation
      tags: ["rooms", `rooms-${filter}`],
    },
  });
}

/**
 * Combined: Invalidate + Prefetch in one call
 */
export async function refreshRoomsCache(filter: string = "all") {
  // 1. Clear old cache (immediate expiration)
  revalidateTag("rooms", { expire: 0 });

  // 2. Warm new cache
  await prefetchRoomsOnServer(filter);
}
