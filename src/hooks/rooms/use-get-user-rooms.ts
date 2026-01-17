import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { toast } from "sonner";
import { tryIt } from "@/utils/try-it";

interface RoomAdmin {
  id: string;
  email: string;
  image: string;
  firstName: string;
  lastName: string;
}

interface RoomMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

interface RoomTag {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  roomCode: string;
  tags: RoomTag[];
  admin: RoomAdmin;
  members: RoomMember[];
  createdAt: string;
  updatedAt: string;
  type: "created" | "joined";
  userRole: string;
  memberCount: number;
}

export interface RoomsResponse {
  rooms: Room[];
  total: number;
  totalPages: number;
  currentPage: number;
  filter: string;
  counts: {
    created: number;
    joined: number;
    total: number;
  };
}

export default function useGetUserRooms({
  filter,
  search = "",
}: {
  filter: "all" | "created" | "joined";
  search?: string;
}) {
  const fetchUserRooms = async (): Promise<RoomsResponse | null> => {
    // utilzie tryIt
    const searchParam = search ? `&search=${search}` : "";
    const [response, error] = await tryIt(
      api.get(`/user/rooms?filter=${filter}${searchParam}`),
    );
    if (error) {
      toast.error("Failed to fetch rooms, please try again later");
      return null;
    }
    return response.data;
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["rooms", filter, search],
    queryFn: fetchUserRooms,
    retry: false,
    staleTime: Infinity, // Trust server-prefetched data and optimistic updates
  });

  return {
    rooms: data?.rooms || [],
    counts: data?.counts || { created: 0, joined: 0, total: 0 },
    total: data?.total || 0,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
