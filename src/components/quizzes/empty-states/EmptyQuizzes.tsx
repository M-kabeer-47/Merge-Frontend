"use client";

import { FileQuestion, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyQuizzesProps {
  isInstructor?: boolean;
  onCreateFirst?: () => void;
}

export function EmptyQuizzes({
  isInstructor,
  onCreateFirst,
}: EmptyQuizzesProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-2">
        {isInstructor ? "No quizzes yet" : "No quizzes available"}
      </h3>
      <p className="text-sm text-para-muted mb-4">
        {isInstructor
          ? "Create your first quiz to test students' knowledge with auto-graded questions."
          : "Your instructor hasn't created any quizzes for this room yet."}
      </p>
      {isInstructor && onCreateFirst && (
        <Button onClick={onCreateFirst}>
          <Plus className="w-4 h-4" />
          Create First Quiz
        </Button>
      )}
    </div>
  );
}
