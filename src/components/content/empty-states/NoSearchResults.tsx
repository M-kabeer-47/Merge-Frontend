"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch?: () => void;
}

export function NoSearchResults({
  searchTerm,
  onClearSearch,
}: NoSearchResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <Image
          src="/illustrations/no-search-results.png"
          alt="No search results"
          width={160}
          height={160}
          className="object-contain"
        />
      </motion.div>

      {/* Heading */}
      <h3 className="text-xl font-bold text-heading mb-2">
        No items match your search
      </h3>

      {/* Description */}
      <p className="text-para-muted text-center max-w-md mb-1">
        We couldn't find any files or folders matching{" "}
        <span className="font-semibold text-para">"{searchTerm}"</span>
      </p>

      <p className="text-sm text-para-muted text-center max-w-md mb-6">
        Try adjusting your search terms or clearing filters.
      </p>

      {/* Action Button */}
      {onClearSearch && (
        <Button
          variant="outline"
          className="px-6 py-2.5"
          onClick={onClearSearch}
        >
          Clear Search
        </Button>
      )}
    </motion.div>
  );
}
