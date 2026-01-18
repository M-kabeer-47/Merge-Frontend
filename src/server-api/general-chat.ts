import { getWithAuth } from "./fetch-with-auth";
import type { FetchMessagesResponse } from "@/types/general-chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  params: FetchGeneralChatMessagesParams
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
  const queryParams = new URLSearchParams({
    roomId,
    page: page.toString(),
    limit: limit.toString(),
    sortOrder,
  });

  if (beforeMessageId) {
    queryParams.append("beforeMessageId", beforeMessageId);
  }
  if (afterMessageId) {
    queryParams.append("afterMessageId", afterMessageId);
  }

  const { data, error } = await getWithAuth<FetchMessagesResponse>(
    `${API_BASE_URL}/general-chat?${queryParams.toString()}`,
    {
      next: {
        revalidate: 0, // Don't cache chat messages
        tags: ["general-chat", `general-chat-${roomId}`],
      },
    }
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
