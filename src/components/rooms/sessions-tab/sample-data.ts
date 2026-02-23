import type { Session } from "./types";

export const sampleSessions: Session[] = [
  {
    id: "1",
    title: "UI/UX Design Workshop",
    hostedBy: {
      name: "Dr. Sarah Johnson",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 15, 15, 0),
    duration: "1h 30m",
    attendees: {
      count: 24,
      confirmed: 18,
    },
    status: "upcoming",
  },
  {
    id: "2",
    title: "React State Management",
    hostedBy: {
      name: "Prof. Michael Chen",
      role: "Instructor",
    },
    dateTime: new Date(),
    duration: "2h",
    attendees: {
      count: 20,
      confirmed: 20,
    },
    status: "live",
  },
  {
    id: "3",
    title: "React Hooks Deep Dive",
    hostedBy: {
      name: "Dr. Sarah Johnson",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 10, 14, 0),
    duration: "1h 30m",
    attendees: {
      count: 18,
    },
    status: "completed",
    focusScore: 87,
    lectureSummary:
      "Covered useState, useEffect, useContext, and custom hooks. Discussed common pitfalls and best practices for React hooks. Students practiced building custom hooks for form handling and API calls.",
    recordingUrl: "/recordings/session-3",
    notesUrl: "/notes/session-3",
  },
  {
    id: "4",
    title: "Component Patterns Workshop",
    hostedBy: {
      name: "Dr. Sarah Johnson",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 8, 14, 0),
    duration: "2h",
    attendees: {
      count: 20,
    },
    status: "completed",
    focusScore: 92,
    recordingUrl: "/recordings/session-4",
    notesUrl: "/notes/session-4",
  },
  {
    id: "5",
    title: "Introduction to TypeScript",
    hostedBy: {
      name: "Prof. Michael Chen",
      role: "Instructor",
    },
    dateTime: new Date(2024, 9, 5, 10, 0),
    duration: "1h 45m",
    attendees: {
      count: 22,
    },
    status: "completed",
    focusScore: 78,
    recordingUrl: "/recordings/session-5",
  },
];
