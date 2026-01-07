import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/utils/api";
import { Note, Folder } from "@/types/note";

interface NoteFilters {
  folderId?: string;
  search?: string;
}

export default function useFetchNotes(filters?: NoteFilters) {
  const queryClient = useQueryClient();

  const fetchNotesData = async (queryParams: string) => {
    const url = `/notes${queryParams ? `?${queryParams}` : ""}`;
    const response = await api.get(url);
    return response.data;
  };

  const fetchNotes = async () => {
    const params = new URLSearchParams();
    if (filters?.folderId) params.append("folderId", filters.folderId);
    if (filters?.search) params.append("search", filters.search);

    return fetchNotesData(params.toString());
  };

  const { data, isLoading, isPending, isFetching, isError, refetch } = useQuery(
    {
      queryKey: ["notes", filters?.folderId || null, filters?.search || ""],
      queryFn: fetchNotes,
      retry: false,
      staleTime: Infinity,
    }
  );

  // Prefetch all subfolders when folders are loaded
  useEffect(() => {
    if (!data?.folders) return;

    data.folders.forEach((folder: Folder) => {
      const params = new URLSearchParams();
      params.append("folderId", folder.id);

      queryClient.prefetchQuery({
        queryKey: ["notes", folder.id, ""],
        queryFn: () => fetchNotesData(params.toString()),
        staleTime: 2 * 60 * 1000,
      });
    });
  }, [data?.folders, queryClient]);

  return {
    notes: (data?.notes as Note[]) || [],
    folders: (data?.folders as Folder[]) || [],
    breadcrumb: data?.breadcrumb || [],
    currentFolder: (data?.currentFolder as Folder | null) || null,
    total: data?.total || 0,
    isLoading: isLoading || isPending,
    isFetching,
    isError,
    refetch,
  };
}
