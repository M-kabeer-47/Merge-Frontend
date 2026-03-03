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
import { buildQueryParams } from "@/utils/query-params";

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
    const url = `/room/${roomId}/course-content${
      queryParams ? `?${queryParams}` : ""
    }`;
    const response = await api.get(url);
    return response.data;
  };

  const fetchContent = async () => {
    const params = buildQueryParams({ folderId, search, sortBy, sortOrder });

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
    enabled: !!roomId,
    retry: false,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });

  return {
    folders: (data?.folders as RoomContentFolder[]) || [],
    files: (data?.files as RoomContentFile[]) || [],
    breadcrumb: (data?.breadcrumb as BreadcrumbItem[]) || [],
    currentFolder: (data?.currentFolder as BreadcrumbItem | null) || null,
    roomInfo: (data?.roomInfo as RoomInfo) || null,
    total: data?.total || { folders: 0, files: 0, combined: 0 },
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
