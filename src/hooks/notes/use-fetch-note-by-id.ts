import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import axios from "axios";
import rotateToken from "@/utils/rotate-token";
import { Note } from "@/types/note";

const isClient = typeof window !== "undefined";

export default function useFetchNoteById(noteId: string) {
  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  const fetchNote = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const response = await apiRequest(
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/${noteId}`, {
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
          return fetchNote();
        }
      }
      throw error;
    }
  };

  const {
    data: note,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: fetchNote,
    enabled: isClient && !!localStorage.getItem("accessToken") && !!noteId,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    note: note as Note | null,
    isLoading: isLoading || !isClient || isRotationPending,
    isError,
    refetch,
  };
}
