import { motion } from "motion/react";

export default function NotesGridSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="relative rounded-lg border border-light-border bg-main-background p-4 animate-pulse"
        >
          {/* Icon */}
          <div className="mb-3">
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
          </div>

          {/* Title */}
          <div className="mb-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
          </div>

          {/* Footer - Date and Menu */}
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
