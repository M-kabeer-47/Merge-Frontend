import React from "react";
import { BookOpen, Plus } from "lucide-react";
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
