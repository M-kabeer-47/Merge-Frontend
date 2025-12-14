import { Metadata } from "next";
import CreateNotePage from "@/page-components/notes/CreateNotePage";

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
