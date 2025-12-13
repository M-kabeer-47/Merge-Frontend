import { Metadata } from "next";
import ForgotPasswordPage from "@/page-components/auth/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Forgot Password | Merge",
  description: "Reset your Merge account password",
  openGraph: {
    title: "Forgot Password | Merge",
    description: "Reset your Merge account password",
    type: "website",
  },
};

export default function Page() {
  return <ForgotPasswordPage />;
}
