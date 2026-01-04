"use server";

import { revalidateTag } from "next/cache";
import { getNotes } from "@/server-api/notes";

export async function revalidateNotesCache() {
  revalidateTag("notes", { expire: 0 });
}

export async function refreshNotesCache(folderId?: string | null) {
  revalidateTag("notes", { expire: 0 });
  await getNotes({ folderId });
}
