import { Metadata } from "next";
import SignUpPage from "@/pages/auth/SignUpPage";

export const metadata: Metadata = {
  title: "Sign Up | Merge",
  description: "Create your Merge account to access thousands of courses, live sessions, and expert instructors",
  keywords: ["sign up", "register", "create account", "merge", "education platform"],
  openGraph: {
    title: "Sign Up | Merge",
    description: "Create your Merge account to access thousands of courses and expert instructors",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up | Merge",
    description: "Create your Merge account",
  },
};

export default function Page() {
  return <SignUpPage />;
}
