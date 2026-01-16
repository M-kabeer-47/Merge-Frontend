import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getAssignmentForInstructor } from "@/server-api/assignment-submissions";
import InstructorAssignmentView from "@/components/assignments/InstructorAssignmentView";

interface AssignmentSubmissionsPageProps {
  params: Promise<{ id: string; assignmentId: string }>;
}

/**
 * Instructor submissions page (Server Component).
 * Fetches assignment data server-side and renders the instructor view.
 */
export default async function AssignmentSubmissionsPage({
  params,
}: AssignmentSubmissionsPageProps) {
  const { id: roomId, assignmentId } = await params;

  const assignment = await getAssignmentForInstructor(roomId, assignmentId);

  if (!assignment) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-main-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-light-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/rooms/${roomId}/assignments`}
              className="p-2 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-heading" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-heading font-raleway">
                {assignment.title}
              </h1>
              <p className="text-xs text-para-muted">Submission Overview</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <InstructorAssignmentView assignment={assignment} />
        </div>
      </main>
    </div>
  );
}
