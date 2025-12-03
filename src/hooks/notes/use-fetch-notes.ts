import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiRequest from "@/utils/api-request";
import axios from "axios";
import { useState, useEffect } from "react";
import rotateToken from "@/utils/rotate-token";
import { Note, Folder } from "@/types/note";

interface NoteFilters {
  folderId?: string;
  search?: string;
}

export default function useFetchNotes(filters?: NoteFilters) {
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  const { rotateToken: refreshTokenFn, isRotationPending } = rotateToken({
    oldToken:
      isClient && localStorage.getItem("refreshToken")
        ? localStorage.getItem("refreshToken")!
        : "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reusable fetch function that takes query params
  const fetchNotesData = async (queryParams: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/notes${queryParams ? `?${queryParams}` : ""}`;

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
          return fetchNotesData(queryParams);
        }
      }
      throw error;
    }
  };

  const fetchNotes = async () => {
    const params = new URLSearchParams();
    if (filters?.folderId) params.append("folderId", filters.folderId);
    if (filters?.search) params.append("search", filters.search);


    return fetchNotesData(params.toString());
  };

  const {
    data,
    isLoading,
    isPending,
    isError,
    refetch,

  } = useQuery({
    queryKey: ["notes", filters?.folderId || null, filters?.search || ""],
    queryFn: fetchNotes,
    enabled: isClient && !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: 2 * 60 * 1000,
    // refetchOnWindowFocus: true,
  });

  // Prefetch all subfolders when folders are loaded
  useEffect(() => {
    if (!data?.folders || !isClient) return;

    data.folders.forEach((folder: Folder) => {
      const params = new URLSearchParams();
      params.append("folderId", folder.id);

      // Prefetch with the same query key format as the main query
      // Use empty string for search to match the default state
      queryClient.prefetchQuery({
        queryKey: ["notes", folder.id, ""],
        queryFn: () => fetchNotesData(params.toString()),
        staleTime: 2 * 60 * 1000,
      });
    });
  }, [data?.folders, isClient, queryClient]);

  return {
    notes: data?.notes as Note[] || [],
    folders: data?.folders as Folder[] || [],
    currentFolder: data?.currentFolder as Folder | null || null,
    total: data?.total || 0,
    isLoading: isLoading || !isClient || isRotationPending || isPending,
    isError,
    refetch,
  };
}
