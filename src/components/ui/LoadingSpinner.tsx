import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  loaderColor,
  children,
  size = "sm",
}: {
  loaderColor?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={`animate-spin  ${
          loaderColor ? `text-${loaderColor}` : "text-white"
        } ${
          size === "sm" ? "h-6 w-6" : size === "md" ? "h-8 w-8" : "h-10 w-10"
        } mr-2`}
      />
      {children ? children : <span className="text-white">Please wait...</span>}
    </div>
  );
}
