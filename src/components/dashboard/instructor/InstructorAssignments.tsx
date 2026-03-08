"use client";

import { ClipboardList } from "lucide-react";
import type { InstructorAssignment } from "@/types/assignment";
import InstructorAssignmentCard from "@/components/assignments/InstructorAssignmentCard";

export default function InstructorAssignments() {
  const assignments: InstructorAssignment[] = [
    {
      id: "1",
      title: "React Component Library",
      description:
        "Build a reusable component library with proper TypeScript types and documentation",
      author: {
        id: "instructor-1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@example.com",
        image: null,
      },
      createdAt: new Date(2025, 9, 1),
      startAt: null,
      endAt: new Date(2025, 9, 15, 23, 59),
      totalScore: 100,
      isTurnInLateEnabled: false,
      isClosed: false,
      assignmentFiles: [],
      room: null,
      status: "needs_grading",
      totalAttempts: 23,
      gradedAttempts: 15,
      ungradedAttempts: 8,
    },
    {
      id: "2",
      title: "Database Schema Design",
      description:
        "Design and implement a normalized database schema for an e-commerce platform",
      author: {
        id: "instructor-1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@example.com",
        image: null,
      },
      createdAt: new Date(2025, 9, 3),
      startAt: null,
      endAt: new Date(2025, 9, 18, 23, 59),
      totalScore: 80,
      isTurnInLateEnabled: false,
      isClosed: false,
      assignmentFiles: [],
      room: null,
      status: "needs_grading",
      totalAttempts: 18,
      gradedAttempts: 8,
      ungradedAttempts: 10,
    },
    {
      id: "3",
      title: "UI/UX Case Study",
      description:
        "Conduct a comprehensive UX analysis of a popular mobile application",
      author: {
        id: "instructor-1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah@example.com",
        image: null,
      },
      createdAt: new Date(2025, 9, 5),
      startAt: null,
      endAt: new Date(2025, 9, 23, 14, 0),
      totalScore: 120,
      isTurnInLateEnabled: false,
      isClosed: false,
      assignmentFiles: [],
      room: null,
      status: "graded",
      totalAttempts: 0,
      gradedAttempts: 0,
      ungradedAttempts: 0,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Active Assignments
          </h2>
        </div>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {assignments.map((assignment) => (
          <InstructorAssignmentCard
            key={assignment.id}
            assignment={assignment}
            onViewResponses={(id) => console.log("View responses:", id)}
            onEdit={(id) => console.log("Edit assignment:", id)}
            onDelete={(id) => console.log("Delete assignment:", id)}
          />
        ))}
      </div>
    </div>
  );
}
