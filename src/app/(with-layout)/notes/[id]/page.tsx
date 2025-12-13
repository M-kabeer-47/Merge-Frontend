import { Metadata } from "next";
import ViewNotePage from "@/page-components/notes/ViewNotePage";

// This page uses dynamic params and React Query hooks
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "View Note | Merge",
  description: "View and read your note",
  openGraph: {
    title: "View Note | Merge",
    description: "View and read your note",
    type: "article",
  },
};

export default function Page() {
  return <ViewNotePage />;
}
