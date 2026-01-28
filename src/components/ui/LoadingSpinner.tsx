import { Loader } from "lucide-react";
import { cn } from "@/lib/shadcn/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  className,
  text = "Please wait...",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Loader className={cn("animate-spin", sizeClasses[size], className)} />
      <span className="text-sm">{text}</span>
    </div>
  );
}
