"use client";
import * as React from "react";
import { cn } from "@/lib/shadcn/utils";
import { useTheme } from "next-themes";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full font-roboto rounded-md border-2 bg-transparent px-3 py-2 text-sm text-para transition-colors resize-none placeholder:text-para-muted/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Dynamic border colors based on error state
          error
            ? "border-red-300 hover:border-red-400 focus:border-red-400"
            : `border-light-border hover:border-secondary/30 focus:ring-[1.5px] focus:ring-secondary/70 ${
                isDarkMode
                  ? "focus:border-1 focus:border-main-background"
                  : "focus:border-1 focus:border-white"
              }`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
