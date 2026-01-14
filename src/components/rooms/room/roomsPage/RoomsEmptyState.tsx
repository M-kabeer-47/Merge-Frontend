import { motion } from "motion/react";
import Image from "next/image";

export default function RoomsEmptyState({ search }: { search?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <Image
          src={
            search
              ? "/illustrations/no-search-results.png"
              : "/illustrations/empty-rooms.png"
          }
          alt={search ? "No search results" : "No rooms"}
          width={160}
          height={160}
          className="object-contain"
        />
      </motion.div>
      <h3 className="text-lg font-semibold text-heading mb-2">
        No rooms found
      </h3>
      <p className="text-para-muted mb-4">
        {search
          ? `No rooms match your search "${search}"`
          : "There are no rooms in this category yet"}
      </p>
    </motion.div>
  );
}
