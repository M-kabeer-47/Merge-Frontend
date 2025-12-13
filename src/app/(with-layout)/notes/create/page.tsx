import { Metadata } from "next";
import CreateNotePage from "@/page-components/notes/CreateNotePage";

// This page uses React Query hooks and cannot be statically prerendered
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Note | Merge",
  description: "Create a new note to organize your study materials",
  keywords: ["create note", "new note", "study materials", "notes"],
  openGraph: {
    title: "Create Note | Merge",
    description: "Create a new note to organize your study materials",
    type: "website",
  },
};

export default function Page() {
  return <CreateNotePage />;
}
