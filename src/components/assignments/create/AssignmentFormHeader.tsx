"use client";

import { ArrowLeft } from "lucide-react";

interface AssignmentFormHeaderProps {
  onBack: () => void;
  isDisabled?: boolean;
}

export default function AssignmentFormHeader({
  onBack,
  isDisabled = false,
}: AssignmentFormHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-main-background border-b border-light-border">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
              disabled={isDisabled}
            >
              <ArrowLeft className="w-5 h-5 text-para" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-heading font-raleway">
                Create Assignment
              </h1>
              <p className="text-sm text-para-muted">
                Set up a new assignment for your students
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
