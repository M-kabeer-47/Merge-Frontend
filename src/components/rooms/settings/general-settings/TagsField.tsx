import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import type { GeneralSettingsFormData } from "@/schemas/room/general-settings";

interface TagsFieldProps {
  register: UseFormRegister<GeneralSettingsFormData>;
  isPublic: boolean;
  existingTags?: Array<string | { name: string }>;
  disabled?: boolean;
}

export function TagsField({
  register,
  isPublic,
  existingTags,
  disabled,
}: TagsFieldProps) {
  const normalizedTags =
    existingTags?.map((tag) => (typeof tag === "string" ? tag : tag.name)) ||
    [];

  if (!isPublic) {
    return (
      <div>
        <label className="block text-sm font-medium text-para mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {normalizedTags.length > 0 ? (
            normalizedTags.map((tag, index) => (
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
    );
  }

  return (
    <FormField label="Tags" htmlFor="room-tags">
      <Input
        {...register("tags")}
        id="room-tags"
        placeholder="e.g. Web Development, React, TypeScript"
        disabled={disabled}
        aria-describedby="tags-helper"
      />
      <p id="tags-helper" className="text-xs text-para-muted">
        Comma-separated tags to help users discover your room
      </p>
    </FormField>
  );
}
