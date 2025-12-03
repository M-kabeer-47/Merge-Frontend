import { Metadata } from "next";
import EditNotePage from "@/pages/notes/EditNotePage";

export const metadata: Metadata = {
  title: "Edit Note | Merge",
  description: "Edit and update your note",
  openGraph: {
    title: "Edit Note | Merge",
    description: "Edit and update your note",
    type: "website",
  },
};

export default function Page() {
  return <EditNotePage />;
}
