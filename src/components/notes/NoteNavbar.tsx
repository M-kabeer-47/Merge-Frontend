"use client";

import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface NoteNavbarProps {
  type: "create" | "update";
  onSave: () => void;
  isSaving: boolean;
  hasChanges?: boolean;
}

export default function NoteNavbar({
  type,
  onSave,
  isSaving,
  hasChanges = false,
}: NoteNavbarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (hasChanges) {
      const confirmed = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmed) return;
    }
    router.push("/notes");
  };

  return (
    <nav className="sticky top-0 z-50 bg-main-background/80 backdrop-blur-sm border-b border-light-border/50">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-para-muted hover:text-heading transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline text-sm">Back</span>
          </button>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3">
            {hasChanges && type === "update" && (
              <span className="text-xs text-para-muted font-medium hidden sm:inline">
                Unsaved changes
              </span>
            )}
            
            <Button
              variant="default"
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              className="w-[120px]"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="text-xs sm:text-sm">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{type === "create" ? "Save" : "Update"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

