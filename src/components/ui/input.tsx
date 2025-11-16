"use client";
import * as React from "react";
import { cn } from "@/lib/shadcn/utils";
import { useTheme } from "next-themes";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full font-roboto rounded-md border-2 bg-transparent px-3 py-2 text-sm text-para transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-para placeholder:text-para-muted/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Dynamic border colors based on error state
          error !== undefined && !error?.trim()
            ? "border-red-300 hover:border-red-400 focus:border-red-400 "
            : `border-light-border hover:border-secondary/30  focus:ring-[2px] focus:ring-secondary/70 ${isDarkMode ? 'focus:border-1 focus:border-main-background' : 'focus:border-1 focus:border-white'}`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
