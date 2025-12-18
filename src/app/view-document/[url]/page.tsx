"use client";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/content/PDFViewer"), {
  ssr: false,
});

export default function Page() {
  return (
    <PdfViewer url="https://mahesararslan-merge-bucket.s3.eu-north-1.amazonaws.com/room-files/77f26d1c-26cb-418c-b98c-3c7391dcef8b/1765735147127-e3bb11be-f6af-48e8-870a-688d243d34f3.pdf" />
  );
}
