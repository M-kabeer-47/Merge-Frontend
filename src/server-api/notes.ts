import { getWithAuth } from "@/server-api/fetch-with-auth";
import type { Note, Folder } from "@/types/note";
import { API_BASE_URL } from "@/lib/constants/api";

export interface NotesResponse {
  notes: Note[];
  folders: Folder[];
  breadcrumb: { id: string; name: string }[];
  currentFolder: Folder | null;
  total: number;
}

export interface GetNotesParams {
  folderId?: string | null;
  search?: string;
}

// Default empty response
const EMPTY_RESPONSE: NotesResponse = {
  notes: [],
  folders: [],
  breadcrumb: [],
  currentFolder: null,
  total: 0,
};

/**
 * Server-side fetch for notes with Next.js Data Cache
 */
export async function getNotes(
  params: GetNotesParams = {}
): Promise<NotesResponse> {
  const { folderId, search = "" } = params;

  // Build query string
  const queryParams = new URLSearchParams();
  if (folderId) queryParams.append("folderId", folderId);
  if (search) queryParams.append("search", search);

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/notes${queryString ? `?${queryString}` : ""}`;

  const { data, error } = await getWithAuth<NotesResponse>(url, {
    next: {
      revalidate: false, // Cache forever until manual invalidation
      tags: ["notes", `notes-folder-${folderId || "root"}`],
    },
  });

  if (error || !data) {
    console.error("Error fetching notes:", error);
    return EMPTY_RESPONSE;
  }

  return data;
}
