"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useNotesFilters, useNotesActions } from "@/contexts/NotesContext";
import useFetchNotes from "@/hooks/notes/use-fetch-notes";
import { noteToDisplayItem } from "@/utils/display-adapters";
import NotesEmptyState from "./NotesEmptyState";
import NotesListSkeleton from "./NotesListSkeleton";
import NotesGridSkeleton from "./NotesGridSkeleton";
import ErrorState from "./ErrorState";
import SharedGridView from "@/components/shared/SharedGridView";
import SharedListView from "@/components/shared/SharedListView";
import type { NoteOrFolder, Note } from "@/types/note";
import type { MenuOption } from "@/types/display-item";
import { useDownloadPdf } from "@/hooks/use-download-pdf";

export default function NotesList() {
  const router = useRouter();
  const { folderId, search, viewMode } = useNotesFilters();
  const { onDeleteItem, onCreateNote, onCreateFolder } = useNotesActions();

  const { notes, folders, isFetching, isLoading, isError, refetch } =
    useFetchNotes({
      folderId: folderId || undefined,
      search: search || undefined,
    });

  const { downloadPdf } = useDownloadPdf();

  // Combine items for display (folders first, then notes)
  const items: NoteOrFolder[] = useMemo(
    () => [
      ...folders.map((folder) => ({
        ...folder,
        type: "folder" as const,
      })),
      ...notes.map((note) => ({
        ...note,
        type: "note" as const,
        name: note.title, // Map title to name for consistency
      })),
    ],
    [folders, notes]
  );

  // Convert items to display format
  const displayItems = useMemo(() => items.map(noteToDisplayItem), [items]);

  // Navigate to folder or note
  const handleItemClick = (id: string) => {
    const item = items.find((i) => i.id === id);

    if (item?.type === "folder") {
      router.push(`/notes?folderId=${id}`);
    } else {
      router.push(`/notes/${id}`);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/notes/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      onDeleteItem(item);
    }
  };

  // Item menu options
  const getMenuOptions = (id: string): MenuOption[] => {
    const item = items.find((i) => i.id === id);
    if (!item) return [];

    const options: MenuOption[] = [
      {
        title: item?.type === "folder" ? "Open" : "Edit",
        action: () => handleEdit(id),
      },
    ];

    if (item?.type === "note") {
      options.push({
        title: "Download",
        action: () => {
          const noteItem = item as Note;
          downloadPdf({
            title: noteItem.title,
            content: noteItem.content,
          });
        },
      });
    }

    options.push({
      title: "Delete",
      action: () => handleDelete(id),
    });

    return options;
  };

  // Show skeleton during initial load or refetch
  if (isLoading || isFetching) {
    return viewMode === "list" ? <NotesListSkeleton /> : <NotesGridSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load notes"
        message="There was an error loading your notes. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (items.length === 0) {
    return (
      <NotesEmptyState
        searchTerm={search}
        onCreateNote={onCreateNote}
        onCreateFolder={onCreateFolder}
      />
    );
  }

  if (viewMode === "list") {
    return (
      <SharedListView
        items={displayItems}
        onItemClick={handleItemClick}
        getMenuOptions={getMenuOptions}
        showOwner={false}
      />
    );
  }

  return (
    <SharedGridView
      items={displayItems}
      onItemClick={handleItemClick}
      getMenuOptions={getMenuOptions}
    />
  );
}
