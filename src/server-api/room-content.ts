import { getWithAuth } from "@/server-api/fetch-with-auth";
import type {
  RoomContentResponse,
  ContentSortBy,
  ContentSortOrder,
} from "@/types/room-content";
import { API_BASE_URL } from "@/lib/constants/api";
import { buildQueryParams } from "@/utils/query-params";

export interface GetRoomContentParams {
  roomId: string;
  folderId?: string | null;
  search?: string;
  sortBy?: ContentSortBy;
  sortOrder?: ContentSortOrder;
}

// Default empty response
const EMPTY_RESPONSE: RoomContentResponse = {
  folders: [],
  files: [],
  total: { folders: 0, files: 0, combined: 0 },
  pagination: {
    totalPages: 0,
    currentPage: 1,
    sortBy: "",
    sortOrder: "",
  },
  breadcrumb: [],
  currentFolder: null,
  roomInfo: {
    id: "",
    title: "",
    userRole: "member",
  },
};

/**
 * Server-side fetch for room content with Next.js Data Cache
 */
export async function getRoomContent(
  params: GetRoomContentParams
): Promise<RoomContentResponse> {
  const { roomId, folderId, search = "", sortBy, sortOrder } = params;

  const queryParams = buildQueryParams({ folderId, search, sortBy, sortOrder });

  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/room/${roomId}/course-content${
    queryString ? `?${queryString}` : ""
  }`;

  const { data, error } = await getWithAuth<RoomContentResponse>(url, {
    next: {
      revalidate: false,
      tags: [
        "room-content",
        `room-content-${roomId}`,
        `room-content-${roomId}-${folderId || "root"}`,
      ],
    },
  });

  if (error || !data) {
    console.error("Error fetching room content:", error);
    return EMPTY_RESPONSE;
  }

  return data;
}
