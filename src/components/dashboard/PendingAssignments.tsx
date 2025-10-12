"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import DashboardAssignmentCard from "@/components/dashboard/DashboardAssignmentCard";
import type { StudentAssignment } from "@/types/assignment";

export default function PendingAssignments() {
  const [assignments] = useState<StudentAssignment[]>([
    {
      id: "1",
      title: "React Components Assignment",
      description:
        "Build a set of reusable React components following best practices and design patterns. Include proper TypeScript typing and documentation.",
      author: {
        id: "instructor-1",
        name: "Dr. Sarah Johnson",
        role: "instructor",
        initials: "SJ",
      },
      createdAt: new Date("2024-09-01"),
      dueDate: new Date(Date.now() + 86400000), // Due tomorrow
      points: 75,
      status: "published",
      submission: {
        id: "sub-1",
        status: "pending",
      },
      attachments: [
        {
          id: "att-1",
          name: "assignment-guidelines.pdf",
          type: "file",
          url: "#",
          size: 524288,
        },
      ],
    },
    {
      id: "2",
      title: "ML Algorithms Implementation",
      description:
        "Implement three machine learning algorithms from scratch: Linear Regression, K-Means Clustering, and Decision Trees. Compare performance metrics.",
      author: {
        id: "instructor-2",
        name: "Prof. Michael Chen",
        role: "instructor",
        initials: "MC",
      },
      createdAt: new Date("2024-09-05"),
      dueDate: new Date(Date.now() + 259200000), // Due in 3 days
      points: 100,
      status: "published",
      submission: {
        id: "sub-2",
        status: "pending",
      },
      attachments: [
        {
          id: "att-2",
          name: "dataset.csv",
          type: "file",
          url: "#",
          size: 1048576,
        },
        {
          id: "att-3",
          name: "rubric.pdf",
          type: "file",
          url: "#",
          size: 262144,
        },
      ],
    },
    {
      id: "3",
      title: "Database Design Project",
      description:
        "Design and implement a normalized database schema for an e-commerce platform. Include ER diagrams and sample queries.",
      author: {
        id: "instructor-3",
        name: "Dr. Emily Parker",
        role: "instructor",
        initials: "EP",
      },
      createdAt: new Date("2024-08-20"),
      dueDate: new Date(Date.now() - 172800000), // Overdue by 2 days
      points: 50,
      status: "published",
      submission: {
        id: "sub-3",
        status: "overdue",
      },
    },
  ]);

  const roomMapping: Record<string, string> = {
    "1": "Advanced React",
    "2": "Machine Learning",
    "3": "Data Structures",
  };

  const handleAssignmentClick = (id: string) => {
    // TODO: Navigate to assignment details page
    console.log("View assignment details:", id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Pending Assignments
          </h2>
        </div>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {assignments.map((assignment) => (
          <DashboardAssignmentCard
            key={assignment.id}
            assignment={assignment}
            roomName={roomMapping[assignment.id] || "Unknown Room"}
            onClick={() => handleAssignmentClick(assignment.id)}
          />
        ))}
      </div>
    </div>
  );
}
