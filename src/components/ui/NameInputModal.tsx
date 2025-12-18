"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface NameInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  title: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  submitText?: string;
  isLoading?: boolean;
  maxLength?: number;
}

export default function NameInputModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  placeholder = "Enter name...",
  initialValue = "",
  submitText = "Submit",
  isLoading = false,
  maxLength = 255,
}: NameInputModalProps) {
  const [name, setName] = useState(initialValue);

  // Reset name when modal opens/closes or initialValue changes
  useEffect(() => {
    if (isOpen) {
      setName(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName && trimmedName !== initialValue) {
      await onSubmit(trimmedName);
      setName("");
      onClose();
    } else if (trimmedName && !initialValue) {
      // For create mode (no initialValue), just submit if not empty
      await onSubmit(trimmedName);
      setName("");
      onClose();
    }
  };

  const handleClose = () => {
    setName(initialValue);
    onClose();
  };

  // Disable submit if empty, or if in edit mode and name hasn't changed
  const isSubmitDisabled =
    !name.trim() || (initialValue && name.trim() === initialValue) || isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-main-background rounded-lg shadow-xl w-full max-w-md mx-4 border border-light-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-light-border">
          <h2 className="text-xl font-bold text-heading font-raleway">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-background transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-para-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label
              htmlFor="nameInput"
              className="block text-sm font-medium text-heading mb-2"
            >
              {label}
            </label>
            <Input
              id="nameInput"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              autoFocus
              disabled={isLoading}
              maxLength={maxLength}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isLoading ? (
                <LoadingSpinner size="sm" text="Please wait..." />
              ) : (
                submitText
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
