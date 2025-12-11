"use client";

import { motion } from "motion/react";

interface ContentSkeletonProps {
  viewMode?: "list" | "grid";
  itemCount?: number;
}

export default function ContentSkeleton({
  viewMode = "list",
  itemCount = 6,
}: ContentSkeletonProps) {
  return (
    <div className="animate-pulse p-4 sm:p-6">
      {viewMode === "list" ? (
        <div className="space-y-2">
          {/* Header - responsive grid matching ContentListHeader */}
          <div className="grid grid-cols-[40px_1fr_40px] sm:grid-cols-[50px_1fr_180px_200px_50px] gap-2 sm:gap-4 px-3 py-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="hidden sm:block h-4 w-20 bg-gray-200 rounded" />
            <div className="hidden sm:block h-4 w-24 bg-gray-200 rounded" />
            <div className="w-4" />
          </div>

          {/* Rows - responsive grid matching ContentListRow */}
          {Array.from({ length: itemCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-[40px_1fr_40px] sm:grid-cols-[50px_1fr_180px_200px_50px] gap-2 sm:gap-4 px-3 py-3 border border-light-border rounded-lg"
            >
              {/* Checkbox */}
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-200 rounded" />
              </div>
              {/* Name with icon */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-24 sm:w-32 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-16 sm:w-20 bg-gray-200 rounded sm:hidden" />
                </div>
              </div>
              {/* Created By - hidden on mobile */}
              <div className="hidden sm:flex items-center">
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              {/* Last Modified - hidden on mobile */}
              <div className="hidden sm:flex items-center">
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
              {/* Menu */}
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 bg-gray-200 rounded" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: itemCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 sm:p-4 border border-light-border rounded-xl"
            >
              <div className="h-20 sm:h-24 w-full bg-gray-200 rounded-lg mb-2 sm:mb-3" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
