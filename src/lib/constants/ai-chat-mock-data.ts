import type { ChatMessage, ChatSession } from "@/types/ai-chat";

export const sampleChatSessions: ChatSession[] = [
  {
    id: "session-1",
    title: "React Hooks Explanation",
    preview: "Can you explain how useEffect works?",
    createdAt: new Date("2024-10-15T10:00:00"),
    updatedAt: new Date("2024-10-15T10:30:00"),
    isPinned: true,
    messageCount: 8,
  },
  {
    id: "session-2",
    title: "Database Design Help",
    preview: "Help me design a schema for...",
    createdAt: new Date("2024-10-14T14:20:00"),
    updatedAt: new Date("2024-10-14T15:00:00"),
    messageCount: 12,
  },
  {
    id: "session-3",
    title: "TypeScript Best Practices",
    preview: "What are the best practices for...",
    createdAt: new Date("2024-10-13T09:00:00"),
    updatedAt: new Date("2024-10-13T09:45:00"),
    isPinned: true,
    messageCount: 6,
  },
  {
    id: "session-4",
    title: "Code Review Assistance",
    preview: "Can you review this code snippet?",
    createdAt: new Date("2024-10-12T16:30:00"),
    updatedAt: new Date("2024-10-12T17:00:00"),
    messageCount: 10,
  },
  {
    id: "session-5",
    title: "API Integration Questions",
    preview: "How do I integrate REST APIs...",
    createdAt: new Date("2024-10-11T11:15:00"),
    updatedAt: new Date("2024-10-11T12:00:00"),
    messageCount: 15,
  },
];

export const sampleMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Hello! I'm your AI Assistant. I can help you with your studies, answer questions, and provide insights based on your course materials. Feel free to ask me anything or attach files from your rooms for context-aware assistance.",
    timestamp: new Date("2024-10-15T10:00:00"),
  },
  {
    id: "msg-2",
    role: "user",
    content:
      "Can you explain how React hooks work, specifically useEffect and useState?",
    timestamp: new Date("2024-10-15T10:01:00"),
  },
  {
    id: "msg-3",
    role: "assistant",
    content:
      "I'd be happy to explain React hooks!\n\n**useState** is a hook that lets you add state to functional components. It returns an array with two elements:\n1. The current state value\n2. A function to update it\n\n```javascript\nconst [count, setCount] = useState(0);\n```\n\n**useEffect** is a hook for side effects in functional components. It runs after every render by default, but you can control when it runs using the dependency array:\n\n```javascript\nuseEffect(() => {\n  // Side effect code here\n  document.title = `Count: ${count}`;\n  \n  // Optional cleanup function\n  return () => {\n    // Cleanup code\n  };\n}, [count]); // Only re-run if count changes\n```\n\nKey points:\n- Empty dependency array `[]` means the effect runs once on mount\n- No dependency array means it runs after every render\n- Including variables means it runs when those variables change\n\nWould you like me to elaborate on any specific aspect?",
    timestamp: new Date("2024-10-15T10:02:00"),
  },
];

