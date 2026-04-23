"use client";

import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export function NoSearchResults({
  searchTerm,
  onClearSearch,
}: NoSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">
        No quizzes found
      </h3>
      <p className="text-sm text-para-muted mb-4">
        No quizzes match &quot;{searchTerm}&quot;. Try a different search term.
      </p>
      <Button variant="outline" onClick={onClearSearch}>
        Clear Search
      </Button>
    </div>
  );
}
