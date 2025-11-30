# Notes Page Refactoring Guide

## Current Status
✅ **Requirement 1 Complete**: The notes page is now wrapped in a Suspense boundary
- `page.tsx` - Server component with Suspense wrapper
- `NotesPageClient.tsx` - Client component with all the logic

## Suggested Refactoring for Better Maintainability

The current `NotesPageClient.tsx` has ~500 lines with mixed concerns. Here's how to refactor it:

### 1. Extract Custom Hooks

#### `use-notes-state.ts` - UI State Management
Extract all local state into a dedicated hook:
```typescript
export function useNotesState() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<NoteSortOption>("lastEdited");
  const [viewMode, setViewMode] = useState<NoteViewMode>("grid");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({...});
  
  return { /* all state and setters */ };
}
```

#### `use-breadcrumb-navigation.ts` - Breadcrumb Logic
Extract breadcrumb management:
```typescript
export function useBreadcrumbNavigation(folderId: string | null) {
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);
  
  // Load from sessionStorage
  // Handle navigation
  // Handle back button
  
  return {
    breadcrumbs,
    handleBreadcrumbClick,
    handleFolderNavigation,
    handleBackNavigation,
  };
}
```

#### `use-notes-data.ts` - Data Fetching & Processing
Centralize all data operations:
```typescript
export function useNotesData({ folderId, searchTerm, sortBy }) {
  const { notes, folders, isLoading, isError, refetch } = useFetchNotes({...});
  const { deleteNote, isDeleting: isDeletingNote } = useDeleteNote();
  const { deleteFolder, isDeleting: isDeletingFolder } = useDeleteFolder();
  const { createFolder, isCreating } = useCreateFolder({...});
  
  // Data transformation logic
  const currentItems = useMemo(() => {
    // Convert and sort notes/folders
  }, [notes, folders, sortBy]);
  
  return {
    currentItems,
    isLoading,
    isError,
    refetch,
    createFolder,
    deleteNote,
    deleteFolder,
    isCreating,
    isDeleting: isDeletingNote || isDeletingFolder,
  };
}
```

#### `use-notes-actions.ts` - Action Handlers
Extract all event handlers:
```typescript
export function useNotesActions({
  router,
  folderId,
  searchTerm,
  currentItems,
  setShowCreateFolderModal,
  setDeleteConfirmation,
  // ... other dependencies
}) {
  const handleCreateNote = () => { /* ... */ };
  const handleCreateFolder = () => { /* ... */ };
  const handleItemClick = (id: string) => { /* ... */ };
  const handleEdit = (id: string) => { /* ... */ };
  const handleDelete = (id: string) => { /* ... */ };
  const handleDownload = (id: string) => { /* ... */ };
  
  const sortOptions = [...];
  const getSortLabel = () => { /* ... */ };
  const getItemMenuOptions = (id: string) => { /* ... */ };
  
  return {
    handleCreateNote,
    handleCreateFolder,
    handleItemClick,
    handleEdit,
    handleDelete,
    handleDownload,
    sortOptions,
    getSortLabel,
    getItemMenuOptions,
  };
}
```

### 2. Extract UI Components

#### `NotesBackButton.tsx`
```typescript
export default function NotesBackButton({
  folderId,
  currentItems,
  searchTerm,
  onBack,
}) {
  // Just the back button and item count display
}
```

#### `NotesContent.tsx`
```typescript
export default function NotesContent({
  isLoading,
  isError,
  currentItems,
  viewMode,
  searchTerm,
  onRefetch,
  onCreateNote,
  onCreateFolder,
  onItemClick,
  getItemMenuOptions,
}) {
  // Handles all content states: loading, error, empty, list, grid
}
```

#### `NotesModals.tsx`
```typescript
export default function NotesModals({
  showCreateFolderModal,
  onCloseCreateFolder,
  onCreateFolderSubmit,
  isCreating,
  deleteConfirmation,
  onCancelDelete,
  onConfirmDelete,
  isDeleting,
}) {
  // All modals in one place
}
```

### 3. Refactored NotesPageClient Structure

After refactoring, your main component would look like:

```typescript
export default function NotesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folderId');

  // State management
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    showSortMenu,
    setShowSortMenu,
    showCreateFolderModal,
    setShowCreateFolderModal,
    deleteConfirmation,
    setDeleteConfirmation,
  } = useNotesState();

  // Data fetching
  const {
    currentItems,
    isLoading,
    isError,
    refetch,
    isCreating,
    isDeleting,
  } = useNotesData({ folderId, searchTerm, sortBy });

  // Breadcrumb navigation
  const {
    breadcrumbs,
    handleBreadcrumbClick,
    handleFolderNavigation,
    handleBackNavigation,
  } = useBreadcrumbNavigation(folderId);

  // Actions
  const {
    handleCreateNote,
    handleCreateFolder,
    handleCreateFolderSubmit,
    handleItemClick,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleDownload,
    getItemMenuOptions,
    sortOptions,
    getSortLabel,
  } = useNotesActions({
    router,
    folderId,
    searchTerm,
    currentItems,
    breadcrumbs,
    setShowCreateFolderModal,
    setDeleteConfirmation,
    deleteConfirmation,
    handleFolderNavigation,
    setSortBy,
    setShowSortMenu,
    sortBy,
  });

  return (
    <div className="space-y-6 sm:px-6 px-4 sm:py-6 py-4">
      <NotesHeader
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
      />
      
      <NotesBreadcrumbs
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={handleBreadcrumbClick}
      />
      
      <NotesToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
        sortOptions={sortOptions}
        getSortLabel={getSortLabel}
      />
      
      <NotesBackButton
        folderId={folderId}
        currentItems={currentItems}
        searchTerm={searchTerm}
        onBack={handleBackNavigation}
      />
      
      <NotesContent
        isLoading={isLoading}
        isError={isError}
        currentItems={currentItems}
        viewMode={viewMode}
        searchTerm={searchTerm}
        onRefetch={refetch}
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
        onItemClick={handleItemClick}
        getItemMenuOptions={getItemMenuOptions}
      />
      
      <NotesModals
        showCreateFolderModal={showCreateFolderModal}
        onCloseCreateFolder={() => setShowCreateFolderModal(false)}
        onCreateFolderSubmit={handleCreateFolderSubmit}
        isCreating={isCreating}
        deleteConfirmation={deleteConfirmation}
        onCancelDelete={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
```

## Benefits of This Refactoring

1. **Separation of Concerns**: Each hook/component has a single responsibility
2. **Testability**: Hooks and components can be tested in isolation
3. **Reusability**: Hooks can be reused in other parts of the app
4. **Maintainability**: Easier to find and fix bugs
5. **Readability**: Main component is now ~100 lines instead of ~500

## When to Refactor

Consider doing this refactoring when:
- You need to add significant new features
- You're experiencing bugs that are hard to track down
- You have time allocated for technical debt
- You're onboarding new developers who need to understand the code

## Migration Strategy

1. Start with one hook at a time (e.g., `use-notes-state.ts`)
2. Test thoroughly after each extraction
3. Move to the next hook only when the previous one is stable
4. Extract UI components last (they're less risky)
5. Keep the old code in git history for reference
