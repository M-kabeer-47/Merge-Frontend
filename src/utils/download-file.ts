import { toast } from "sonner";

export const downloadFile = async (url: string, fileName: string) => {
  const toastId = toast.loading(`Downloading ${fileName}...`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);

    toast.success(`Downloaded ${fileName}`, { id: toastId });
  } catch (error) {
    console.error("Download failed:", error);
    toast.error(
      error instanceof Error ? error.message : "Failed to download file",
      { id: toastId }
    );
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
};
