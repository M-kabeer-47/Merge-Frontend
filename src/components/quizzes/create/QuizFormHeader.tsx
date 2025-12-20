"use client";

import { ArrowLeft, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuizFormHeaderProps {
  onBack: () => void;
  isDisabled?: boolean;
}

export default function QuizFormHeader({
  onBack,
  isDisabled,
}: QuizFormHeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-main-background/80 backdrop-blur-md border-b border-light-border transition-all">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              disabled={isDisabled}
              className="rounded-full hover:bg-secondary/10 hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-heading font-raleway flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-secondary" />
                Create New Quiz
              </h1>
              <p className="text-xs text-para-muted">
                Set up your quiz details and questions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-para-muted px-3 py-1 bg-secondary/5 rounded-full border border-secondary/10 hidden sm:inline-block">
              Draft Mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
