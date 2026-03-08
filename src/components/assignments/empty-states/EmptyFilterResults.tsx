import React from "react";
import { BookOpen } from "lucide-react";

interface EmptyFilterResultsProps {
  filterType: string;
}

export function EmptyFilterResults({ filterType }: EmptyFilterResultsProps) {
  const getFilterMessage = () => {
    switch (filterType) {
      // Student filters
      case "pending":
        return "You don't have any pending assignments at the moment.";
      case "missed":
        return "Great! You don't have any missed assignments.";
      case "submitted":
        return "You haven't submitted any assignments yet.";
      // Instructor filters
      case "needs_grading":
        return "No assignments need grading at the moment.";
      case "graded":
        return "No graded assignments to show yet.";
      default:
        return "No assignments match this filter.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <BookOpen className="w-10 h-10 text-para-muted" />
      </div>

      <h3 className="text-xl font-bold text-heading mb-2">
        No Assignments Found
      </h3>

      <p className="text-para-muted text-center max-w-md mb-6">
        {getFilterMessage()}
      </p>
    </div>
  );
}
