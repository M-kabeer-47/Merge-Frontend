import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
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

  const fetchContentData = async (queryParams: string) => {
    const token = isClient ? localStorage.getItem("accessToken") : null;
    if (!token) return null;

    const url = `/room/${roomId}/course-content${
      queryParams ? `?${queryParams}` : ""
    }`;
    const response = await api.get(url);
    return response.data;
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
    staleTime: Infinity, // Never refetch automatically - updates via socket events
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
  });

  // Note: Subfolder prefetching is now handled server-side in ContentDataWrapper

  return {
    folders: (data?.folders as RoomContentFolder[]) || [],
    files: (data?.files as RoomContentFile[]) || [],
    breadcrumb: (data?.breadcrumb as BreadcrumbItem[]) || [],
    currentFolder: (data?.currentFolder as BreadcrumbItem | null) || null,
    roomInfo: (data?.roomInfo as RoomInfo) || null,
    total: data?.total || { folders: 0, files: 0, combined: 0 },
    isLoading: isLoading || !isClient,
    isFetching,
    isError,
    refetch,
  };
}
