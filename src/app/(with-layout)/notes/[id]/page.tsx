import { Metadata } from "next";
import ViewNotePage from "@/pages/notes/ViewNotePage";

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
