import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import axios from "axios";
import { useEffect } from "react";
import rotateToken from "@/utils/rotate-token";
import type {
  RoomContentFolder,
  RoomContentFile,
  BreadcrumbItem,
  RoomInfo,
  ContentSortBy,
  ContentSortOrder,
} from "@/types/room-content";

const isClient = typeof window !== "undefined";

interface UseRoomContentParams {
  roomId: string;
  folderId?: string | null;
  search?: string;
  sortBy?: ContentSortBy;
  sortOrder?: ContentSortOrder;
}

export default function useFetchRoomContent({
  roomId,
  folderId,
  search = "",
  sortBy,
  sortOrder,
}: UseRoomContentParams) {
  const queryClient = useQueryClient();

  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  const fetchContentData = async (queryParams: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/room/${roomId}/course-content${queryParams ? `?${queryParams}` : ""}`;

      const response = await apiRequest(
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        const result = await refreshTokenFn();
        if (result?.token) {
          return fetchContentData(queryParams);
        }
      }
      throw error;
    }
  };

  const fetchContent = async () => {
    const params = new URLSearchParams();
    if (folderId) params.append("folderId", folderId);
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    return fetchContentData(params.toString());
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [
      "room-content",
      roomId,
      folderId || null,
      search,
      sortBy,
      sortOrder,
    ],
    queryFn: fetchContent,
    enabled: isClient && !!roomId && !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 3 * 60 * 1000,
  });

  // Prefetch subfolders when folders are loaded
  useEffect(() => {
    if (!data?.folders || !isClient) return;

    data.folders.forEach((folder: RoomContentFolder) => {
      const params = new URLSearchParams();
      params.append("folderId", folder.id);
      sortBy && params.append("sortBy", sortBy);
      sortOrder && params.append("sortOrder", sortOrder);

      queryClient.prefetchQuery({
        queryKey: ["room-content", roomId, folder.id, "", sortBy, sortOrder],
        queryFn: () => fetchContentData(params.toString()),
        staleTime: 3 * 60 * 1000,
      });
    });
  }, [data?.folders, roomId, sortBy, sortOrder]);

  return {
    folders: (data?.folders as RoomContentFolder[]) || [],
    files: (data?.files as RoomContentFile[]) || [],
    breadcrumb: (data?.breadcrumb as BreadcrumbItem[]) || [],
    currentFolder: (data?.currentFolder as BreadcrumbItem | null) || null,
    roomInfo: (data?.roomInfo as RoomInfo) || null,
    total: data?.total || { folders: 0, files: 0, combined: 0 },
    isLoading: isLoading || !isClient || isRotationPending || isFetching,
    isError,
    refetch,
  };
}
