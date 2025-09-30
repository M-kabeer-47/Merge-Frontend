import React from "react";
import { motion } from "framer-motion";

interface RoleSelectionCardsProps {
  value?: string;
  onChange: (role: string) => void;
  error?: string;
}

export default function RoleSelectionCards({
  value,
  onChange,
  error,
}: RoleSelectionCardsProps) {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Student Card */}
        <motion.div
          className="group cursor-pointer sm:h-auto max-h-[100px]"
          onClick={() => onChange("student")}
        >
          <div
            className={` rounded-lg border-2 p-2 transition-all duration-200 hover:shadow-md group-hover:scale-[1.01] ${
              value === "student"
                ? "border-secondary bg-secondary/5"
                : "border-light-border hover:border-secondary/50 hover:bg-secondary/5 bg-background"
            }`}
          >
            <div className="flex items-center space-x-8">
              <img
                src="/illustrations/student.png"
                alt="Student"
                className="w-15 h-15 mt-1 flex-shrink-0 scale-160  "
              />
              <h3 className="font-raleway text-center font-semibold text-heading text-base sm:text-lg mb-1">
                Student
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Instructor Card */}
        <motion.div
          className="group cursor-pointer sm:h-auto max-h-[100px]"
          onClick={() => onChange("instructor")}
        >
          <div
            className={` rounded-lg border-2 p-2 transition-all duration-200 hover:shadow-md group-hover:scale-[1.01] ${
              value === "instructor"
                ? "border-secondary bg-secondary/5"
                : "border-light-border hover:border-secondary/50 hover:bg-secondary/5 bg-background"
            }`}
          >
            <div className="flex items-center space-x-10">
              <img
                src="/illustrations/instructor.png"
                alt="Instructor"
                className="w-15 h-15 mt-1 flex-shrink-0 scale-160"
              />
              <h3 className="font-raleway font-semibold text-heading text-base  sm:text-lg mb-1">
                Instructor
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Error message */}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs font-medium mt-2 block"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
