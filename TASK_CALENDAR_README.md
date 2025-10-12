# TaskCalendar Component Documentation

## Overview

The **TaskCalendar** is a fully interactive, production-ready React component built for the Merge collaborative learning platform. It displays a monthly calendar view with tasks, assignments, and live sessions, allowing users to view details by clicking on dates.

---

## ✨ Features

### Core Functionality
- ✅ **Interactive Month Navigation**: Previous/Next month buttons with smooth transitions
- ✅ **Task Highlighting**: Dates with tasks shown with subtle background color
- ✅ **Today Indicator**: Current date prominently highlighted
- ✅ **Click-to-View Details**: Modal opens on clicking dates with tasks
- ✅ **Keyboard Accessible**: Full keyboard navigation support
- ✅ **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ✅ **Semantic Colors**: Uses only Tailwind semantic classes (no hardcoded colors)

### Task Types
1. **Assignments** - Homework, quizzes, projects with due dates
2. **Live Sessions** - Scheduled video calls and workshops
3. **Personal Tasks** - User-created reminders and study goals

---

## 📁 File Location

```
src/components/dashboard/TaskCalendar.tsx
```

---

## 🎨 Design Specifications

### Container
- Background: `bg-card`
- Border: `border border-light-border`
- Border Radius: `rounded-xl`
- Padding: `p-6`
- Shadow: `shadow-sm`

### Date Cell States

| State | Background | Text Color | Font Weight | Hover Effect |
|-------|-----------|------------|-------------|--------------|
| **Empty (other months)** | `transparent` | `text-para-muted` | `normal` | None |
| **Regular date** | `transparent` | `text-para` | `font-medium` | None |
| **Date with tasks** | `bg-secondary/5` | `text-para` | `font-semibold` | `hover:bg-secondary/10` |
| **Today** | `bg-primary` | `text-primary-foreground` | `font-bold` | `hover:bg-primary/90` |
| **Selected** | `bg-secondary/20` | `text-heading` | `font-semibold` | `border-2 border-primary` |

### Task Modal

#### Header
- Title: Selected date in format "Wednesday, September 15, 2024"
- Description: Task count "3 tasks scheduled"

#### Task Card Layout
```
┌─────────────────────────────────────────────┐
│ [Icon] Task Title                  [Badge]  │
│        ├─ ⏰ Time                            │
│        ├─ 👥 Room name                      │
│        └─ 📝 Description (truncated)        │
└─────────────────────────────────────────────┘
```

---

## 🔧 Technical Details

### Dependencies

```json
{
  "date-fns": "^3.x",
  "lucide-react": "^0.544.0",
  "framer-motion": "^12.23.16"
}
```

### TypeScript Interfaces

```typescript
interface Task {
  id: string;
  title: string;
  type: 'assignment' | 'session' | 'personal';
  date: Date;
  time?: string;
  room?: string;
  description?: string;
}

interface CalendarDay {
  date: Date;
  dateNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}
```

---

## 💻 Usage

### Basic Implementation

```tsx
import TaskCalendar from '@/components/dashboard/TaskCalendar';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <TaskCalendar />
    </div>
  );
}
```

### In Dashboard Layout

```tsx
// Sidebar Widget Example
<div className="space-y-6">
  <TaskCalendar />
  <OtherWidgets />
</div>
```

---

## 📊 Sample Data Structure

The component includes sample data for demonstration:

```typescript
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'React Components Assignment',
    type: 'assignment',
    date: new Date(2024, 8, 15),
    time: 'Due by 11:59 PM',
    room: 'Advanced React Development',
    description: 'Create a component library...'
  },
  // More tasks...
];
```

### Replacing with Real Data

To connect to your API, modify the component:

```typescript
// Add props for data fetching
interface TaskCalendarProps {
  tasks?: Task[];
  onTaskClick?: (task: Task) => void;
}

export default function TaskCalendar({ 
  tasks = sampleTasks,
  onTaskClick 
}: TaskCalendarProps) {
  // Use tasks prop instead of sampleTasks
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter((task) => isSameDay(task.date, date));
  };
  
  // Rest of component...
}
```

---

## 🎯 Key Functions

### 1. `generateCalendarDays(month: Date): CalendarDay[]`
Generates a 5-6 week calendar grid including:
- Days from previous month (to fill first week)
- All days of current month
- Days from next month (to fill last week)
- Attaches tasks to each date
- Marks today's date

### 2. `getTasksForDate(date: Date): Task[]`
Filters tasks matching a specific date using `isSameDay` from date-fns.

### 3. `handleDateClick(day: CalendarDay)`
Opens modal if the clicked date has tasks, otherwise does nothing.

### 4. Navigation Handlers
- `handlePreviousMonth()`: Decrements month
- `handleNextMonth()`: Increments month

---

## ♿ Accessibility Features

### ARIA Labels
- Navigation buttons: `"Previous month"`, `"Next month"`
- Date cells: `"September 15, 2024, 2 tasks"` or `"September 16, 2024"`

### Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Open modal for dates with tasks
- **Escape**: Close modal
- **Arrow keys**: Navigation buttons are focusable

### Screen Reader Support
- Semantic HTML structure
- Role attributes on interactive elements
- Proper heading hierarchy in modal

---

## 📱 Responsive Behavior

### Desktop (1024px+)
- Full calendar with comfortable spacing
- Modal: `max-w-md`
- Font sizes: `text-sm` for dates

### Tablet (768px - 1023px)
- Slightly reduced padding
- Modal: `max-w-sm`

### Mobile (<768px)
- Compact spacing (`gap-2`)
- Smaller fonts (`text-xs`)
- Full-width modal with margins
- Touch-optimized tap targets

---

## 🎨 Color Customization

The component uses **semantic Tailwind classes** exclusively:

```css
/* Primary color for today */
bg-primary
text-primary-foreground

/* Secondary color for task highlights */
bg-secondary/5
bg-secondary/10
bg-secondary/20

/* Accent colors for task types */
bg-accent/20 (assignments)
bg-info/20 (sessions)
bg-success/20 (personal)

/* Text colors */
text-heading (headings)
text-para (body text)
text-para-muted (secondary text)

/* Backgrounds */
bg-card (component background)
bg-main-background (page background)

/* Borders */
border-light-border
```

All colors automatically adapt to light/dark mode via CSS variables.

---

## 🔄 State Management

### Local State
```typescript
const [currentMonth, setCurrentMonth] = useState(new Date());
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Future Enhancements
For real-world usage, consider:
- React Query for async task fetching
- Context for sharing calendar state across components
- Optimistic updates when tasks are created/deleted

---

## 🚀 Performance Optimizations

1. **Memoization**: Consider using `useMemo` for `calendarDays` if tasks array is large
2. **Virtualization**: Not needed for monthly view (max 42 cells)
3. **Lazy Loading**: Modal content only renders when open
4. **Date Calculations**: Efficient using date-fns library

---

## 🧪 Testing Recommendations

### Unit Tests
```typescript
// Test date generation
expect(generateCalendarDays(new Date(2024, 8, 1))).toHaveLength(35);

// Test task filtering
expect(getTasksForDate(new Date(2024, 8, 15))).toHaveLength(2);
```

### Integration Tests
- Click navigation buttons → month changes
- Click date with tasks → modal opens
- Press Escape → modal closes
- Click outside modal → modal closes

### Accessibility Tests
- Run with screen reader
- Keyboard-only navigation
- Check ARIA labels with axe-devtools

---

## 🐛 Known Limitations

1. **Sample Data**: Currently uses hardcoded tasks (replace with API)
2. **Time Zones**: All dates in local timezone (consider UTC for multi-region)
3. **Recurrence**: No support for recurring tasks yet
4. **Drag & Drop**: Tasks cannot be moved by dragging
5. **Multi-Day Events**: Each task is single-day only

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Week view toggle
- [ ] Task creation from calendar
- [ ] Drag-and-drop task rescheduling
- [ ] Filter by task type
- [ ] Export to .ics file
- [ ] Multi-day event support
- [ ] Recurring task patterns
- [ ] Integration with Google Calendar

### API Integration Example
```typescript
// With React Query
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks', currentMonth],
  queryFn: () => fetchTasksForMonth(currentMonth),
});

if (isLoading) return <CalendarSkeleton />;
```

---

## 📞 Support

For issues or questions:
- Check the component source code comments
- Review the demo page at `/calendar-demo`
- Contact the development team

---

## 📄 License

Part of the Merge collaborative learning platform.

---

## 🎓 Credits

Built with:
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **date-fns** - Date manipulation
- **Lucide React** - Icons
- **Framer Motion** - Animations

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Component Status**: ✅ Production Ready
