"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCreateAssignment from "@/hooks/assignments/use-create-assignment";
import { createAssignmentSchema } from "@/schemas/assignment/create-assignment";
import AssignmentFormHeader from "@/components/assignments/create/AssignmentFormHeader";
import BasicInfoSection from "@/components/assignments/create/BasicInfoSection";
import AttachmentsSection from "@/components/assignments/create/AttachmentsSection";
import SchedulePointsSection from "@/components/assignments/create/SchedulePointsSection";

type FormData = z.infer<typeof createAssignmentSchema>;

export default function CreateAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;

  // Attachments state is separate from form state
  const [attachments, setAttachments] = useState<File[]>([]);

  const { createAssignment, isCreating, attachmentProgress } =
    useCreateAssignment({
      onSuccess: () => {
        router.push(`/rooms/${roomId}/assignments`);
      },
    });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    //@ts-ignore
    resolver: zodResolver(createAssignmentSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      points: 0,
      scheduledAt: null,
      endAt: "",
      isTurnInLateEnabled: false,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log("Form Data: " + JSON.stringify(data));
    await createAssignment({
      data: {
        roomId,
        title: data.title,
        description: data.description,
        totalScore: data.points,
        ...(data.scheduledAt ? { scheduledAt: data.scheduledAt } : {}),
        endAt: new Date(data.endAt).toISOString(),
        isTurnInLateEnabled: data.isTurnInLateEnabled,
      },
      attachments,
    });
  });

  const handleBack = () => {
    router.push(`/rooms/${roomId}/assignments`);
  };

  return (
    <div className="min-h-screen bg-main-background pb-20">
      {/* Header */}
      <AssignmentFormHeader onBack={handleBack} isDisabled={isCreating} />

      {/* Form */}
      <div className="px-4 sm:px-6 py-8 mx-auto max-w-4xl">
        <form id="assignment-form" onSubmit={onSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <BasicInfoSection
            //@ts-ignore
            control={control}
            errors={errors}
            isDisabled={isCreating}
          />

          {/* Attachments Section */}
          <AttachmentsSection
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            attachmentProgress={attachmentProgress}
            isDisabled={isCreating}
            maxFileSizeMB={50}
          />

          {/* Schedule & Points Section */}
          <SchedulePointsSection
            //@ts-ignore
            control={control}
            errors={errors}
            isDisabled={isCreating}
          />
        </form>
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-main-background border-t border-light-border py-4 px-4 sm:px-6 z-20">
        <div className="max-w-xl mx-auto">
          <Button
            type="submit"
            form="assignment-form"
            disabled={isCreating || !isValid}
            className="w-full"
            size="lg"
          >
            {isCreating ? (
              <LoadingSpinner size="sm" text="Creating..." />
            ) : (
              "Create Assignment"
            )}
          </Button>
        </div>
      </div>

      {/* Spacer for fixed button */}
    </div>
  );
}
