"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const PdfViewer = dynamic(() => import("@/components/content/PDFViewer"), {
  ssr: false,
});

export default function Page() {
  const params = useParams();
  let url = decodeURIComponent(params.url as string);

  // Defensive: Remove any &name= parameter that might exist in old cached URLs
  const nameParamIndex = url.indexOf("&name=");
  if (nameParamIndex !== -1) {
    url = url.substring(0, nameParamIndex);
  }

  return <PdfViewer url={url} />;
}
