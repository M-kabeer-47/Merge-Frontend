import React from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";
import AuthProviderServer from "@/providers/AuthProviderServer";

export default function WithLayoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProviderServer>
      <div className=" flex md:flex-row flex-col h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ">
          {/* Navbar */}
          <div className="hidden md:block">
            <Navbar />
          </div>

          {/* Page Content */}
          <main className="flex-1 bg-main-background">
            <div className="max-w-full mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AuthProviderServer>
  );
}
