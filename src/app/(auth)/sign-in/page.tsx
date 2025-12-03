import { Metadata } from "next";
import SignInPage from "@/pages/auth/SignInPage";

export const metadata: Metadata = {
  title: "Sign In | Merge",
  description: "Sign in to your Merge account to access courses, live sessions, and learning materials",
  keywords: ["sign in", "login", "merge", "education platform"],
  openGraph: {
    title: "Sign In | Merge",
    description: "Sign in to your Merge account to access courses, live sessions, and learning materials",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Merge",
    description: "Sign in to your Merge account",
  },
};

export default function Page() {
  return <SignInPage />;
}
