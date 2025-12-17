"use client";

import { motion } from "motion/react";
import SharedListRow from "@/components/shared/SharedListRow";
import type { BaseDisplayItem, MenuOption } from "@/types/display-item";

interface SharedListViewProps {
  items: BaseDisplayItem[];
  selectedIds?: Set<string>;
  onItemClick?: (id: string) => void;
  onSelect?: (id: string) => void;
  onSelectAll?: () => void;
  getMenuOptions?: (id: string) => MenuOption[];
  showOwner?: boolean;
}

export default function SharedListView({
  items,
  selectedIds = new Set(),
  onItemClick,
  onSelect,
  onSelectAll,
  getMenuOptions,
  showOwner = true,
}: SharedListViewProps) {
  const allSelected = selectedIds.size === items.length && items.length > 0;
  console.log("Items: " + JSON.stringify(items));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="border border-light-border rounded-lg min-h-screen bg-main-background"
    >
      <table className="w-full">
        {/* Header */}
        <thead className="bg-background border-b border-light-border">
          <tr>
            {onSelect && (
              <th className="w-12 px-3 py-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAll?.();
                  }}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <div
                    className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all ${
                      allSelected
                        ? "bg-secondary border-secondary"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {allSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </th>
            )}
            <th className="px-3 py-3 text-left text-sm font-semibold text-heading">
              Name
            </th>
            {showOwner && (
              <th className="hidden sm:table-cell px-3 py-3 text-left text-sm font-semibold text-heading w-[180px]">
                Owner
              </th>
            )}
            <th className="hidden sm:table-cell px-3 py-3 text-left text-sm font-semibold text-heading w-[200px]">
              Modified
            </th>
            <th className="w-12 px-3 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <SharedListRow
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onSelect={onSelect}
              onClick={onItemClick}
              menuOptions={getMenuOptions?.(item.id)}
              showOwner={showOwner}
            />
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
