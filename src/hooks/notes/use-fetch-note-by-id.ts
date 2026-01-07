import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { Note } from "@/types/note";

export default function useFetchNoteById(noteId: string) {
  const fetchNote = async () => {
    const response = await api.get(`/notes/${noteId}`);
    return response.data;
  };

  const {
    data: note,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: fetchNote,
    enabled: !!noteId,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    note: note as Note | null,
    isLoading,
    isError,
    refetch,
  };
}
