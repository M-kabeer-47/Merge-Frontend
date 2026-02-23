import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-3 mb-6"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="rounded-2xl px-4 py-3 bg-main-background border border-light-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
            <span className="text-sm text-para-muted ml-2">
              Thinking...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
