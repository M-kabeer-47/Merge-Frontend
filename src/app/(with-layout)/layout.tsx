"use client";
import React, { useState } from "react";
import AppSidebar from "@/components/home/AppSidebar";
import Navbar from "@/components/home/Navbar";

interface UserProfile {
  name: string;
  role: string;
  initials: string;
  avatar?: string;
}

// This would typically come from auth context or API
const getCurrentUser = (): UserProfile => {
  return {
    name: "John Doe",
    role: "Student",
    initials: "JD",
  };
};

export default function WithLayoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const user = getCurrentUser();

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <AppSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar user={user} setIsDarkMode={setIsDarkMode} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
