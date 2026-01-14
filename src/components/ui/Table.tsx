"use client";

import React from "react";

// Column definition
export interface TableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  width?: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * Reusable Table component with customizable columns and row rendering.
 * Supports row click handling, custom cell rendering, and empty state.
 */
export default function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data available",
  className = "",
}: TableProps<T>) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-para-muted">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <table className={`w-full ${className}`}>
      <thead className="bg-secondary/5 border-b border-light-border">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={`px-4 py-3 text-xs font-semibold text-para uppercase tracking-wider ${
                alignClasses[col.align || "left"]
              }`}
              style={col.width ? { width: col.width } : undefined}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-light-border">
        {data.map((item, index) => (
          <tr
            key={keyExtractor(item)}
            className={`hover:bg-secondary/5 transition-colors ${
              onRowClick ? "cursor-pointer" : ""
            }`}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((col) => (
              <td
                key={col.key}
                className={`px-4 py-3 ${alignClasses[col.align || "left"]}`}
              >
                {col.render(item, index)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Re-export the type for convenience
export type { TableProps };
