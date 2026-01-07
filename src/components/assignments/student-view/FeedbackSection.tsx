import { MessageSquare } from "lucide-react";

interface FeedbackSectionProps {
  feedback?: string;
  isGraded: boolean;
}

export default function FeedbackSection({
  feedback,
  isGraded,
}: FeedbackSectionProps) {
  if (!isGraded || !feedback) return null;

  return (
    <section className="bg-background border border-light-border rounded-lg p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-heading">
          Feedback from Teacher
        </h2>
      </div>
      <div className="p-4 bg-secondary/5 border border-light-border rounded-lg">
        <p className="text-sm text-para leading-relaxed whitespace-pre-wrap">
          {feedback}
        </p>
      </div>
    </section>
  );
}
