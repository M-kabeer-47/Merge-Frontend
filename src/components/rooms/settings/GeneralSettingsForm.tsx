"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, X, Clock } from "lucide-react";
import { format } from "date-fns";
import type {
  RoomSettings,
  UpdateGeneralSettingsPayload,
} from "@/types/room-settings";

interface GeneralSettingsFormProps {
  room: RoomSettings;
  onSave: (payload: UpdateGeneralSettingsPayload) => void;
  isSubmitting?: boolean;
}

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1000;

export default function GeneralSettingsForm({
  room,
  onSave,
  isSubmitting = false,
}: GeneralSettingsFormProps) {
  const [title, setTitle] = useState(room.title);
  const [description, setDescription] = useState(room.description);
  const [tags, setTags] = useState(room.tags.join(", "));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Detect changes
  useEffect(() => {
    const changed =
      title !== room.title ||
      description !== room.description ||
      tags !== room.tags.join(", ");
    setHasChanges(changed);
  }, [title, description, tags, room]);

  // Validate form
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Room title is required";
    } else if (title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Title must not exceed ${MAX_TITLE_LENGTH} characters`;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      title: title.trim(),
      description: description.trim(),
      tags: room.visibility === "public" ? tagArray : room.tags,
    });

    // TODO: Integrate with backend API
    // Example: await updateRoomSettings(room.id, payload);
  };

  const handleCancel = () => {
    setTitle(room.title);
    setDescription(room.description);
    setTags(room.tags.join(", "));
    setErrors({});
  };

  return (
    <div className="bg-background border border-light-border rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-raleway font-bold text-heading">
            General Information
          </h3>
          <p className="text-sm text-para-muted mt-1">
            Update your room&apos;s identity and description
          </p>
        </div>
        {room.lastSaved && (
          <div className="flex items-center gap-2 text-xs text-para-muted">
            <Clock className="w-3.5 h-3.5" />
            <span>Last saved {format(room.lastSaved, "MMM d, h:mm a")}</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label
            htmlFor="room-title"
            className="block text-sm font-medium text-para mb-2"
          >
            Room Title <span className="text-destructive">*</span>
          </label>
          <Input
            id="room-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // error={errors.title}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="Enter room title"
            aria-required="true"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          <div className="flex items-center justify-between mt-1.5">
            {errors.title ? (
              <p
                id="title-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.title}
              </p>
            ) : (
              <p className="text-xs text-para-muted">
                A clear, descriptive title for your room
              </p>
            )}
            <span className="text-xs text-para-muted">
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="room-description"
            className="block text-sm font-medium text-para mb-2"
          >
            Room Description
          </label>
          <Textarea
            id="room-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={4}
            placeholder="Describe what your room is about, topics covered, etc."
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "desc-error" : undefined}
          />
          <div className="flex items-center justify-between mt-1.5">
            {errors.description ? (
              <p
                id="desc-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.description}
              </p>
            ) : (
              <p className="text-xs text-para-muted">
                Help members understand the purpose and content of this room
              </p>
            )}
            <span className="text-xs text-para-muted">
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
        </div>

        {/* Tags (only editable if room is public) */}
        {room.visibility === "public" ? (
          <div>
            <label
              htmlFor="room-tags"
              className="block text-sm font-medium text-para mb-2"
            >
              Tags
            </label>
            <Input
              id="room-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. Web Development, React, TypeScript"
              aria-describedby="tags-helper"
            />
            <p id="tags-helper" className="text-xs text-para-muted mt-1.5">
              Comma-separated tags to help users discover your room
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-para mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {room.tags.length > 0 ? (
                room.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-sm text-para-muted">No tags set</p>
              )}
            </div>
            <p className="text-xs text-para-muted mt-2">
              Tags are only editable for public rooms
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-light-border">
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-28"
            aria-label="Save changes"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            disabled={isSubmitting}
            aria-label="Cancel changes"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
