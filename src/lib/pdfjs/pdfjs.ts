import { pdfjs } from "react-pdf";

// For pdfjs-dist v5.x (React-PDF v10+)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
