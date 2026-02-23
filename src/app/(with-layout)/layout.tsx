import React, { Suspense } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";
import AuthProviderServer from "@/providers/AuthProviderServer";
import { NotificationProvider } from "@/providers/NotificationProvider";
import NotificationTrigger from "@/components/notifications/NotificationTrigger";

export default function WithLayoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProviderServer>
      <NotificationProvider>
        {/* Trigger notification permission if ?askNotifications=true */}
        <Suspense fallback={null}>
          <NotificationTrigger />
        </Suspense>

        <div className="flex md:flex-row flex-col h-screen w-full bg-main-background overflow-hidden">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full">
            {/* Navbar */}
            <div className="hidden md:block">
              <Navbar />
            </div>

            {/* Page Content */}
            <main className="flex-1 bg-main-background overflow-y-auto">
              <div className="max-w-full mx-auto h-full">{children}</div>
            </main>
          </div>
        </div>
      </NotificationProvider>
    </AuthProviderServer>
  );
}
