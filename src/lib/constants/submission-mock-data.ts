import type { StudentSubmissionDetail } from "@/types/submission";

// Mock student submissions for assignment details
export const sampleSubmissions: StudentSubmissionDetail[] = [
  {
    id: "sub-1",
    student: {
      id: "student-1",
      name: "Emma Watson",
      email: "emma.watson@university.edu",
      initials: "EW",
    },
    assignmentId: "assign-1",
    submittedAt: new Date("2024-10-18T14:30:00"),
    status: "graded",
    grade: 95,
    feedback:
      "Excellent work! Your components are well-structured and props are used effectively. Minor improvement needed in error handling.",
    files: [
      {
        id: "file-1",
        name: "react-components.zip",
        type: "application/zip",
        url: "/submissions/emma-react.zip",
        size: 450000,
        uploadedAt: new Date("2024-10-18T14:30:00"),
      },
    ],
    isLate: false,
  },
  {
    id: "sub-2",
    student: {
      id: "student-2",
      name: "John Smith",
      email: "john.smith@university.edu",
      initials: "JS",
    },
    assignmentId: "assign-1",
    submittedAt: new Date("2024-10-19T22:45:00"),
    status: "graded",
    grade: 88,
    feedback:
      "Good job! The code is clean but consider adding more comments for complex logic.",
    files: [
      {
        id: "file-2",
        name: "assignment1-john.zip",
        type: "application/zip",
        url: "/submissions/john-react.zip",
        size: 380000,
        uploadedAt: new Date("2024-10-19T22:45:00"),
      },
    ],
    isLate: false,
  },
  {
    id: "sub-3",
    student: {
      id: "student-3",
      name: "Sarah Johnson",
      email: "sarah.j@university.edu",
      initials: "SJ",
    },
    assignmentId: "assign-1",
    submittedAt: new Date("2024-10-17T10:15:00"),
    status: "graded",
    grade: 92,
    feedback:
      "Great implementation! Your prop types are well-defined. Consider using TypeScript for better type safety.",
    files: [
      {
        id: "file-3",
        name: "react-assignment.zip",
        type: "application/zip",
        url: "/submissions/sarah-react.zip",
        size: 520000,
        uploadedAt: new Date("2024-10-17T10:15:00"),
      },
      {
        id: "file-4",
        name: "README.md",
        type: "text/markdown",
        url: "/submissions/sarah-readme.md",
        size: 3500,
        uploadedAt: new Date("2024-10-17T10:15:00"),
      },
    ],
    isLate: false,
  },
  {
    id: "sub-4",
    student: {
      id: "student-4",
      name: "Michael Chen",
      email: "michael.chen@university.edu",
      initials: "MC",
    },
    assignmentId: "assign-1",
    submittedAt: new Date("2024-10-20T16:20:00"),
    status: "submitted",
    files: [
      {
        id: "file-5",
        name: "components-project.zip",
        type: "application/zip",
        url: "/submissions/michael-react.zip",
        size: 410000,
        uploadedAt: new Date("2024-10-20T16:20:00"),
      },
    ],
    isLate: false,
  },
  {
    id: "sub-5",
    student: {
      id: "student-5",
      name: "Lisa Anderson",
      email: "lisa.a@university.edu",
      initials: "LA",
    },
    assignmentId: "assign-1",
    submittedAt: new Date("2024-10-21T08:30:00"),
    status: "submitted",
    files: [
      {
        id: "file-6",
        name: "assignment-1.zip",
        type: "application/zip",
        url: "/submissions/lisa-react.zip",
        size: 395000,
        uploadedAt: new Date("2024-10-21T08:30:00"),
      },
    ],
    isLate: true,
  },
  {
    id: "sub-6",
    student: {
      id: "student-6",
      name: "David Park",
      email: "david.park@university.edu",
      initials: "DP",
    },
    assignmentId: "assign-1",
    status: "pending",
    files: [],
    isLate: false,
  },
  {
    id: "sub-7",
    student: {
      id: "student-7",
      name: "Emily Brown",
      email: "emily.b@university.edu",
      initials: "EB",
    },
    assignmentId: "assign-1",
    submittedAt: new Date("2024-10-18T20:00:00"),
    status: "graded",
    grade: 78,
    feedback:
      "Your components work but need better organization. Review the single responsibility principle.",
    files: [
      {
        id: "file-7",
        name: "react-hw1.zip",
        type: "application/zip",
        url: "/submissions/emily-react.zip",
        size: 280000,
        uploadedAt: new Date("2024-10-18T20:00:00"),
      },
    ],
    isLate: false,
  },
  {
    id: "sub-8",
    student: {
      id: "student-8",
      name: "Alex Taylor",
      email: "alex.t@university.edu",
      initials: "AT",
    },
    assignmentId: "assign-1",
    status: "missing",
    files: [],
    isLate: true,
  },
];


