"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2, FileWarning } from "lucide-react";

const PDFViewer = dynamic(() => import("@/components/content/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <span className="text-para-muted">Loading viewer...</span>
      </div>
    </div>
  ),
});

function ViewDocumentContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const roomId = params?.id as string;
  const fileUrl = searchParams?.get("url");
  const fileName = searchParams?.get("name") || "document.pdf";

  const handleClose = () => {
    router.back();
  };

  if (!fileUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <FileWarning className="w-12 h-12 text-para-muted" />
          <span className="text-heading font-medium">
            No document URL provided
          </span>
          <button
            onClick={handleClose}
            className="mt-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <PDFViewer
        url={decodeURIComponent(fileUrl)}
        fileName={fileName}
        onClose={handleClose}
      />
    </div>
  );
}

export default function ViewDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            <span className="text-para-muted">Loading...</span>
          </div>
        </div>
      }
    >
      <ViewDocumentContent />
    </Suspense>
  );
}
