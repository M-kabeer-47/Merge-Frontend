"use client";
import React, { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";

export default function WithLayoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className=" flex md:flex-row flex-col h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="hidden md:block">
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-main-background">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
