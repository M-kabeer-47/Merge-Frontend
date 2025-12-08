import { useState, useCallback } from "react";
import { toast } from "sonner";

interface DownloadPdfOptions {
    title: string;
    content: string; // HTML content
}

export function useDownloadPdf() {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadPdf = useCallback(async ({ title, content }: DownloadPdfOptions) => {
        setIsDownloading(true);
        try {
            toast.info("Preparing PDF download...");

            // Dynamically import html2pdf.js
            const html2pdf = (await import("html2pdf.js")).default;

            // Create a temporary container with styled content
            const container = document.createElement("div");
            container.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 24px; color: #1a1a1a;">
            ${title || "Note"}
          </h1>
          <div style="font-size: 14px; line-height: 1.6; color: #333;">
            ${content}
          </div>
        </div>
      `;

            // Configure and generate PDF
            const options = {
                margin: [10, 10, 10, 10] as [number, number, number, number],
                filename: `${title || "note"}.pdf`,
                image: { type: "jpeg" as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
            };

            await html2pdf().set(options).from(container).save();

            toast.success("PDF downloaded successfully!");
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    }, []);

    return { downloadPdf, isDownloading };
}
