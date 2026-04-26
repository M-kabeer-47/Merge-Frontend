import { getWithAuth } from "./fetch-with-auth";
import type { FetchMessagesResponse } from "@/types/general-chat";
import { API_BASE_URL } from "@/lib/constants/api";
import { buildQueryParams } from "@/utils/query-params";

export interface FetchGeneralChatMessagesParams {
  roomId: string;
  page?: number;
  limit?: number;
  sortOrder?: "ASC" | "DESC";
  beforeMessageId?: string;
  afterMessageId?: string;
}

/**
 * Server-side fetch for general chat messages
 * Supports pagination and infinite scrolling
 */
export async function getGeneralChatMessages(
  params: FetchGeneralChatMessagesParams,
): Promise<FetchMessagesResponse> {
  const {
    roomId,
    page = 1,
    limit = 20,
    sortOrder = "DESC",
    beforeMessageId,
    afterMessageId,
  } = params;

  // Build query string
  const queryParams = buildQueryParams({
    roomId,
    page,
    limit,
    sortOrder,
    beforeMessageId,
    afterMessageId,
  });

  const { data, error } = await getWithAuth<FetchMessagesResponse>(
    `${API_BASE_URL}/general-chat?${queryParams.toString()}`,
    {
      next: {
        revalidate: 0, // Don't cache chat messages
        tags: ["general-chat", `general-chat-${roomId}`],
      },
    },
  );

  if (error || !data) {
    console.error("Error fetching general chat messages:", error);
    return {
      messages: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      room: {
        id: roomId,
        title: "",
      },
    };
  }

  return data;
}
