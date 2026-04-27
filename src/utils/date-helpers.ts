/**
 * Centralized date formatting utilities.
 *
 * Consolidates getTimeAgo / formatTimeAgo / formatDueDate / formatSubmissionDate
 * that were previously duplicated inline across multiple components.
 */

import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

/**
 * Parse a date value coming from the backend.
 *
 * Why: Postgres `timestamp without time zone` (TypeORM @CreateDateColumn default)
 * serializes without a `Z` suffix. `new Date("2026-04-28T10:30:00")` then parses
 * it as LOCAL time, producing wrong relative timestamps off by the user's TZ
 * offset. We assume timestamps without a TZ marker are UTC.
 */
export function parseServerDate(date: Date | string): Date {
  if (date instanceof Date) return date;
  const hasTimezone = /[Zz]|[+-]\d{2}:?\d{2}$/.test(date);
  return new Date(hasTimezone ? date : date + "Z");
}

/**
 * Relative "time ago" string using date-fns, safe against missing timezone markers.
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    return formatDistanceToNow(parseServerDate(date), { addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * Relative "time ago" string for past dates.
 *
 * @param date - The past date to format
 * @param compact - If true, returns short form ("5m ago"). If false, returns verbose ("5 minutes ago").
 */
export function getTimeAgo(
  date: Date | string,
  compact: boolean = true,
): string {
  const now = new Date();
  const diffMs = now.getTime() - parseServerDate(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return compact ? "Just now" : "just now";
  }
  if (diffMins < 60) {
    return compact
      ? `${diffMins}m ago`
      : `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  }
  if (diffHours < 24) {
    return compact
      ? `${diffHours}h ago`
      : `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }
  if (diffDays < 7) {
    return compact
      ? `${diffDays}d ago`
      : `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  if (compact) {
    return parseServerDate(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return parseServerDate(date).toLocaleDateString();
}

/**
 * Relative due-date string for future (or past-due) dates.
 *
 * @param date - The due date to format
 * @param compact - If true, returns short form ("Overdue", "Due in 3d"). If false, returns verbose form.
 */
export function formatDueDate(
  date: Date | string,
  compact: boolean = false,
): string {
  const dueDate = parseServerDate(date);
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 0) {
    if (compact) return "Overdue";
    const absDays = Math.abs(diffDays);
    return `Overdue by ${absDays} day${absDays !== 1 ? "s" : ""}`;
  }
  if (diffDays === 0) {
    return "Due today";
  }
  if (diffDays === 1) {
    return "Due tomorrow";
  }
  if (diffDays <= 7) {
    return compact ? `Due in ${diffDays}d` : `Due in ${diffDays} days`;
  }

  return dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      !compact && dueDate.getFullYear() !== now.getFullYear()
        ? "numeric"
        : undefined,
  });
}

/**
 * Format a submission date to a readable string.
 */
export function formatSubmissionDate(date?: Date | string): string | null {
  if (!date) return null;
  return parseServerDate(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
