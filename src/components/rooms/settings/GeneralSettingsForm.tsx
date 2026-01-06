"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { RoomDetails } from "@/types/room-details";
import {
  generalSettingsSchema,
  type GeneralSettingsFormData,
} from "@/schemas/room/general-settings";
import {
  FormHeader,
  TitleField,
  DescriptionField,
  TagsField,
} from "./general-settings";

interface GeneralSettingsFormProps {
  room: RoomDetails;
  onSave: (data: {
    title: string;
    description: string;
    tags?: string[];
  }) => void;
  isSubmitting?: boolean;
}

export default function GeneralSettingsForm({
  room,
  onSave,
  isSubmitting = false,
}: GeneralSettingsFormProps) {
  const defaultValues: GeneralSettingsFormData = {
    title: room.title,
    description: room.description || "",
    tags:
      room.tags
        ?.map((tag) => (typeof tag === "string" ? tag : tag.name))
        .join(", ") || "",
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    mode: "onChange",
    defaultValues,
  });

  const titleValue = watch("title");
  const descriptionValue = watch("description");

  // Reset form when room data changes
  useEffect(() => {
    reset({
      title: room.title,
      description: room.description || "",
      tags:
        room.tags
          ?.map((tag) => (typeof tag === "string" ? tag : tag.name))
          .join(", ") || "",
    });
  }, [room.id, room.title, reset]);

  const handleFormSubmit = (data: GeneralSettingsFormData) => {
    const tagArray = data.tags
      ? data.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : undefined;

    onSave({
      title: data.title.trim(),
      description: data.description?.trim() || "",
      tags: room.isPublic ? tagArray : undefined,
    });
  };

  const handleCancel = () => {
    reset(defaultValues);
  };

  return (
    <div className="bg-background border border-light-border rounded-xl p-6">
      <FormHeader lastSaved={room.updatedAt} />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <TitleField
          register={register}
          error={errors.title?.message}
          disabled={isSubmitting}
          watchValue={titleValue}
        />

        <DescriptionField
          register={register}
          error={errors.description?.message}
          disabled={isSubmitting}
          watchValue={descriptionValue || ""}
        />

        <TagsField
          register={register}
          isPublic={room.isPublic}
          existingTags={room.tags}
          disabled={isSubmitting}
        />

        {isDirty && (
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-light-border">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-28"
              aria-label="Save changes"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
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
      </form>
    </div>
  );
}
