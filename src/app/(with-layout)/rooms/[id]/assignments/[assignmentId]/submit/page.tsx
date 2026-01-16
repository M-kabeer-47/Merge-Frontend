import { Suspense } from "react";
import { getAssignmentForStudent } from "@/server-api/assignment-submissions";
import StudentAssignmentClient from "@/components/assignments/StudentAssignmentClient";
import AssignmentDetailSkeleton from "@/components/ui/skeletons/AssignmentDetailSkeleton";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface AssignmentSubmitPageProps {
  params: Promise<{ id: string; assignmentId: string }>;
}

export default async function AssignmentSubmitPage({
  params,
}: AssignmentSubmitPageProps) {
  const { id: roomId, assignmentId } = await params;

  // Fetch assignment data on server
  const assignment = await getAssignmentForStudent(roomId, assignmentId);

  if (!assignment) {
    return (
      <div className="min-h-screen bg-main-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-heading mb-2">
            Assignment Not Found
          </h1>
          <p className="text-para-muted mb-4">
            The assignment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href={`/rooms/${roomId}/assignments`}>
            <Button>Back to Assignments</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<AssignmentDetailSkeleton isInstructor={false} />}>
      <StudentAssignmentClient assignment={assignment} roomId={roomId} />
    </Suspense>
  );
}
