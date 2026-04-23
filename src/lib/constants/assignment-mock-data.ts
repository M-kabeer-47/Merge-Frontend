import type {
  InstructorAssignment,
  StudentAssignment,
} from "@/types/assignment";

const mockAuthor = {
  id: "user-1",
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah@example.com",
  image: null,
};

const mockAuthor2 = {
  id: "user-3",
  firstName: "Michael",
  lastName: "Park",
  email: "michael@example.com",
  image: null,
};

const baseFields = {
  isTurnInLateEnabled: false,
  isClosed: false,
  assignmentFiles: [] as { name: string; url: string }[],
  room: null,
  startAt: null,
};

// Mock data for INSTRUCTOR view
export const sampleInstructorAssignments: InstructorAssignment[] = [
  {
    ...baseFields,
    id: "assign-1",
    title: "React Fundamentals - Components & Props",
    description:
      "Create a simple React application demonstrating the use of functional components, props, and state management.",
    author: mockAuthor,
    createdAt: new Date("2024-10-01T09:00:00"),
    endAt: new Date("2024-10-20T23:59:00"),
    totalScore: 100,
    status: "needs_grading",
    totalAttempts: 18,
    gradedAttempts: 12,
    ungradedAttempts: 6,
  },
  {
    ...baseFields,
    id: "assign-2",
    title: "Midterm Project - Full Stack Application",
    description:
      "Build a full-stack web application using React, Node.js, and MongoDB.",
    author: mockAuthor,
    createdAt: new Date("2024-10-05T14:30:00"),
    endAt: new Date("2024-11-15T23:59:00"),
    totalScore: 250,
    status: "needs_grading",
    totalAttempts: 3,
    gradedAttempts: 0,
    ungradedAttempts: 3,
  },
  {
    ...baseFields,
    id: "assign-3",
    title: "CSS Grid & Flexbox Layout Challenge",
    description:
      "Recreate the provided design using CSS Grid and Flexbox.",
    author: mockAuthor2,
    createdAt: new Date("2024-09-25T10:00:00"),
    endAt: new Date("2024-10-08T23:59:00"),
    totalScore: 75,
    isClosed: true,
    status: "closed",
    totalAttempts: 24,
    gradedAttempts: 24,
    ungradedAttempts: 0,
  },
  {
    ...baseFields,
    id: "assign-4",
    title: "JavaScript ES6+ Features Quiz",
    description:
      "Complete the online quiz covering ES6+ features.",
    author: mockAuthor,
    createdAt: new Date("2024-10-10T09:00:00"),
    endAt: new Date("2024-10-25T23:59:00"),
    totalScore: 50,
    status: "graded",
    totalAttempts: 8,
    gradedAttempts: 8,
    ungradedAttempts: 0,
  },
  {
    ...baseFields,
    id: "assign-5",
    title: "REST API Design & Implementation",
    description:
      "Design and implement a RESTful API for a blog application.",
    author: mockAuthor,
    createdAt: new Date("2024-10-12T11:00:00"),
    endAt: new Date("2024-11-01T23:59:00"),
    totalScore: 150,
    status: "needs_grading",
    totalAttempts: 5,
    gradedAttempts: 2,
    ungradedAttempts: 3,
  },
  {
    ...baseFields,
    id: "assign-6",
    title: "Database Schema Design Exercise",
    description:
      "Design a normalized database schema for an e-commerce platform.",
    author: mockAuthor2,
    createdAt: new Date("2024-10-08T15:30:00"),
    endAt: new Date("2024-10-30T23:59:00"),
    totalScore: 100,
    status: "needs_grading",
    totalAttempts: 10,
    gradedAttempts: 4,
    ungradedAttempts: 6,
  },
];

// Mock data for STUDENT view
export const sampleStudentAssignments: StudentAssignment[] = [
  {
    ...baseFields,
    id: "assign-1",
    title: "React Fundamentals - Components & Props",
    description:
      "Create a simple React application demonstrating the use of functional components, props, and state management.",
    author: mockAuthor,
    createdAt: new Date("2024-10-01T09:00:00"),
    endAt: new Date("2024-10-20T23:59:00"),
    totalScore: 100,
    submissionStatus: "submitted",
    submittedAt: new Date("2024-10-18T14:30:00"),
  },
  {
    ...baseFields,
    id: "assign-2",
    title: "Midterm Project - Full Stack Application",
    description:
      "Build a full-stack web application using React, Node.js, and MongoDB.",
    author: mockAuthor,
    createdAt: new Date("2024-10-05T14:30:00"),
    endAt: new Date("2024-11-15T23:59:00"),
    totalScore: 250,
    submissionStatus: "pending",
  },
  {
    ...baseFields,
    id: "assign-3",
    title: "CSS Grid & Flexbox Layout Challenge",
    description:
      "Recreate the provided design using CSS Grid and Flexbox.",
    author: mockAuthor2,
    createdAt: new Date("2024-09-25T10:00:00"),
    endAt: new Date("2024-10-08T23:59:00"),
    totalScore: 75,
    isClosed: true,
    submissionStatus: "graded",
    submittedAt: new Date("2024-10-07T20:15:00"),
    score: 72,
    attempt: {
      id: "attempt-3",
      submitAt: new Date("2024-10-07T20:15:00"),
      score: 72,
      files: [
        { name: "layout-challenge.html", url: "/submissions/layout.html" },
        { name: "styles.css", url: "/submissions/styles.css" },
      ],
      note: "Good effort! Your layout is mostly correct but there are some spacing issues on mobile devices.",
    },
  },
  {
    ...baseFields,
    id: "assign-4",
    title: "JavaScript ES6+ Features Quiz",
    description:
      "Complete the online quiz covering ES6+ features.",
    author: mockAuthor,
    createdAt: new Date("2024-10-10T09:00:00"),
    endAt: new Date("2024-10-25T23:59:00"),
    totalScore: 50,
    submissionStatus: "graded",
    submittedAt: new Date("2024-10-11T16:45:00"),
    score: 48,
    attempt: {
      id: "attempt-4",
      submitAt: new Date("2024-10-11T16:45:00"),
      score: 48,
      files: [],
      note: "Great job! You demonstrated a solid understanding of ES6+ features.",
    },
  },
  {
    ...baseFields,
    id: "assign-5",
    title: "REST API Design & Implementation",
    description:
      "Design and implement a RESTful API for a blog application.",
    author: mockAuthor,
    createdAt: new Date("2024-10-12T11:00:00"),
    endAt: new Date("2024-11-01T23:59:00"),
    totalScore: 150,
    submissionStatus: "submitted",
    submittedAt: new Date("2024-10-28T22:30:00"),
    attempt: {
      id: "attempt-5",
      submitAt: new Date("2024-10-28T22:30:00"),
      score: null,
      files: [
        { name: "blog-api.zip", url: "/submissions/blog-api.zip" },
        { name: "README.md", url: "/submissions/readme.md" },
      ],
    },
  },
  {
    ...baseFields,
    id: "assign-6",
    title: "Database Schema Design Exercise",
    description:
      "Design a normalized database schema for an e-commerce platform.",
    author: mockAuthor2,
    createdAt: new Date("2024-10-08T15:30:00"),
    endAt: new Date("2024-10-30T23:59:00"),
    totalScore: 100,
    submissionStatus: "missed",
  },
  {
    ...baseFields,
    id: "assign-7",
    title: "TypeScript Advanced Types Workshop",
    description:
      "Complete exercises demonstrating advanced TypeScript features.",
    author: mockAuthor,
    createdAt: new Date("2024-10-13T10:00:00"),
    endAt: new Date("2024-11-05T23:59:00"),
    totalScore: 80,
    submissionStatus: "pending",
  },
  {
    ...baseFields,
    id: "assign-8",
    title: "React Hooks Deep Dive",
    description:
      "Build a custom React hooks library including useDebounce, useLocalStorage, and useAsync.",
    author: mockAuthor,
    createdAt: new Date("2024-10-14T14:00:00"),
    endAt: new Date("2024-11-10T23:59:00"),
    totalScore: 120,
    submissionStatus: "pending",
  },
  {
    ...baseFields,
    id: "assign-9",
    title: "Web Performance Optimization",
    description:
      "Analyze and optimize the provided web application for performance.",
    author: mockAuthor2,
    createdAt: new Date("2024-10-15T09:30:00"),
    endAt: new Date("2024-11-12T23:59:00"),
    totalScore: 90,
    submissionStatus: "pending",
  },
];
