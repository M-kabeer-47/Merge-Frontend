"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface QuizDetailsPageProps {
  params: Promise<{ id: string; quizId: string }>;
}

export default function QuizDetailsPage({ params }: QuizDetailsPageProps) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function redirect() {
      const { id: roomId, quizId } = await params;

      if (!user) return;

      const isInstructor = user.role === "instructor";

      if (isInstructor) {
        // Instructor sees submissions
        router.replace(`/rooms/${roomId}/quizzes/${quizId}/submissions`);
      } else {
        // Student sees attempt or review based on completion status
        // For now, redirect to attempt - will be handled by attempt page logic
        router.replace(`/rooms/${roomId}/quizzes/${quizId}/attempt`);
      }
    }

    redirect();
  }, [params, user, router]);

  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
