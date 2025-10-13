# Discover Page - Public Rooms Feed

A comprehensive, responsive discover page for browsing and joining public rooms. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 📁 File Structure

```
src/
├── app/(with-layout)/discover/
│   └── page.tsx                    # Main discover page
├── components/discover/
│   ├── SearchBar.tsx               # Debounced search input
│   ├── FilterBar.tsx               # Tag filters & sort dropdown
│   ├── TagChip.tsx                 # Reusable tag chip component
│   ├── RoomCard.tsx                # Individual room card
│   ├── RoomGrid.tsx                # Responsive grid wrapper
│   ├── RoomPreviewModal.tsx        # Full preview modal
│   ├── RecommendedRooms.tsx        # Horizontal scroll recommended section
│   ├── EmptyState.tsx              # Empty/no results states
│   └── LoaderSkeleton.tsx          # Loading placeholder
├── types/
│   └── discover.ts                 # TypeScript interfaces
└── lib/constants/
    └── discover-mock-data.ts       # Mock data for development
```

## ✨ Features

### 1. **Search & Filtering**
- ✅ Debounced search (300ms) - searches title, description, creator, and tags
- ✅ Multi-tag filtering with active state indicators
- ✅ Sort options: Newest, Most Active, Most Members
- ✅ Clear filters button with active filter count
- ✅ Show/hide additional tags functionality

### 2. **Responsive Layout**
- ✅ Desktop: 4-column grid (xl), 3-column (lg)
- ✅ Tablet: 2-column grid (md)
- ✅ Mobile: Single column, full-width cards
- ✅ Smooth transitions on all breakpoints

### 3. **Room Cards**
Each card displays:
- Room thumbnail with "Active" indicator
- Creator avatar and name
- Room title (truncated)
- Description (2-line clamp)
- Tags (max 3 visible + count)
- Member avatars using `MembersAvatar` component
- Member count
- Two actions: Preview (secondary) and Join (primary)

### 4. **Room Preview Modal**
Full-featured modal showing:
- Room title and creator
- Full description with "Read More" expansion
- All tags
- Up to 6 member previews with avatars
- Up to 3 file previews with icons and sizes
- Up to 3 assignment previews with due dates
- Actions: Open Full Room (secondary), Join Room (primary)
- Keyboard accessible (ESC to close)
- Click outside to close
- Body scroll lock when open

### 5. **Recommended Rooms**
- Horizontal scrolling carousel
- Shows top 3 most popular active rooms
- Compact card design
- Click to preview

### 6. **Infinite Scroll**
- Loads 12 rooms initially
- Automatically loads 12 more when scrolling near bottom
- Loading skeletons during fetch
- "Scroll down to load more" indicator

### 7. **Accessibility**
- ✅ Proper ARIA roles and labels
- ✅ Keyboard navigation support
- ✅ Focus visible states
- ✅ Semantic HTML structure
- ✅ Alt text for all images
- ✅ Screen reader friendly

### 8. **Empty States**
- No rooms available
- No search results
- Clear filters option

## 🎨 Design System

### Colors (from codebase)
- Primary: `#2f1a58` (purple)
- Secondary: `#8668c0` (light purple)
- Accent: `#e69a29` (orange)
- Success: `#10b981` (green)
- Background: `#fafafa`
- Border: `#e5e7eb`

### Component Specifications
- **Buttons**: height 40-48px, border-radius 8px
- **Cards**: rounded-xl (12px), padding 20px, shadow-sm
- **Tags**: rounded-full, small pills
- **Grid gaps**: 24px (1.5rem)
- **Typography**: Roboto (body), Raleway (headings)

## 🔧 API Integration Ready

All components accept props and callbacks for easy API integration:

```typescript
// Example: Replace mock data with API
const [rooms, setRooms] = useState<PublicRoom[]>([]);

useEffect(() => {
  async function fetchRooms() {
    const response = await fetch('/api/rooms/public');
    const data = await response.json();
    setRooms(data);
  }
  fetchRooms();
}, []);
```

### Key Integration Points
1. **Search**: `onSearch` callback in `SearchBar`
2. **Filters**: `onTagToggle`, `onSortChange` in `FilterBar`
3. **Join Room**: `onJoin` callback in `RoomCard` and `RoomPreviewModal`
4. **Preview**: `onPreview` callback opens modal
5. **Open Full**: `onOpenFull` for navigation to room details

## 📊 Mock Data Structure

```typescript
interface PublicRoom {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  description: string;
  tags: string[];
  membersCount: number;
  activeNow: boolean;
  thumbnail: string;
  files: Array<{
    id: string;
    name: string;
    type: "pdf" | "image" | "doc" | "video" | "other";
    size: string;
  }>;
  assignments: Array<{
    id: string;
    title: string;
    dueDate: string;
  }>;
  membersPreview: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  lastActiveAt: string;
}
```

## 🚀 Usage

Navigate to `/discover` to view the page. The page is fully functional with mock data.

### Customization

**Change items per page:**
```typescript
const ITEMS_PER_PAGE = 12; // In page.tsx
```

**Modify debounce delay:**
```typescript
<SearchBar onSearch={handleSearch} debounceMs={300} />
```

**Customize recommended rooms logic:**
```typescript
const recommendedRooms = useMemo(() => {
  // Your custom logic here
  return rooms.filter(/* ... */);
}, []);
```

## 🎯 Performance Optimizations

- ✅ `useMemo` for filtered/sorted data
- ✅ `useCallback` for event handlers
- ✅ Debounced search to reduce re-renders
- ✅ Infinite scroll vs. pagination
- ✅ Image lazy loading with Next.js Image
- ✅ Skeleton loaders for perceived performance

## 📱 Responsive Breakpoints

- `sm`: 640px - 2 columns
- `md`: 768px - 2 columns
- `lg`: 1024px - 3 columns
- `xl`: 1280px - 4 columns

## 🔍 SEO Considerations

Add these to the page for production:

```typescript
export const metadata = {
  title: 'Discover Rooms | Merge',
  description: 'Explore and join public learning rooms across various topics',
};
```

## 🐛 Known Limitations

- Mock images will show fallback backgrounds (replace with real images)
- Avatar images need real URLs
- Join room action shows alert (implement backend integration)

## 🎓 Future Enhancements

1. **Advanced Filters**: Date range, difficulty level, language
2. **User Preferences**: Remember last selected filters
3. **Analytics**: Track room views and joins
4. **Social Features**: Room ratings, reviews
5. **Share**: Share rooms via social media
6. **Bookmarks**: Save rooms for later
7. **Real-time Updates**: WebSocket for active status
8. **Lazy Load Images**: Progressive image loading

## 📝 Notes

- All components are client-side (`"use client"`)
- Fully typed with TypeScript
- Follows Next.js 14 app router conventions
- Uses existing design system colors
- Integrates with existing `MembersAvatar` component
- Ready for i18n with text extraction
