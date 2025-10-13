import type { PublicRoom } from "@/types/discover";

export const mockRooms: PublicRoom[] = [
  {
    id: "r1",
    title: "Introduction to Data Structures",
    creator: {
      id: "u1",
      name: "Dr. Aisha Khan",
      avatar: "/avatars/aisha.png",
    },
    description:
      "Short practical course covering arrays, lists, trees, and graphs. Perfect for beginners looking to strengthen their foundation in computer science fundamentals.",
    tags: ["Data Structures", "CS", "Algorithms"],
    membersCount: 124,
    activeNow: true,
    thumbnail: "/rooms/ds-thumb.png",
    files: [
      { id: "f1", name: "Week1_Slides.pdf", type: "pdf", size: "2.4MB" },
      { id: "f2", name: "CheatSheet.png", type: "image", size: "450KB" },
      { id: "f3", name: "TreeAlgorithms.pdf", type: "pdf", size: "1.8MB" },
    ],
    assignments: [
      { id: "a1", title: "Implement LinkedList", dueDate: "2025-10-20" },
      { id: "a2", title: "Binary Tree Quiz", dueDate: "2025-10-25" },
    ],
    membersPreview: [
      { id: "m1", name: "Khan Ahmed", avatar: "/avatars/k1.png" },
      { id: "m2", name: "Sara Ali", avatar: "/avatars/k2.png" },
      { id: "m3", name: "John Doe", avatar: "/avatars/k3.png" },
      { id: "m4", name: "Jane Smith", avatar: "/avatars/k4.png" },
    ],
    lastActiveAt: "2025-10-12T10:00:00Z",
  },
  {
    id: "r2",
    title: "Advanced React Patterns",
    creator: {
      id: "u2",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.png",
    },
    description:
      "Master modern React patterns including hooks, context, and state management. Learn best practices for building scalable applications.",
    tags: ["React", "JavaScript", "Web Development"],
    membersCount: 89,
    activeNow: true,
    thumbnail: "/rooms/react-thumb.png",
    files: [
      { id: "f4", name: "CustomHooks.pdf", type: "pdf", size: "1.2MB" },
      { id: "f5", name: "ContextAPI.mp4", type: "video", size: "45MB" },
    ],
    assignments: [
      {
        id: "a3",
        title: "Build Custom Hook Library",
        dueDate: "2025-10-22",
      },
      { id: "a4", title: "Context API Project", dueDate: "2025-10-28" },
      { id: "a5", title: "Performance Optimization", dueDate: "2025-11-05" },
    ],
    membersPreview: [
      { id: "m5", name: "Mike Chen", avatar: "/avatars/m1.png" },
      { id: "m6", name: "Emily Davis", avatar: "/avatars/m2.png" },
      { id: "m7", name: "Alex Turner", avatar: "/avatars/m3.png" },
       { id: "m8", name: "Mike Chen", avatar: "/avatars/m1.png" },
      { id: "m9", name: "Emily Davis", avatar: "/avatars/m2.png" },
      { id: "m10", name: "Alex Turner", avatar: "/avatars/m3.png" },
    ],
    lastActiveAt: "2025-10-13T08:30:00Z",
  },
  {
    id: "r3",
    title: "Machine Learning Fundamentals",
    creator: {
      id: "u3",
      name: "Prof. Michael Chen",
      avatar: "/avatars/michael.png",
    },
    description:
      "Comprehensive introduction to ML algorithms, from linear regression to neural networks.",
    tags: ["Machine Learning", "Python", "AI"],
    membersCount: 215,
    activeNow: false,
    thumbnail: "/rooms/ml-thumb.png",
    files: [
      { id: "f6", name: "Week1_Regression.pdf", type: "pdf", size: "3.1MB" },
      { id: "f7", name: "NeuralNets.pdf", type: "pdf", size: "2.8MB" },
      { id: "f8", name: "Dataset.csv", type: "other", size: "12MB" },
    ],
    assignments: [
      { id: "a6", title: "Linear Regression Model", dueDate: "2025-10-18" },
    ],
    membersPreview: [
      { id: "m8", name: "Lisa Wang", avatar: "/avatars/l1.png" },
      { id: "m9", name: "David Kim", avatar: "/avatars/l2.png" },
      { id: "m10", name: "Anna Brown", avatar: "/avatars/l3.png" },
      { id: "m11", name: "Tom Wilson", avatar: "/avatars/l4.png" },
      { id: "m12", name: "Maria Garcia", avatar: "/avatars/l5.png" },
    ],
    lastActiveAt: "2025-10-11T14:20:00Z",
  },
  {
    id: "r4",
    title: "UI/UX Design Principles",
    creator: {
      id: "u4",
      name: "Emma Wilson",
      avatar: "/avatars/emma.png",
    },
    description:
      "Learn the fundamentals of user interface and user experience design. Create beautiful, functional interfaces.",
    tags: ["Design", "UI/UX", "Figma"],
    membersCount: 156,
    activeNow: true,
    thumbnail: "/rooms/ux-thumb.png",
    files: [
      { id: "f9", name: "DesignPrinciples.pdf", type: "pdf", size: "5.2MB" },
      { id: "f10", name: "ColorTheory.png", type: "image", size: "890KB" },
    ],
    assignments: [
      { id: "a7", title: "Wireframe Assignment", dueDate: "2025-10-24" },
      { id: "a8", title: "User Research Project", dueDate: "2025-11-01" },
    ],
    membersPreview: [
      { id: "m13", name: "Rachel Green", avatar: "/avatars/r1.png" },
      { id: "m14", name: "Ross Geller", avatar: "/avatars/r2.png" },
    ],
    lastActiveAt: "2025-10-13T09:15:00Z",
  },
  {
    id: "r5",
    title: "Database Systems & SQL",
    creator: {
      id: "u5",
      name: "Dr. James Wilson",
      avatar: "/avatars/james.png",
    },
    description:
      "Complete guide to relational databases, SQL queries, normalization, and database design patterns.",
    tags: ["Database", "SQL", "Backend"],
    membersCount: 98,
    activeNow: false,
    thumbnail: "/rooms/db-thumb.png",
    files: [
      { id: "f11", name: "SQLBasics.pdf", type: "pdf", size: "1.5MB" },
      {
        id: "f12",
        name: "Normalization.pdf",
        type: "pdf",
        size: "980KB",
      },
      { id: "f13", name: "Practice_Queries.sql", type: "other", size: "45KB" },
    ],
    assignments: [
      { id: "a9", title: "Database Design Project", dueDate: "2025-10-30" },
      { id: "a10", title: "Complex Queries Quiz", dueDate: "2025-11-08" },
    ],
    membersPreview: [
      { id: "m15", name: "Chris Evans", avatar: "/avatars/c1.png" },
      { id: "m16", name: "Scarlett Johansson", avatar: "/avatars/c2.png" },
      { id: "m17", name: "Robert Downey", avatar: "/avatars/c3.png" },
    ],
    lastActiveAt: "2025-10-10T16:45:00Z",
  },
  {
    id: "r6",
    title: "Python for Beginners",
    creator: {
      id: "u6",
      name: "Linda Martinez",
      avatar: "/avatars/linda.png",
    },
    description:
      "Start your programming journey with Python. No prior experience needed.",
    tags: ["Python", "Programming", "Beginner"],
    membersCount: 342,
    activeNow: true,
    thumbnail: "/rooms/python-thumb.png",
    files: [
      { id: "f14", name: "PythonBasics.pdf", type: "pdf", size: "2.1MB" },
    ],
    assignments: [
      { id: "a11", title: "Variables & Data Types", dueDate: "2025-10-16" },
      { id: "a12", title: "Functions Practice", dueDate: "2025-10-21" },
    ],
    membersPreview: [
      { id: "m18", name: "Peter Parker", avatar: "/avatars/p1.png" },
      { id: "m19", name: "Mary Jane", avatar: "/avatars/p2.png" },
      { id: "m20", name: "Ned Leeds", avatar: "/avatars/p3.png" },
      { id: "m21", name: "MJ Watson", avatar: "/avatars/p4.png" },
      { id: "m22", name: "Harry Osborn", avatar: "/avatars/p5.png" },
      { id: "m23", name: "Gwen Stacy", avatar: "/avatars/p6.png" },
    ],
    lastActiveAt: "2025-10-13T11:00:00Z",
  },
];

export const allTags = [
  "Data Structures",
  "CS",
  "Algorithms",
  "React",
  "JavaScript",
  "Web Development",
  "Machine Learning",
  "Python",
  "AI",
  "Design",
  "UI/UX",
  "Figma",
  "Database",
  "SQL",
  "Backend",
  "Programming",
  "Beginner",
];
