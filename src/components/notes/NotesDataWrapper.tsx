import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNotes } from "@/server-api/notes";
import NotesList from "./NotesList";

// Server component prefetches root notes data for initial page load
// Subfolder prefetching happens client-side in useFetchNotes hook
export default async function NotesDataWrapper() {
  const queryClient = new QueryClient();

  // Prefetch root folder notes with no search for initial load
  await queryClient.prefetchQuery({
    queryKey: ["notes", null, ""],
    queryFn: () => getNotes({ folderId: null, search: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesList />
    </HydrationBoundary>
  );
}
