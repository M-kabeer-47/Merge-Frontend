import * as React from "react";
import { cn } from "@/lib/shadcn/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full font-roboto rounded-md border-2 bg-transparent px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-para placeholder:text-para-muted/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Dynamic border colors based on error state
          error
            ? "border-red-300 hover:border-red-400 focus:border-red-400 "
            : "border-light-border hover:border-secondary/30 focus:border-1 focus:border-white focus:ring-2 focus:ring-secondary/70",
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
