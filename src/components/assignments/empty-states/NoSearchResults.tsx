import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NoSearchResultsProps {
  searchTerm: string | undefined;
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
        <span className="font-semibold text-para">{searchTerm || ""}</span>
        &quot;. Try adjusting your search terms or filters.
      </p>

      <Button variant="outline" onClick={onClearSearch}>
        Clear Search
      </Button>
    </div>
  );
}
