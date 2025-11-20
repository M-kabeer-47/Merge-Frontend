import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import axios from "axios";
import { useState, useEffect } from "react";
import rotateToken from "@/utils/rotate-token";
import { Note, NoteFilters } from "@/types/note";

export default function useFetchNotes(filters?: NoteFilters) {
  const [isClient, setIsClient] = useState(false);

  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const params = new URLSearchParams();
      if (filters?.folderId) params.append("folderId", filters.folderId);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/notes${
        params.toString() ? `?${params.toString()}` : ""
      }`;

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
          return fetchNotes();
        }
      }
      throw error;
    }
  };

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["notes", filters],
    queryFn: fetchNotes,
    enabled: isClient && !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    notes: data?.notes as Note[] || [],
    total: data?.total || 0,
    isLoading: isLoading || !isClient || isRotationPending,
    isError,
    refetch,
  };
}
