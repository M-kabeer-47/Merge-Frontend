import React from "react";
import { motion } from "motion/react";
import { Home, ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/types/note";

interface NotesBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick: (index: number) => void;
}

export default function NotesBreadcrumbs({ breadcrumbs, onBreadcrumbClick }: NotesBreadcrumbsProps) {
  if (breadcrumbs.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-sm"
    >
      <button
        onClick={() => onBreadcrumbClick(-1)}
        className="flex items-center gap-1 text-para hover:text-primary transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <ChevronRight className="w-4 h-4 text-para-muted" />
          <button
            onClick={() => onBreadcrumbClick(index)}
            className={`text-para hover:text-primary transition-colors ${
              index === breadcrumbs.length - 1
                ? "font-semibold text-heading"
                : ""
            }`}
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </motion.div>
  );
}
