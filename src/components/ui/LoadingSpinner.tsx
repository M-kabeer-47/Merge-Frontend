import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  loaderColor,
  children,
  size = "sm",
  text = "Please wait...",
}: {
  loaderColor?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  text?: string;
}) {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`border-2 border-white/30 border-t-white rounded-full mr-2 ${
          size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"
        } ${
          loaderColor
            ? `border-${loaderColor}/30 border-t-${loaderColor}`
            : "border-white/30 border-t-white"
        }`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {children ? children : <span className="text-white">{text}</span>}
    </div>
  );
}
