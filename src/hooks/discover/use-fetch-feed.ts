"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import api from "@/utils/api";
import type { FeedRoom, FeedResponse } from "@/types/discover";

interface UseFetchFeedOptions {
  limit?: number;
  search?: string;
  userTags?: string[];
  enabled?: boolean;
}

export const FEED_QUERY_KEY = "discover-feed";

export function useFetchFeed({
  limit = 10,
  search,
  userTags = [],
  enabled = true,
}: UseFetchFeedOptions) {
  const queryKey = [FEED_QUERY_KEY, search, userTags];

  const query = useInfiniteQuery<FeedResponse, Error>({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get("/room/feed", {
        params: {
          page: pageParam,
          limit,
          ...(search ? { search } : {}),
          ...(userTags.length > 0 ? { userTags: userTags.join(",") } : {}),
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const rooms: FeedRoom[] = useMemo(
    () => query.data?.pages.flatMap((page) => page.rooms) ?? [],
    [query.data?.pages],
  );

  return {
    rooms,
    hasMore: query.hasNextPage,
    total: query.data?.pages[0]?.total ?? 0,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch,
  };
}
