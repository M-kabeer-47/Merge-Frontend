"use client"
import { motion } from "motion/react";

export default function NotesListSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="border border-light-border rounded-lg overflow-hidden bg-main-background"
    >
      <table className="w-full">
        <thead className="border-b border-light-border">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-para-muted uppercase">
              Modified
            </th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr
              key={index}
              className="border-b border-light-border last:border-0 animate-pulse"
            >
              {/* Icon and Name */}
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-1"></div>
                  </div>
                </div>
              </td>

              {/* Type */}
              <td className="w-[120px] px-4 py-3.5">
                <div className="h-3.5 bg-gray-200 rounded w-16"></div>
              </td>

              {/* Last Modified */}
              <td className="w-[180px] px-4 py-3.5">
                <div className="h-3.5 bg-gray-200 rounded w-24"></div>
              </td>

              {/* Menu */}
              <td className="w-[50px] px-4 py-3.5">
                <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
