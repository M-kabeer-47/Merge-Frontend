import type {
  InstructorAssignment,
  StudentAssignment,
} from "@/types/assignment";

// Mock data for INSTRUCTOR view
export const sampleInstructorAssignments: InstructorAssignment[] = [
  {
    id: "assign-1",
    title: "React Fundamentals - Components & Props",
    description:
      "Create a simple React application demonstrating the use of functional components, props, and state management. Include at least 3 components with proper prop passing.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-01T09:00:00"),
    dueDate: new Date("2024-10-20T23:59:00"),
    points: 100,
    status: "published",
    submissionStats: {
      submitted: 18,
      total: 24,
      graded: 12,
      pending: 6,
    },
    attachments: [
      {
        id: "att-1",
        name: "Assignment_1_Instructions.pdf",
        type: "file",
        url: "/files/assignment1.pdf",
        size: 245000,
      },
      {
        id: "att-2",
        name: "Starter_Code.zip",
        type: "file",
        url: "/files/starter.zip",
        size: 15000,
      },
    ],
  },
  {
    id: "assign-2",
    title: "Midterm Project - Full Stack Application",
    description:
      "Build a full-stack web application using React, Node.js, and MongoDB. The application should include user authentication, CRUD operations, and responsive design. Detailed requirements are in the attached document.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-05T14:30:00"),
    dueDate: new Date("2024-11-15T23:59:00"),
    points: 250,
    status: "published",
    submissionStats: {
      submitted: 3,
      total: 24,
      graded: 0,
      pending: 3,
    },
    attachments: [
      {
        id: "att-3",
        name: "Project_Requirements.pdf",
        type: "file",
        url: "/files/project-requirements.pdf",
        size: 380000,
      },
      {
        id: "att-4",
        name: "Design Mockups",
        type: "link",
        url: "https://figma.com/mockups",
      },
    ],
  },
  {
    id: "assign-3",
    title: "CSS Grid & Flexbox Layout Challenge",
    description:
      "Recreate the provided design using CSS Grid and Flexbox. Your solution should be fully responsive and match the design specifications pixel-perfect.",
    author: {
      id: "user-3",
      name: "Michael Park",
      role: "ta",
      initials: "MP",
    },
    createdAt: new Date("2024-09-25T10:00:00"),
    dueDate: new Date("2024-10-08T23:59:00"),
    points: 75,
    status: "closed",
    submissionStats: {
      submitted: 24,
      total: 24,
      graded: 24,
      pending: 0,
    },
    attachments: [
      {
        id: "att-5",
        name: "Design_Reference.png",
        type: "file",
        url: "/files/design.png",
        size: 125000,
      },
    ],
  },
  {
    id: "assign-4",
    title: "JavaScript ES6+ Features Quiz",
    description:
      "Complete the online quiz covering ES6+ features including arrow functions, destructuring, spread operator, promises, and async/await. You have 60 minutes once started.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-10T09:00:00"),
    dueDate: new Date("2024-10-25T23:59:00"),
    points: 50,
    status: "published",
    submissionStats: {
      submitted: 8,
      total: 24,
      graded: 8,
      pending: 0,
    },
  },
  {
    id: "assign-5",
    title: "REST API Design & Implementation",
    description:
      "Design and implement a RESTful API for a blog application. Include endpoints for posts, comments, and users. Implement proper HTTP methods, status codes, and error handling.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-12T11:00:00"),
    dueDate: new Date("2024-11-01T23:59:00"),
    points: 150,
    status: "published",
    submissionStats: {
      submitted: 5,
      total: 24,
      graded: 2,
      pending: 3,
    },
    attachments: [
      {
        id: "att-6",
        name: "API_Requirements.pdf",
        type: "file",
        url: "/files/api-requirements.pdf",
        size: 210000,
      },
      {
        id: "att-7",
        name: "Postman Collection",
        type: "link",
        url: "https://postman.com/collection",
      },
    ],
  },
  {
    id: "assign-6",
    title: "Database Schema Design Exercise",
    description:
      "Design a normalized database schema for an e-commerce platform. Include tables for users, products, orders, and reviews. Create an ER diagram and write SQL CREATE statements.",
    author: {
      id: "user-3",
      name: "Michael Park",
      role: "ta",
      initials: "MP",
    },
    createdAt: new Date("2024-10-08T15:30:00"),
    dueDate: new Date("2024-10-30T23:59:00"),
    points: 100,
    status: "published",
    submissionStats: {
      submitted: 10,
      total: 24,
      graded: 4,
      pending: 6,
    },
  },
];

// Mock data for STUDENT view
export const sampleStudentAssignments: StudentAssignment[] = [
  {
    id: "assign-1",
    title: "React Fundamentals - Components & Props",
    description:
      "Create a simple React application demonstrating the use of functional components, props, and state management. Include at least 3 components with proper prop passing.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-01T09:00:00"),
    dueDate: new Date("2024-10-20T23:59:00"),
    points: 100,
    status: "published",
    submission: {
      id: "sub-1",
      submittedAt: new Date("2024-10-18T14:30:00"),
      status: "pending",

      attachments: [
        {
          id: "sub-att-1",
          name: "my-react-app.zip",
          type: "file",
          url: "/submissions/react-app.zip",
          size: 450000,
        },
      ],
    },
    attachments: [
      {
        id: "att-1",
        name: "Assignment_1_Instructions.pdf",
        type: "file",
        url: "/files/assignment1.pdf",
        size: 245000,
      },
      {
        id: "att-2",
        name: "Starter_Code.zip",
        type: "file",
        url: "/files/starter.zip",
        size: 15000,
      },
    ],
  },
  {
    id: "assign-2",
    title: "Midterm Project - Full Stack Application",
    description:
      "Build a full-stack web application using React, Node.js, and MongoDB. The application should include user authentication, CRUD operations, and responsive design. Detailed requirements are in the attached document.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-05T14:30:00"),
    dueDate: new Date("2024-11-15T23:59:00"),
    points: 250,
    status: "published",
    submission: {
      id: "sub-2",
      status: "pending",
    },
    attachments: [
      {
        id: "att-3",
        name: "Project_Requirements.pdf",
        type: "file",
        url: "/files/project-requirements.pdf",
        size: 380000,
      },
      {
        id: "att-4",
        name: "Design Mockups",
        type: "link",
        url: "https://figma.com/mockups",
      },
    ],
  },
  {
    id: "assign-3",
    title: "CSS Grid & Flexbox Layout Challenge",
    description:
      "Recreate the provided design using CSS Grid and Flexbox. Your solution should be fully responsive and match the design specifications pixel-perfect.",
    author: {
      id: "user-3",
      name: "Michael Park",
      role: "ta",
      initials: "MP",
    },
    createdAt: new Date("2024-09-25T10:00:00"),
    dueDate: new Date("2024-10-08T23:59:00"),
    points: 75,
    status: "closed",
    submission: {
      id: "sub-3",
      submittedAt: new Date("2024-10-07T20:15:00"),
      status: "graded",
      grade: 72,
      feedback:
        "Good effort! Your layout is mostly correct but there are some spacing issues on mobile devices. Review the responsive design guidelines.",
      attachments: [
        {
          id: "sub-att-2",
          name: "layout-challenge.html",
          type: "file",
          url: "/submissions/layout.html",
          size: 12000,
        },
        {
          id: "sub-att-3",
          name: "styles.css",
          type: "file",
          url: "/submissions/styles.css",
          size: 8000,
        },
      ],
    },
    attachments: [
      {
        id: "att-5",
        name: "Design_Reference.png",
        type: "file",
        url: "/files/design.png",
        size: 125000,
      },
    ],
  },
  {
    id: "assign-4",
    title: "JavaScript ES6+ Features Quiz",
    description:
      "Complete the online quiz covering ES6+ features including arrow functions, destructuring, spread operator, promises, and async/await. You have 60 minutes once started.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-10T09:00:00"),
    dueDate: new Date("2024-10-25T23:59:00"),
    points: 50,
    status: "published",
    submission: {
      id: "sub-4",
      submittedAt: new Date("2024-10-11T16:45:00"),
      status: "graded",
      grade: 48,
      feedback:
        "Great job! You demonstrated a solid understanding of ES6+ features.",
    },
  },
  {
    id: "assign-5",
    title: "REST API Design & Implementation",
    description:
      "Design and implement a RESTful API for a blog application. Include endpoints for posts, comments, and users. Implement proper HTTP methods, status codes, and error handling.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-12T11:00:00"),
    dueDate: new Date("2024-11-01T23:59:00"),
    points: 150,
    status: "published",
    submission: {
      id: "sub-5",
      submittedAt: new Date("2024-10-28T22:30:00"),
      status: "submitted",
      attachments: [
        {
          id: "sub-att-4",
          name: "blog-api.zip",
          type: "file",
          url: "/submissions/blog-api.zip",
          size: 850000,
        },
        {
          id: "sub-att-5",
          name: "README.md",
          type: "file",
          url: "/submissions/readme.md",
          size: 5000,
        },
      ],
    },
    attachments: [
      {
        id: "att-6",
        name: "API_Requirements.pdf",
        type: "file",
        url: "/files/api-requirements.pdf",
        size: 210000,
      },
      {
        id: "att-7",
        name: "Postman Collection",
        type: "link",
        url: "https://postman.com/collection",
      },
    ],
  },
  {
    id: "assign-6",
    title: "Database Schema Design Exercise",
    description:
      "Design a normalized database schema for an e-commerce platform. Include tables for users, products, orders, and reviews. Create an ER diagram and write SQL CREATE statements.",
    author: {
      id: "user-3",
      name: "Michael Park",
      role: "ta",
      initials: "MP",
    },
    createdAt: new Date("2024-10-08T15:30:00"),
    dueDate: new Date("2024-10-30T23:59:00"),
    points: 100,
    status: "published",
    submission: {
      id: "sub-6",
      status: "overdue",
    },
  },
  {
    id: "assign-7",
    title: "TypeScript Advanced Types Workshop",
    description:
      "Complete exercises demonstrating advanced TypeScript features including generics, utility types, conditional types, and mapped types. Submit your solutions with proper type annotations.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-13T10:00:00"),
    dueDate: new Date("2024-11-05T23:59:00"),
    points: 80,
    status: "published",
    submission: {
      id: "sub-7",
      status: "pending",
    },
    attachments: [
      {
        id: "att-8",
        name: "TypeScript_Exercises.pdf",
        type: "file",
        url: "/files/typescript-exercises.pdf",
        size: 175000,
      },
    ],
  },
  {
    id: "assign-8",
    title: "React Hooks Deep Dive",
    description:
      "Build a custom React hooks library including useDebounce, useLocalStorage, and useAsync. Write comprehensive tests for each hook and document their usage.",
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      role: "instructor",
      initials: "SJ",
    },
    createdAt: new Date("2024-10-14T14:00:00"),
    dueDate: new Date("2024-11-10T23:59:00"),
    points: 120,
    status: "published",
    submission: {
      id: "sub-8",
      status: "pending",
    },
    attachments: [
      {
        id: "att-9",
        name: "Hooks_Requirements.pdf",
        type: "file",
        url: "/files/hooks-requirements.pdf",
        size: 195000,
      },
    ],
  },
  {
    id: "assign-9",
    title: "Web Performance Optimization",
    description:
      "Analyze and optimize the provided web application for performance. Use Lighthouse to measure improvements and implement lazy loading, code splitting, and caching strategies.",
    author: {
      id: "user-3",
      name: "Michael Park",
      role: "ta",
      initials: "MP",
    },
    createdAt: new Date("2024-10-15T09:30:00"),
    dueDate: new Date("2024-11-12T23:59:00"),
    points: 90,
    status: "published",
    submission: {
      id: "sub-9",
      status: "pending",
    },
  },
];
