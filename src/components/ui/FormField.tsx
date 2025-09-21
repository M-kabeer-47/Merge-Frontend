import React from "react";
import { motion } from "framer-motion";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  children,
  className = "",
}) => {
  return (
    <motion.div className={`flex flex-col gap-[5px] ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-heading">
        {label}
      </label>
      {children}
      {error && (
        <span className="text-red-500 text-xs font-medium">{error}</span>
      )}
    </motion.div>
  );
};
