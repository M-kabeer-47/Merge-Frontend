import type { NoteOrFolder } from "@/types/note";

export const sampleNotesAndFolders: NoteOrFolder[] = [
  // Root level folders
  {
    id: "folder-1",
    name: "Study Notes",
    type: "folder",
    parentId: null,
    itemCount: 5,
    createdAt: new Date("2024-10-01T09:00:00"),
    updatedAt: new Date("2024-10-15T14:20:00"),
    isPinned: true,
  },
  {
    id: "folder-2",
    name: "Project Ideas",
    type: "folder",
    parentId: null,
    itemCount: 3,
    createdAt: new Date("2024-10-05T10:00:00"),
    updatedAt: new Date("2024-10-12T16:30:00"),
  },
  {
    id: "folder-3",
    name: "Daily Reflections",
    type: "folder",
    parentId: null,
    itemCount: 4,
    createdAt: new Date("2024-09-28T08:00:00"),
    updatedAt: new Date("2024-10-10T21:00:00"),
  },
  {
    id: "folder-4",
    name: "Code Snippets",
    type: "folder",
    parentId: null,
    itemCount: 6,
    createdAt: new Date("2024-10-03T11:00:00"),
    updatedAt: new Date("2024-10-11T15:00:00"),
    isPinned: true,
  },

  // Root level notes (no folder)
  {
    id: "note-root-1",
    name: "Quick Ideas",
    type: "note",
    parentId: null,
    content:
      "Random thoughts and ideas:\n\n- Build a habit tracker with gamification\n- Create a markdown-based blog\n- Develop a pomodoro timer with analytics\n- Design system for personal projects",
    createdAt: new Date("2024-10-14T16:30:00"),
    updatedAt: new Date("2024-10-14T16:30:00"),
    color: "accent",
  },
  {
    id: "note-root-2",
    name: "Meeting Notes - Team Sync",
    type: "note",
    parentId: null,
    content:
      "October 10 Team Meeting:\n\n- Sprint review went well\n- New feature: user authentication\n- My tasks: implement JWT, password hashing\n- Deadline: End of week\n- Follow up with Sarah about API design",
    createdAt: new Date("2024-10-10T15:00:00"),
    updatedAt: new Date("2024-10-10T15:00:00"),
  },

  // Inside "Study Notes" folder
  {
    id: "note-1",
    name: "React Hooks Deep Dive",
    type: "note",
    parentId: "folder-1",
    content:
      "Understanding React Hooks:\n\n1. useState - local component state\n2. useEffect - side effects and lifecycle\n3. useContext - global state management\n4. useReducer - complex state logic\n5. useMemo - performance optimization\n6. useCallback - memoized callbacks\n\nKey principle: Hooks must be called at the top level, not inside loops or conditions.",
    createdAt: new Date("2024-10-15T09:30:00"),
    updatedAt: new Date("2024-10-15T14:20:00"),
    color: "primary",
  },
  {
    id: "note-2",
    name: "Database Normalization",
    type: "note",
    parentId: "folder-1",
    content:
      "Database normalization forms:\n\n- 1NF: Atomic values, no repeating groups\n- 2NF: No partial dependencies on composite keys\n- 3NF: No transitive dependencies\n- BCNF: Every determinant is a candidate key\n\nRemember: Balance normalization with query performance needs.",
    createdAt: new Date("2024-10-14T16:45:00"),
    updatedAt: new Date("2024-10-14T16:45:00"),
    color: "secondary",
  },
  {
    id: "note-3",
    name: "TypeScript Best Practices",
    type: "note",
    parentId: "folder-1",
    content:
      "TypeScript patterns:\n\n- Use interfaces for object shapes\n- Type guards for runtime type checking\n- Generics for reusable type-safe code\n- Utility types: Partial, Pick, Omit, Record\n- Avoid 'any' - use 'unknown' instead\n- Enable strict mode in tsconfig.json\n\nAlways think about type safety from the start!",
    createdAt: new Date("2024-10-11T11:15:00"),
    updatedAt: new Date("2024-10-13T09:00:00"),
    color: "primary",
  },
  {
    id: "folder-1-1",
    name: "Interview Prep",
    type: "folder",
    parentId: "folder-1",
    itemCount: 2,
    createdAt: new Date("2024-10-08T10:00:00"),
    updatedAt: new Date("2024-10-13T14:00:00"),
  },
  {
    id: "note-4",
    name: "System Design Basics",
    type: "note",
    parentId: "folder-1",
    content:
      "Key concepts for system design:\n\n1. Scalability (horizontal vs vertical)\n2. Load balancing\n3. Caching strategies\n4. Database sharding\n5. Microservices architecture\n6. Message queues\n7. CDN usage\n\nAlways start with requirements and constraints!",
    createdAt: new Date("2024-10-09T13:00:00"),
    updatedAt: new Date("2024-10-09T13:00:00"),
  },

  // Inside "Study Notes > Interview Prep" folder
  {
    id: "note-1-1-1",
    name: "Data Structures Checklist",
    type: "note",
    parentId: "folder-1-1",
    content:
      "Must-know data structures:\n\n✓ Arrays and Strings\n✓ Linked Lists\n✓ Stacks and Queues\n✓ Trees (Binary, BST, AVL)\n✓ Graphs (DFS, BFS)\n✓ Hash Tables\n✓ Heaps\n○ Tries\n○ Segment Trees\n\nPractice problems daily!",
    createdAt: new Date("2024-10-13T10:00:00"),
    updatedAt: new Date("2024-10-13T14:00:00"),
    color: "accent",
    tags: ["interview", "algorithms"],
  },
  {
    id: "note-1-1-2",
    name: "Behavioral Questions",
    type: "note",
    parentId: "folder-1-1",
    content:
      "Common behavioral questions:\n\n1. Tell me about yourself\n2. Why this company?\n3. Biggest challenge overcome\n4. Conflict resolution example\n5. Leadership experience\n6. Failure and learning\n\nUse STAR method: Situation, Task, Action, Result",
    createdAt: new Date("2024-10-12T15:00:00"),
    updatedAt: new Date("2024-10-12T15:00:00"),
    tags: ["interview", "behavioral"],
  },

  // Inside "Project Ideas" folder
  {
    id: "note-5",
    name: "AI Study Assistant",
    type: "note",
    parentId: "folder-2",
    content:
      "AI-powered study assistant features:\n\n- Summarize lecture notes\n- Generate quiz questions\n- Flashcard creation\n- Study schedule optimization\n- Progress tracking\n\nTech stack: Next.js, OpenAI API, PostgreSQL, Tailwind",
    createdAt: new Date("2024-10-12T14:20:00"),
    updatedAt: new Date("2024-10-12T16:30:00"),
    color: "primary",
    tags: ["ai", "education"],
  },
  {
    id: "note-6",
    name: "Collaborative Whiteboard",
    type: "note",
    parentId: "folder-2",
    content:
      "Real-time whiteboard app:\n\n- Canvas drawing with tools\n- Real-time collaboration (WebSocket)\n- Shape library\n- Export to PNG/SVG\n- Version history\n\nTech: React, Socket.io, Canvas API",
    createdAt: new Date("2024-10-11T09:00:00"),
    updatedAt: new Date("2024-10-11T09:00:00"),
    color: "secondary",
    tags: ["realtime", "canvas"],
  },
  {
    id: "note-7",
    name: "Personal Finance Dashboard",
    type: "note",
    parentId: "folder-2",
    content:
      "Finance tracking features:\n\n- Expense categorization\n- Budget planning\n- Investment tracking\n- Bill reminders\n- Reports and analytics\n- Bank integration (Plaid)\n\nFocus on privacy and security!",
    createdAt: new Date("2024-10-10T11:00:00"),
    updatedAt: new Date("2024-10-10T11:00:00"),
    tags: ["finance", "dashboard"],
  },

  // Inside "Daily Reflections" folder
  {
    id: "note-8",
    name: "October 15 - Productive Day",
    type: "note",
    parentId: "folder-3",
    content:
      "Today's wins:\n\n✓ Completed 3 LeetCode problems\n✓ Finished React course module\n✓ Code review for team\n✓ 1 hour of reading\n\nTomorrow's goals:\n- Start new side project\n- System design practice\n- Team meeting prep",
    createdAt: new Date("2024-10-15T21:00:00"),
    updatedAt: new Date("2024-10-15T21:00:00"),
    color: "accent",
  },
  {
    id: "note-9",
    name: "October 12 - Learning Reflection",
    type: "note",
    parentId: "folder-3",
    content:
      "What I learned this week:\n\n- Advanced TypeScript patterns\n- System design principles\n- Better git workflow\n- Time management techniques\n\nAreas to improve:\n- Testing practices\n- Documentation writing",
    createdAt: new Date("2024-10-12T20:00:00"),
    updatedAt: new Date("2024-10-12T20:00:00"),
  },
  {
    id: "note-10",
    name: "October 8 - Goals Review",
    type: "note",
    parentId: "folder-3",
    content:
      "Monthly goals progress:\n\n✓ Complete online course (Done!)\n✓ Build side project (In progress)\n○ Contribute to open source\n○ Write 2 blog posts\n\nAdjustments needed for next month.",
    createdAt: new Date("2024-10-08T19:00:00"),
    updatedAt: new Date("2024-10-08T19:00:00"),
  },
  {
    id: "note-11",
    name: "October 6 - Gratitude",
    type: "note",
    parentId: "folder-3",
    content:
      "Things I'm grateful for:\n\n- Supportive team at work\n- Learning opportunities\n- Good health\n- Family support\n- Progress in career\n\nRemember to appreciate the journey!",
    createdAt: new Date("2024-10-06T21:00:00"),
    updatedAt: new Date("2024-10-06T21:00:00"),
    color: "primary",
  },

  // Inside "Code Snippets" folder
  {
    id: "note-12",
    name: "Git Commands",
    type: "note",
    parentId: "folder-4",
    content:
      "Useful Git commands:\n\ngit stash - save changes temporarily\ngit cherry-pick <commit> - apply specific commit\ngit rebase -i - interactive rebase\ngit bisect - find bug introduction\ngit reflog - recover lost commits\ngit reset --soft HEAD~1 - undo last commit\n\nNever force push to main!",
    createdAt: new Date("2024-10-11T10:00:00"),
    updatedAt: new Date("2024-10-11T15:00:00"),
    tags: ["git", "commands"],
  },
  {
    id: "note-13",
    name: "React Custom Hooks",
    type: "note",
    parentId: "folder-4",
    content:
      "// useLocalStorage hook\nfunction useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const item = localStorage.getItem(key);\n    return item ? JSON.parse(item) : initialValue;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}",
    createdAt: new Date("2024-10-09T14:00:00"),
    updatedAt: new Date("2024-10-09T14:00:00"),
    color: "primary",
    tags: ["react", "hooks"],
  },
  {
    id: "note-14",
    name: "CSS Animations",
    type: "note",
    parentId: "folder-4",
    content:
      "Smooth CSS transitions:\n\n.element {\n  transition: all 0.3s ease;\n}\n\n.element:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n}\n\nUse transform for better performance!",
    createdAt: new Date("2024-10-08T11:00:00"),
    updatedAt: new Date("2024-10-08T11:00:00"),
    color: "secondary",
    tags: ["css", "animation"],
  },
  {
    id: "folder-4-1",
    name: "JavaScript Utils",
    type: "folder",
    parentId: "folder-4",
    itemCount: 3,
    createdAt: new Date("2024-10-07T09:00:00"),
    updatedAt: new Date("2024-10-10T16:00:00"),
  },

  // Inside "Code Snippets > JavaScript Utils" folder
  {
    id: "note-4-1-1",
    name: "Debounce Function",
    type: "note",
    parentId: "folder-4-1",
    content:
      "function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}\n\n// Usage\nconst debouncedSearch = debounce(search, 300);",
    createdAt: new Date("2024-10-10T16:00:00"),
    updatedAt: new Date("2024-10-10T16:00:00"),
    tags: ["javascript", "utility"],
  },
  {
    id: "note-4-1-2",
    name: "Deep Clone Object",
    type: "note",
    parentId: "folder-4-1",
    content:
      "function deepClone(obj) {\n  if (obj === null || typeof obj !== 'object') {\n    return obj;\n  }\n  \n  if (Array.isArray(obj)) {\n    return obj.map(item => deepClone(item));\n  }\n  \n  const cloned = {};\n  for (let key in obj) {\n    cloned[key] = deepClone(obj[key]);\n  }\n  return cloned;\n}",
    createdAt: new Date("2024-10-09T10:00:00"),
    updatedAt: new Date("2024-10-09T10:00:00"),
    tags: ["javascript", "utility"],
  },
  {
    id: "note-4-1-3",
    name: "Format Date",
    type: "note",
    parentId: "folder-4-1",
    content:
      "function formatDate(date, format = 'YYYY-MM-DD') {\n  const d = new Date(date);\n  const year = d.getFullYear();\n  const month = String(d.getMonth() + 1).padStart(2, '0');\n  const day = String(d.getDate()).padStart(2, '0');\n  \n  return format\n    .replace('YYYY', year)\n    .replace('MM', month)\n    .replace('DD', day);\n}",
    createdAt: new Date("2024-10-07T09:00:00"),
    updatedAt: new Date("2024-10-07T09:00:00"),
    tags: ["javascript", "date"],
  },
];
