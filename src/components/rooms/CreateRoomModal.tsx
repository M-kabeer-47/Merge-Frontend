"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import TagSelector from "./TagSelector";
import VisibilitySelector from "./VisibilitySelector";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCreateRoom from "@/hooks/rooms/create-room";
import { createRoomSchema, type CreateRoomType } from "@/schemas/room/create-room";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (room: any) => void;
}

// Predefined tags
const AVAILABLE_TAGS = [
  "javascript",
  "python",
  "react",
  "typescript",
  "programming",
  "web development",
  "data science",
  "machine learning",
  "artificial intelligence",
  "backend",
  "frontend",
  "fullstack",
  "database",
  "algorithms",
  "design patterns",
  "mobile development",
  "cloud computing",
  "devops",
  "testing",
  "security",
];

export default function CreateRoomModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRoomModalProps) {
  const { createRoom, isCreating, isCreateSuccess, createdRoom,isRotationPending } = useCreateRoom();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateRoomType>({
    resolver: zodResolver(createRoomSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
      tagNames: [],
    },
  });

  const isPublic = watch("isPublic");

  // Handle successful room creation
  useEffect(() => {
    if (isCreateSuccess && createdRoom) {
      reset();
      onClose();
      if (onSuccess) {
        onSuccess(createdRoom);
      }
    }
  }, [isCreateSuccess, createdRoom, reset, onClose, onSuccess]);

  const onSubmit = async (data: CreateRoomType) => {
    await createRoom(data);
  };

  const handleClose = () => {
    if (!isCreating) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Room"
      description="Set up a collaborative learning space for your community"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Room Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <FormField
              label="Room Title"
              htmlFor="title"
              error={errors.title?.message}
            >
              <Input
                {...field}
                id="title"
                placeholder="e.g., Advanced JavaScript Course"
                error={errors.title?.message}
                disabled={isCreating}
              />
            </FormField>
          )}
        />

        {/* Room Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormField
              label="Description"
              htmlFor="description"
              error={errors.description?.message}
            >
              <Textarea
                {...field}
                id="description"
                rows={4}
                placeholder="Describe what this room is about, what topics will be covered, and what members can expect..."
                error={errors.description?.message}
                disabled={isCreating}
              />
            </FormField>
          )}
        />

        {/* Room Visibility */}
        <Controller
          name="isPublic"
          control={control}
          render={({ field }) => (
            <FormField
              label="Room Visibility"
              htmlFor="isPublic"
              error={errors.isPublic?.message}
            >
              <VisibilitySelector
                isPublic={field.value}
                onChange={field.onChange}
                disabled={isCreating}
              />
            </FormField>
          )}
        />

        {/* Tags */}
        <Controller
          name="tagNames"
          control={control}
          render={({ field }) => (
            <FormField
              label="Tags"
              htmlFor="tagNames"
              error={errors.tagNames?.message}
            >
              <TagSelector
                selectedTags={field.value || []}
                onChange={field.onChange}
                availableTags={AVAILABLE_TAGS}
                error={errors.tagNames?.message}
                maxTags={5}
              />
            </FormField>
          )}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-light-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isCreating || !isValid}
            className="flex-1"
          >
            {isCreating || isRotationPending ? (
              <LoadingSpinner />
            ) : (
              <>
                <Users className="sm:w-4 sm:h-4 h-2 w-2" />
                Create Room
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
