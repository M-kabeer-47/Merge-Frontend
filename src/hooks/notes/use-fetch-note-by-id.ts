import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { Note } from "@/types/note";

const isClient = typeof window !== "undefined";

export default function useFetchNoteById(noteId: string) {
  const fetchNote = async () => {
    const token = isClient ? localStorage.getItem("accessToken") : null;
    if (!token) return null;

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
    enabled: isClient && !!localStorage.getItem("accessToken") && !!noteId,
    retry: false,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    note: note as Note | null,
    isLoading: isLoading || !isClient,
    isError,
    refetch,
  };
}
