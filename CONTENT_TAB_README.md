# Content Tab UI - Component Documentation

## Overview
The Content Tab is a comprehensive file and folder management interface for the Room page. It provides grid/list views, drag-and-drop uploads, detailed metadata panels, and responsive layouts.

## Component Architecture

### 📁 File Structure
```
src/
├── types/
│   └── content.ts                    # TypeScript type definitions
├── utils/
│   └── file-helpers.ts               # File icon, size, date formatting utilities
├── lib/constants/
│   └── content-mock-data.ts          # Sample data for development
└── components/content/
    ├── ContentToolbar.tsx             # Top toolbar with breadcrumb, search, filters
    ├── FileCard.tsx                   # Grid view file card component
    ├── FolderCard.tsx                 # Grid view folder card component
    ├── ContentListRow.tsx             # List view row component
    ├── ContentListHeader.tsx          # List view header with sortable columns
    ├── ContentDetailsPanel.tsx        # Right sidebar with item details
    ├── UploadDropzone.tsx             # Drag-and-drop upload overlay
    ├── UploadProgressTray.tsx         # Bottom upload progress indicator
    ├── EmptyStates.tsx                # Empty folder, no results states
    └── ContextMenu.tsx                # Right-click context menu
```

---

## Components

### 1. **ContentToolbar**
**Location:** `components/content/ContentToolbar.tsx`

Top-level toolbar with navigation and controls.

**Props:**
```typescript
{
  breadcrumbs: BreadcrumbItem[];        // Navigation breadcrumb
  searchTerm: string;                   // Search input value
  onSearchChange: (value: string) => void;
  activeFilter: FilterType;             // Active file type filter
  onFilterChange: (filter: FilterType) => void;
  viewMode: ViewMode;                   // 'grid' | 'list'
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;                   // Sort option
  onSortChange: (sort: SortOption) => void;
  selectedCount: number;                // Number of selected items
  onUpload?: () => void;
  onNewFolder?: () => void;
  onBulkDownload?: () => void;
  onBulkMove?: () => void;
  onBulkDelete?: () => void;
  onBulkTag?: () => void;
  onClearSelection?: () => void;
}
```

**Features:**
- Collapsible breadcrumb navigation
- Search with real-time filtering
- Quick filter chips (All, Docs, Slides, PDFs, etc.)
- Sort dropdown (Name, Date, Size, Type)
- View mode toggle (Grid/List)
- Upload and New Folder buttons
- Bulk action bar (appears when items selected)

**Dimensions:**
- Height: Auto (min ~120px with breadcrumb + controls)
- Button height: 40px (h-10)
- Icons: 16px (h-4 w-4)

---

### 2. **FileCard** & **FolderCard**
**Location:** `components/content/FileCard.tsx`, `FolderCard.tsx`

Grid view cards with hover effects and quick actions.

**Common Props:**
```typescript
{
  folder/file: FolderItem | FileItem;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  onQuickAction?: (action: string, id: string) => void;
}
```

**Features:**
- **Card Size:** 220×160px recommended (responsive grid)
- **Hover State:** 
  - Lifts 6px (y: -6)
  - Scale 1.02
  - Shadow elevation increase
  - Quick action overlay appears
- **Selection:** Checkbox appears on hover/selection
- **Quick Actions Overlay:** Preview, Download, More (circular buttons)
- **File Preview:** Shows thumbnail for images/videos
- **Metadata:** Type badge, size, modified date, owner avatar

**Visual States:**
- Default: border-light-border
- Hover: border-secondary/30, shadow-md
- Selected: border-secondary, bg-secondary/5, shadow-lg

---

### 3. **ContentListRow** & **ContentListHeader**
**Location:** `components/content/ContentListRow.tsx`, `ContentListHeader.tsx`

List view with sortable columns.

**Row Structure:**
```
[Checkbox] [Icon + Name] [Type] [Size] [Modified] [Owner] [Actions]
   auto        1fr        120px   100px   150px      120px    auto
```

**Features:**
- **Row Height:** 56px (py-3)
- **Hover State:** bg-secondary/5
- **Columns:**
  - Checkbox (multi-select)
  - Name with icon and tags (truncate)
  - Type (File type or "Folder")
  - Size (formatted or item count)
  - Modified (relative date)
  - Owner (avatar + name)
  - Actions (three-dot menu)

**Header Features:**
- Sortable columns with arrow indicators
- Select all checkbox
- Sticky positioning

---

### 4. **ContentDetailsPanel**
**Location:** `components/content/ContentDetailsPanel.tsx`

Right sidebar showing selected item details.

**Dimensions:**
- Width: 320px (w-80)
- Border: left border-light-border

**Sections:**
1. **Header:** "Details" title + close button
2. **Preview Area:** Image/video thumbnail (if available)
3. **Icon:** Large item icon (if no preview)
4. **Name:** Item name (word-wrap)
5. **Quick Actions:** Grid of action buttons
6. **Metadata:**
   - Type
   - Size/Item count
   - Owner (avatar + name)
   - Last modified
   - Created date
7. **Tags:** Tag chips with "Add tag" link
8. **Description:** Full text description
9. **Version History:** Last 3 versions (files only)
10. **Footer Actions:** Add Tag, Delete buttons

**Empty State:** Shows placeholder with "No item selected" message

**Responsive:**
- Desktop: Fixed right sidebar
- Tablet: Slide-in drawer
- Mobile: Full-screen panel

---

### 5. **UploadDropzone**
**Location:** `components/content/UploadDropzone.tsx`

Full-screen drag-and-drop overlay.

**Features:**
- **Trigger:** Appears when dragging files over page
- **Visual:** 
  - Semi-transparent backdrop (bg-black/40, backdrop-blur)
  - Centered modal with dashed border
  - Animated CloudUpload icon (floating animation)
- **Content:**
  - Icon: 96px circle with gradient (primary → secondary)
  - Title: "Drop files to upload"
  - Hint: "Files are stored in this room only"
  - Supported formats list

**Animation:**
- Fade in/out: 200ms
- Icon bounce: 2s infinite ease-in-out

---

### 6. **UploadProgressTray**
**Location:** `components/content/UploadProgressTray.tsx`

Bottom-right floating upload progress indicator.

**Dimensions:**
- Width: 384px (w-96)
- Max Height: 400px
- Position: Fixed bottom-6 right-6

**Features:**
- **Header:** Upload count + loading spinner
- **Upload Items:**
  - File name + size
  - Progress bar (gradient primary → secondary)
  - Percentage indicator
  - Cancel button (while uploading)
  - Success/error icons
- **Summary Footer:** Completed/failed count
- **Clear All Button:** When all uploads complete

**Item States:**
- **Uploading:** Progress bar, cancel icon
- **Completed:** Green checkmark, success message
- **Error:** Red alert icon, error message

---

### 7. **EmptyStates**
**Location:** `components/content/EmptyStates.tsx`

Three empty state components:

#### **EmptyFolderState**
- Large FolderOpen icon in gradient circle
- "This folder is empty" heading
- "Upload Files" + "Create Folder" buttons
- Drag-and-drop hint

#### **NoSearchResults**
- Search icon with rotation animation
- "No items match your search" heading
- Shows search term
- "Clear Search" button

#### **NoContentState**
- Generic FileX icon
- Customizable message and description

**Animation:** fade-in + slide-up (y: 20)

---

### 8. **ContextMenu**
**Location:** `components/content/ContextMenu.tsx`

Right-click context menu.

**Features:**
- **Position:** Fixed at cursor position
- **Min Width:** 200px
- **Items:**
  - Preview (files only)
  - Download
  - Rename
  - Move
  - Share
  - Details
  - Add Tag
  - Delete (destructive, red text)
- **Dividers:** Between action groups
- **Keyboard:** ESC to close
- **Click Outside:** Closes menu

**Icons:**
- Eye (Preview)
- Download
- Edit3 (Rename)
- FolderOpen (Move)
- Share2
- Info (Details)
- Tag
- Trash2 (Delete, destructive)

---

## Type Definitions

### Core Types (`types/content.ts`)

```typescript
type FileType = "pdf" | "docx" | "pptx" | "xlsx" | "png" | "jpg" | ...;
type ContentItemType = "file" | "folder";
type ViewMode = "grid" | "list";
type SortOption = "name" | "date" | "size" | "type";
type FilterType = "all" | "docs" | "slides" | "pdfs" | "images" | ...;

interface FileItem {
  id: string;
  name: string;
  type: "file";
  fileType: FileType;
  size: number;
  owner: ContentOwner;
  createdAt: Date;
  modifiedAt: Date;
  tags?: string[];
  description?: string;
  downloadUrl?: string;
  previewUrl?: string;
  versionHistory?: FileVersion[];
}

interface FolderItem {
  id: string;
  name: string;
  type: "folder";
  itemCount: number;
  subfolders?: number;
  files?: number;
  owner: ContentOwner;
  createdAt: Date;
  modifiedAt: Date;
  tags?: string[];
  description?: string;
}
```

---

## Utility Functions (`utils/file-helpers.ts`)

```typescript
// Get icon type for file
getFileIconType(fileType: FileType): FileIconType

// Get color class for file icon
getFileIconColor(fileType: FileType): string

// Get human-readable label
getFileTypeLabel(fileType: FileType): string

// Format bytes to KB/MB/GB
formatFileSize(bytes: number): string

// Format date to relative time
formatDate(date: Date): string

// Get badge color for file type
getFileTypeColor(fileType: FileType): string
```

---

## Responsive Breakpoints

### Desktop (lg: 1024px+)
- Two-column layout (content + details panel)
- Grid: 3-4 columns
- Full toolbar with all controls visible

### Tablet (md: 768px - 1023px)
- Single column layout
- Details panel becomes slide-in drawer
- Grid: 2 columns
- Toolbar compacts some labels

### Mobile (< 768px)
- Single column
- Grid becomes single column list
- Details open as full-screen panel
- Toolbar overflow menu
- Larger tap targets

---

## Accessibility Features

### ARIA Labels
- All interactive elements have `aria-label`
- Breadcrumb has `aria-current="page"` for last item
- Buttons have `aria-pressed` for toggles
- Dropdown has `aria-expanded` and `aria-haspopup`
- List rows have `aria-selected`
- Context menu has `role="menu"` and `role="menuitem"`

### Keyboard Navigation
- **Tab:** Navigate through toolbar → items
- **Enter:** Activate/open item
- **Space:** Toggle checkbox selection
- **ESC:** Close modals, context menus
- **Arrow Keys:** (Future) Navigate grid/list

### Focus Management
- Visible focus rings on all interactive elements
- Logical tab order
- Focus trap in modals

### Color Contrast
- All text meets WCAG AA standards
- Icons use semantic colors from theme
- Hover states increase contrast

---

## Visual Tokens

### Colors (from existing palette)
- **Primary:** #2f1a58 (deep purple)
- **Secondary:** #8668c0 (lavender)
- **Accent:** #e69a29 (amber)
- **Destructive:** #ef4444 (red)
- **Borders:** border-light-border
- **Text:** text-heading, text-para, text-para-muted

### File Type Colors
- **PDF:** text-destructive (red)
- **Word:** text-[#2B579A] (blue)
- **PowerPoint:** text-[#D04423] (orange)
- **Excel:** text-[#217346] (green)
- **Images:** text-accent (amber)
- **Videos:** text-secondary (lavender)
- **Audio:** text-primary (purple)

### Spacing
- Card gap: 16px (gap-4)
- Content padding: 24px (p-6)
- Button padding: px-4 py-2
- Section spacing: space-y-6

### Shadows
- Card default: shadow-sm
- Card hover: shadow-md
- Selected: shadow-lg
- Context menu: shadow-2xl

### Corners
- Cards: rounded-xl (12px)
- Buttons: rounded-lg (8px)
- Badges: rounded-full
- Inputs: rounded-lg

### Transitions
- Hover: 100-150ms ease
- Scale: Spring (stiffness: 300, damping: 25)
- Fade: 200ms ease

---

## Sample Data

See `lib/constants/content-mock-data.ts` for:
- 5 folder items
- 10 file items (various types)
- Breadcrumb samples
- Owner avatars

**File Types Covered:**
- PDF (Lecture1.pdf)
- Word (Syllabus.docx)
- Image (Diagram.png, Screenshot.jpg)
- Archive (Assignment1.zip)
- Markdown (Notes.md)
- PowerPoint (Presentation.pptx)
- Excel (DataSet.xlsx)
- Video (Tutorial.mp4)
- Audio (Podcast.mp3)

---

## Usage Example

```tsx
import ContentTab from '@/app/(with-layout)/rooms/[id]/content/page';

// The component manages its own state
// No props required - fully self-contained
export default function RoomContentPage() {
  return <ContentTab />;
}
```

---

## Future Enhancements (Not Implemented)

- Actual file upload API integration
- Folder navigation (drill-down)
- File preview modal
- Rename inline editing
- Bulk operations implementation
- Keyboard shortcuts
- Infinite scroll / pagination
- File sharing modal
- Advanced search filters
- Thumbnail generation
- Drag-to-reorder
- Breadcrumb overflow handling

---

## Performance Considerations

- **Virtualization:** Consider `react-window` for large lists (1000+ items)
- **Lazy Loading:** Load thumbnails on demand
- **Memoization:** All filtered/sorted lists use `useMemo`
- **Debouncing:** Search input should debounce (300ms recommended)
- **Image Optimization:** Use Next.js Image component for previews
- **Code Splitting:** Lazy load ContextMenu, UploadProgressTray

---

## Testing Checklist

### Visual Tests
- [ ] Grid view displays correctly (all file types)
- [ ] List view columns align properly
- [ ] Empty states show appropriate messages
- [ ] Hover effects work on cards/rows
- [ ] Selection checkboxes appear/hide correctly
- [ ] Quick action overlay displays on hover
- [ ] Details panel scrolls properly
- [ ] Upload dropzone appears when dragging
- [ ] Progress tray updates correctly
- [ ] Context menu positions correctly

### Interaction Tests
- [ ] Search filters content in real-time
- [ ] Filter chips apply correctly
- [ ] Sort changes order properly
- [ ] View mode toggle switches layouts
- [ ] Item selection works (single/multi)
- [ ] Select all checkbox toggles correctly
- [ ] Bulk action bar appears when items selected
- [ ] Item click opens details panel
- [ ] Context menu shows on right-click
- [ ] Upload progress simulates correctly

### Responsive Tests
- [ ] Desktop: 2-column layout
- [ ] Tablet: 1-column with drawer
- [ ] Mobile: Compact toolbar
- [ ] Grid adjusts columns by screen size
- [ ] List view scrolls horizontally if needed
- [ ] Touch targets are min 44×44px

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Focus visible on all elements
- [ ] Color contrast passes WCAG AA
- [ ] ESC closes modals/menus

---

## Design Specifications Summary

### Layout
- **Toolbar Height:** ~120px (auto)
- **Card Size:** 220×160px
- **List Row Height:** 56px
- **Details Panel Width:** 320px
- **Grid Gaps:** 16px
- **Content Padding:** 24px

### Typography
- **Heading:** text-xl to text-3xl, font-bold
- **Card Title:** text-sm, font-semibold
- **Body:** text-sm, text-para
- **Meta:** text-xs, text-para-muted

### Icons
- **Large:** h-16 w-16 (empty states)
- **Medium:** h-10 w-10 (dropzone)
- **Small:** h-5 w-5 (list view)
- **Button:** h-4 w-4 (toolbar, actions)

### Buttons
- **Primary:** bg-primary, text-white, h-10
- **Secondary:** border, bg-transparent, h-10
- **Icon Only:** w-8 h-8 (compact)

---

**End of Documentation**
