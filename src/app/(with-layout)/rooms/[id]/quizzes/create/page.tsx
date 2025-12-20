"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useCreateQuiz from "@/hooks/quizzes/use-create-quiz";
import {
  createQuizSchema,
  type CreateQuizFormData,
} from "@/schemas/quiz/create-quiz";
import QuizFormHeader from "@/components/quizzes/create/QuizFormHeader";
import BasicInfoSection from "@/components/quizzes/create/BasicInfoSection";
import SettingsSection from "@/components/quizzes/create/SettingsSection";
import QuestionsSection from "@/components/quizzes/create/QuestionsSection";
import { Save } from "lucide-react";

export default function CreateQuizPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;

  const { createQuiz, isCreating } = useCreateQuiz({
    onSuccess: () => {
      router.push(`/rooms/${roomId}/quizzes`);
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      timeLimitMin: 30,
      deadline: "",
      questions: [
        {
          text: "",
          options: ["", "", "", ""],
          correctOption: "",
          points: 1,
        },
      ],
    },
  });

  const questions = watch("questions");
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  const onSubmit = handleSubmit(async (data) => {
    await createQuiz({
      roomId,
      title: data.title,
      timeLimitMin: data.timeLimitMin,
      deadline: new Date(data.deadline).toISOString(),
      questions: data.questions.map((q) => ({
        text: q.text,
        options: q.options,
        correctOption: q.correctOption,
        points: q.points,
      })),
    });
  });

  const handleBack = () => {
    router.push(`/rooms/${roomId}/quizzes`);
  };

  return (
    <div className="min-h-screen bg-main-background pb-28">
      {/* Header */}
      <QuizFormHeader onBack={handleBack} isDisabled={isCreating} />

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 mx-auto max-w-[1600px]">
        <form
          id="quiz-form"
          onSubmit={onSubmit}
          className="grid grid-cols-1 xl:grid-cols-12 gap-8"
        >
          {/* Left Column: Basic Info & Settings */}
          <div className="xl:col-span-5 space-y-6 h-fit sticky top-24">
            <BasicInfoSection
              control={control}
              errors={errors}
              isDisabled={isCreating}
            />

            <SettingsSection
              control={control}
              errors={errors}
              isDisabled={isCreating}
            />
          </div>

          {/* Right Column: Questions Builder */}
          <div className="xl:col-span-7">
            <QuestionsSection
              control={control}
              errors={errors}
              isDisabled={isCreating}
            />
          </div>
        </form>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
        <div className="bg-background/80 backdrop-blur-md border border-light-border shadow-lg rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-para-muted font-medium uppercase tracking-wider">
              Summary
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-heading">
                {questions.length}
              </span>
              <span className="text-xs text-para-muted">questions</span>
              <span className="text-xs text-para-muted mx-1">•</span>
              <span className="text-lg font-bold text-heading">
                {totalPoints}
              </span>
              <span className="text-xs text-para-muted">points</span>
            </div>
          </div>

          <Button
            type="submit"
            form="quiz-form"
            disabled={isCreating || !isValid}
            size="sm"
            className="w-[80%] py-[20px]"
          >
            {isCreating ? (
              <LoadingSpinner size="sm" text="Creating..." />
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Create Quiz
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
