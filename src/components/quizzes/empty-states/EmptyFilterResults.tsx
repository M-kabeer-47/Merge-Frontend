"use client";

import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyFilterResultsProps {
  filterType: string;
  onClearFilter: () => void;
}

export function EmptyFilterResults({
  filterType,
  onClearFilter,
}: EmptyFilterResultsProps) {
  const getFilterText = () => {
    switch (filterType) {
      case "pending":
        return "pending";
      case "completed":
        return "completed";
      case "missed":
        return "missed";
      case "active":
        return "active";
      case "closed":
        return "closed";
      default:
        return filterType;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">
        No {getFilterText()} quizzes
      </h3>
      <p className="text-sm text-para-muted mb-4">
        You don't have any {getFilterText()} quizzes at the moment.
      </p>
      <Button variant="outline" onClick={onClearFilter}>
        View All Quizzes
      </Button>
    </div>
  );
}
