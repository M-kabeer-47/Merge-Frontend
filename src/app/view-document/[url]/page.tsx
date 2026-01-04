"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const PdfViewer = dynamic(() => import("@/components/content/PDFViewer"), {
  ssr: false,
});

export default function Page() {
  const params = useParams();
  const url = decodeURIComponent(params.url as string);
  return <PdfViewer url={url} />;
}
