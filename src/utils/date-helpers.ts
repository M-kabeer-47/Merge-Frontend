/**
 * Centralized date formatting utilities.
 *
 * Consolidates getTimeAgo / formatTimeAgo / formatDueDate / formatSubmissionDate
 * that were previously duplicated inline across multiple components.
 */

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
  const diffMs = now.getTime() - new Date(date).getTime();
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
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return new Date(date).toLocaleDateString();
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
  const dueDate = new Date(date);
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
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
