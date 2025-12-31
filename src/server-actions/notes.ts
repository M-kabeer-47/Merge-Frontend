"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Invalidate notes cache
 */
export async function revalidateNotesCache() {
  revalidateTag("notes", { expire: 0 }); // Immediate expiration
}

/**
 * Prefetch notes to warm the Next.js Data Cache
 * Call this AFTER revalidateTag to populate fresh cache
 */
export async function prefetchNotesOnServer(folderId?: string | null) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const queryParams = new URLSearchParams();
  if (folderId) queryParams.append("folderId", folderId);

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/notes${queryString ? `?${queryString}` : ""}`;

  // This fetch populates the Data Cache for subsequent server renders
  await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    next: {
      revalidate: false, // Cache forever until manual invalidation
      tags: ["notes", `notes-folder-${folderId || "root"}`],
    },
  });
}

/**
 * Combined: Invalidate + Prefetch in one call
 */
export async function refreshNotesCache(folderId?: string | null) {
  // 1. Clear old cache (immediate expiration)
  revalidateTag("notes", { expire: 0 });

  // 2. Warm new cache
  await prefetchNotesOnServer(folderId);
}
