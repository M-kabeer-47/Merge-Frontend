import React from "react";
import { BookOpen, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyAssignmentsProps {
  isInstructor: boolean;
  onCreateFirst?: () => void;
}

export function EmptyAssignments({
  isInstructor,
  onCreateFirst,
}: EmptyAssignmentsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <BookOpen className="w-10 h-10 text-primary" />
      </div>

      <h3 className="text-xl font-bold text-heading mb-2">
        {isInstructor ? "No Assignments Yet" : "No Assignments Available"}
      </h3>

      <p className="text-para-muted text-center max-w-md mb-6">
        {isInstructor
          ? "Get started by creating your first assignment. Students will be able to view and submit their work here."
          : "Your instructor hasn't posted any assignments yet. Check back later for updates."}
      </p>

      {isInstructor && onCreateFirst && (
        <Button onClick={onCreateFirst} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create First Assignment
        </Button>
      )}
    </div>
  );
}

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export function NoSearchResults({
  searchTerm,
  onClearSearch,
}: NoSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-para-muted" />
      </div>

      <h3 className="text-xl font-bold text-heading mb-2">
        No Assignments Found
      </h3>

      <p className="text-para-muted text-center max-w-md mb-6">
        No assignments match your search for &quot;
        <span className="font-semibold text-para">{searchTerm}</span>&quot;. Try
        adjusting your search terms or filters.
      </p>

      <Button variant="outline" onClick={onClearSearch}>
        Clear Search
      </Button>
    </div>
  );
}

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
