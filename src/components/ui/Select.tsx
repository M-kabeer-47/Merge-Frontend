"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/shadcn/utils";
import { useTheme } from "next-themes";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.ComponentProps<"select"> {
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, placeholder, ...props }, ref) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full appearance-none font-roboto rounded-md border-2 bg-transparent pl-3 pr-9 py-2 text-sm text-para transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error !== undefined && !error?.trim()
              ? "border-red-300 hover:border-red-400 focus:border-red-400"
              : `border-light-border hover:border-secondary/30 focus:ring-[2px] focus:ring-secondary/70 ${
                  isDarkMode
                    ? "focus:border-1 focus:border-main-background"
                    : "focus:border-1 focus:border-white"
                }`,
            className,
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-para-muted" />
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
