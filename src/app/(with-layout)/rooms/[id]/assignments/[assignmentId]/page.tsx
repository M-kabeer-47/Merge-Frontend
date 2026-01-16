"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useRoom } from "@/providers/RoomProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AssignmentDetailsPageProps {
  params: Promise<{ id: string; assignmentId: string }>;
}

/**
 * Assignment detail page - acts as a redirect hub.
 * Instructors/Moderators → /submissions
 * Students → /submit
 */
export default function AssignmentDetailsPage({
  params,
}: AssignmentDetailsPageProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { userRole } = useRoom();

  useEffect(() => {
    async function redirect() {
      const { id: roomId, assignmentId } = await params;

      if (isAuthLoading || !user) return;

      const isInstructor = userRole === "instructor" || userRole === "moderator";

      if (isInstructor) {
        // Instructor sees submissions
        router.replace(`/rooms/${roomId}/assignments/${assignmentId}/submissions`);
      } else {
        // Student sees submit/work page
        router.replace(`/rooms/${roomId}/assignments/${assignmentId}/submit`);
      }
    }

    redirect();
  }, [params, user, isAuthLoading, userRole, router]);

  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
