"use client";
import React, { useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";

interface UserProfile {
  name: string;
  role: string;
  initials: string;
  image?: string;
}

// This would typically come from auth context or API
const getCurrentUser = (): UserProfile => {
  return {
    name: "John Doe",
    role: "Student",
    initials: "JD",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
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
    <div className=" flex md:flex-row flex-col h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <AppSidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="hidden md:block">
          <Navbar
            user={user}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
