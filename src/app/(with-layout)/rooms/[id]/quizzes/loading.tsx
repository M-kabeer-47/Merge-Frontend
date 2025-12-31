import QuizzesSkeleton from "@/components/quizzes/QuizzesSkeleton";

// This loading.tsx shows during route segment changes (e.g., navigating to /quizzes)
// For searchParams changes, the Suspense key in page.tsx handles it
export default function Loading() {
  return <QuizzesSkeleton />;
}
