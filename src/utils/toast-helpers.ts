import { toast } from "sonner";

/**
 * Standard error toast for API mutation failures.
 * Extracts message from Axios error shape or falls back to default.
 *
 * Replaces the repeated pattern:
 *   toast.error(error?.response?.data?.message || "Failed to...")
 */
export function toastApiError(
  error: unknown,
  fallbackMessage: string,
): void {
  const axiosError = error as {
    response?: { data?: { message?: string } };
  };
  toast.error(axiosError?.response?.data?.message || fallbackMessage);
}
