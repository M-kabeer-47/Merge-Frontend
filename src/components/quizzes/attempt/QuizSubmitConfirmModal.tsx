import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface QuizSubmitConfirmModalProps {
  isOpen: boolean;
  answeredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function QuizSubmitConfirmModal({
  isOpen,
  answeredCount,
  totalQuestions,
  isSubmitting,
  onConfirm,
  onCancel,
}: QuizSubmitConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm p-4">
      <div className="bg-background border border-light-border rounded-2xl p-6 max-w-sm w-full space-y-4">
        <h3 className="text-lg font-semibold text-heading">Submit Quiz?</h3>
        <p className="text-para-muted">
          {answeredCount < totalQuestions ? (
            <>
              You have{" "}
              <span className="text-warning font-medium">
                {totalQuestions - answeredCount} unanswered questions
              </span>
              . Are you sure you want to submit?
            </>
          ) : (
            "Once submitted, you cannot change your answers."
          )}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
