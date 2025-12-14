"use client";

import { motion } from "motion/react";
import SharedGridCard from "@/components/shared/SharedGridCard";
import type { BaseDisplayItem, MenuOption } from "@/types/display-item";

interface SharedGridViewProps {
  items: BaseDisplayItem[];
  selectedIds?: Set<string>;
  onItemClick?: (id: string) => void;
  onSelect?: (id: string) => void;
  getMenuOptions?: (id: string) => MenuOption[];
}

export default function SharedGridView({
  items,
  selectedIds = new Set(),
  onItemClick,
  onSelect,
  getMenuOptions,
}: SharedGridViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
    >
      {items.map((item) => (
        <SharedGridCard
          key={item.id}
          item={item}
          isSelected={selectedIds.has(item.id)}
          onSelect={onSelect}
          onClick={onItemClick}
          menuOptions={getMenuOptions?.(item.id)}
        />
      ))}
    </motion.div>
  );
}
