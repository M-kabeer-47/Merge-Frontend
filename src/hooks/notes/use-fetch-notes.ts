import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { Note, Folder } from "@/types/note";
import { buildQueryParams } from "@/utils/query-params";

interface NoteFilters {
  folderId?: string;
  search?: string;
}

export default function useFetchNotes(filters?: NoteFilters) {
  const fetchNotesData = async (queryParams: string) => {
    const url = `/notes${queryParams ? `?${queryParams}` : ""}`;
    const response = await api.get(url);
    return response.data;
  };

  const fetchNotes = async () => {
    const params = buildQueryParams({
      folderId: filters?.folderId,
      search: filters?.search,
    });

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
