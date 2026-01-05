# Assignment Pages Architecture

## Overview

The assignments page follows the **server components pattern** used in the quizzes pages, with role-based rendering and efficient server-side data fetching.

## Architecture Pattern

### Server Components (Data Fetching)

- `page.tsx` - Main server component
- `StudentAssignmentCards.tsx` - Fetches student data
- `InstructorAssignmentCards.tsx` - Fetches instructor data

### Client Components (Interactivity)

- `AssignmentListHeader.tsx` - Search, filters, sort, URL params
- `StudentAssignmentCardsClient.tsx` - Student card rendering & filtering
- `InstructorAssignmentCardsClient.tsx` - Instructor card rendering & filtering

### Shared Components

- `AssignmentCard.tsx` - Individual card component
- `AssignmentCardsSkeleton.tsx` - Loading state
- `EmptyStates.tsx` - Empty/no results states

## File Structure

```
src/
├── app/(with-layout)/rooms/[id]/assignments/
│   └── page.tsx                              # Main server component
│
├── components/assignments/
│   ├── AssignmentListHeader.tsx              # Client: Search/Filter/Sort
│   ├── StudentAssignmentCards.tsx            # Server: Fetch student data
│   ├── InstructorAssignmentCards.tsx         # Server: Fetch instructor data
│   ├── StudentAssignmentCardsClient.tsx      # Client: Render student cards
│   ├── InstructorAssignmentCardsClient.tsx   # Client: Render instructor cards
│   ├── AssignmentCard.tsx                    # Shared: Card component
│   ├── AssignmentCardsSkeleton.tsx           # Shared: Loading skeleton
│   └── EmptyStates.tsx                       # Shared: Empty states
│
└── server-api/
    └── assignments.ts                         # Server-side API calls
```

## Data Flow

```
1. User navigates to /rooms/[id]/assignments?search=...&filter=...
   ↓
2. page.tsx (Server Component)
   - Reads searchParams from URL
   - Determines user role from cookies
   - Renders Header + Suspense boundary
   ↓
3. StudentAssignmentCards OR InstructorAssignmentCards (Server)
   - Calls getAssignments() with params
   - Server-side fetch with Next.js caching (60s revalidate)
   - Returns assignments data
   ↓
4. *CardsClient (Client Component)
   - Receives assignments as props
   - Applies client-side filtering
   - Renders cards or empty states
   ↓
5. AssignmentListHeader (Client Component)
   - User changes search/filter/sort
   - Updates URL searchParams
   - Triggers Suspense re-render
   ↓
6. Suspense shows skeleton, refetches data with new params
```

## Role-Based Differences

### Student View

**URL:** `/rooms/[id]/assignments`

**Tabs:**

- All
- Pending (not submitted, not overdue)
- Missed (overdue, not submitted)
- Submitted (submitted or graded)

**Sort Options:**

- Due Date
- Points
- Title
- Status

**Card Actions:**

- View Details → `/rooms/[id]/assignments/[assignmentId]`

**Data Type:** `StudentAssignment[]`

- Includes: `submission` (status, grade, feedback)

---

### Instructor View

**URL:** `/rooms/[id]/assignments` (same, but different data)

**Tabs:**

- All
- Needs Grading (has submissions to grade)
- Graded (all submissions graded)

**Sort Options:**

- Due Date
- Points
- Title

**Card Actions:**

- View Responses → `/rooms/[id]/assignments/[assignmentId]/submissions`

**Data Type:** `InstructorAssignment[]`

- Includes: `submissionStats` (submitted, total, graded, pending)

## Key Features

### 1. Server-Side Rendering

- Initial page load uses server components
- Data fetched on the server with automatic caching
- No client-side loading spinner for initial render

### 2. Suspense Boundaries

- Header always visible
- Only cards section shows skeleton during refetch
- Key changes on search params → forces Suspense re-render

### 3. URL-Based State

- Search, filter, sort stored in URL params
- Shareable links preserve state
- Browser back/forward works correctly

### 4. Next.js Caching

- 60-second revalidation
- Tagged cache for manual invalidation
- Optimized performance

### 5. Client-Side Filtering

- Filter logic runs on client after data fetch
- No network request for filter changes
- Instant UI updates

## Performance Benefits

| Aspect         | Old Architecture  | New Architecture      |
| -------------- | ----------------- | --------------------- |
| Initial Load   | Client-side fetch | Server-side (faster)  |
| Filtering      | Re-fetch from API | Client-side (instant) |
| Search         | Client-side only  | Server + client       |
| Caching        | React Query       | Next.js Data Cache    |
| Skeleton       | Full page         | Cards only            |
| Code Splitting | Single bundle     | Role-specific bundles |

## Next Steps

1. ✅ List page architecture complete
2. 🔄 Create student detail page: `/rooms/[id]/assignments/[assignmentId]/page.tsx`
3. 🔄 Create instructor submissions page: `/rooms/[id]/assignments/[assignmentId]/submissions/page.tsx`

## Example URLs

**Student:**

- All assignments: `/rooms/123/assignments`
- Pending only: `/rooms/123/assignments?filter=pending`
- Search: `/rooms/123/assignments?search=chapter`
- Combined: `/rooms/123/assignments?filter=missed&search=quiz&sortBy=dueDate`

**Instructor:**

- All assignments: `/rooms/123/assignments`
- Needs grading: `/rooms/123/assignments?filter=needs-grading`
- View responses: `/rooms/123/assignments/456/submissions`
