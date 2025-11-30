import React from "react";
import { motion } from "motion/react";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

/**
 * Reusable error state component
 * Displays error icon, message, and optional retry button
 */
export default function ErrorState({
    title = "Failed to load",
    message = "There was an error loading the data. Please try again.",
    onRetry,
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
        >
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                <SearchIcon className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-heading mb-2">{title}</h3>
            <p className="text-para-muted text-center max-w-md mb-6">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline">
                    Retry
                </Button>
            )}
        </motion.div>
    );
}
