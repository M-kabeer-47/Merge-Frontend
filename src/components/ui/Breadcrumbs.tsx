"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { BreadcrumbItem } from "@/types/content";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const router = useRouter();

  return (
    <nav
      className="flex items-center gap-2 text-sm min-w-0 flex-1"
      aria-label="Breadcrumb"
    >
      {items.map((crumb, index) => (
        <span key={crumb.id} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-para-muted flex-shrink-0" />
          )}
          <button
            onClick={() => {
              if (crumb.path) router.push(crumb.path);
            }}
            className={`hover:text-primary transition-colors truncate ${
              index === items.length - 1
                ? "text-heading font-semibold"
                : "text-para"
            }`}
            aria-current={index === items.length - 1 ? "page" : undefined}
          >
            {crumb.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
