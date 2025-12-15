// File: src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Roboto, Raleway } from "next/font/google";
import { CircleCheck, InfoIcon } from "lucide-react";
import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Merge - Collaborative Learning Platform",
  description:
    "Advanced collaborative learning and project management platform",
};

const toastIcons = {
  success: (
    <CircleCheck
      className="h-[22px] w-[22px] text-white text-center"
      fill="#4CAF50"
    />
  ),
  error: <InfoIcon className="h-[22px] w-[22px] text-white" fill="#2f1a58" />,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${raleway.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            {children}
            <Toaster
              icons={toastIcons}
              toastOptions={{
                style: {
                  background: "var(--bg-main-background)",
                  color: "var(--para)",
                  border: "1px solid var(--light-border)",
                },
              }}
            />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
