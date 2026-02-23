import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAssignmentForStudent } from "@/server-api/assignment-submissions";
import StudentAssignmentClient from "@/components/assignments/student-view/StudentAssignmentClient";
import { studentAssignmentQueryKey } from "@/hooks/assignments/use-student-assignment";
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
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: studentAssignmentQueryKey(assignmentId),
    queryFn: () => getAssignmentForStudent(roomId, assignmentId),
  });
  // Fetch assignment data on server

  // Prefetch into React Query cache

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AssignmentDetailSkeleton isInstructor={false} />}>
        <StudentAssignmentClient roomId={roomId} assignmentId={assignmentId} />
      </Suspense>
    </HydrationBoundary>
  );
}
