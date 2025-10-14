"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Bell,
  FileText,
  BookOpen,
  Users,
  Settings,
  UserPlus,
  Video,
} from "lucide-react";
import ProfessionalTabs from "@/components/rooms/room/Tabs";
import { Button } from "@/components/ui/Button";
import InviteModal from "@/components/rooms/InviteModal";

interface RoomLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const RoomLayout: React.FC<RoomLayoutProps> = ({ children, params }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general-chat");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Update active tab based on current route
  useEffect(() => {
    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Map route to tab id
    if (lastSegment === params.id) {
      setActiveTab("general-chat");
    } else if (
      [
        "general-chat",
        "announcements",
        "content",
        "assignments",
        "sessions",
        "settings",
      ].includes(lastSegment)
    ) {
      setActiveTab(lastSegment);
    }
  }, [pathname, params.id]);

  // Mock room data - replace with actual data fetching
  const roomData = {
    id: 1,
    name: "Advanced React Development",
    participantCount: 24,
    unreadCounts: {
      general: 3,
      announcements: 1,
      files: 0,
      assignments: 5,
    },
  };

  const tabs = [
    {
      id: "general-chat",
      label: "General Chat",
      icon: MessageSquare,
      count: roomData.unreadCounts.general,
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: Bell,
      count: roomData.unreadCounts.announcements,
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      count: roomData.unreadCounts.files,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: BookOpen,
      count: roomData.unreadCounts.assignments,
    },
    {
      id: "sessions",
      label: "Sessions",
      icon: Video,
      count: 0,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      count: 0,
    },
  ];

  // Handle tab change with navigation
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/rooms/${params.id}/${tabId}`);
  };

  return (
    <div className="flex flex-col h-full bg-main-background">
      {/* Enhanced Room Header with Gradient Background */}
      <header className="bg-main-background border-b-[0.5px] border-light-border px-4 md:px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-raleway font-bold text-heading truncate">
                {roomData.name}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-2 text-sm text-para">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">
                    {roomData.participantCount} participants
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button>
              <Video className="h-4 w-4" />
              <span className="hidden md:block">Start a live session</span>
            </Button>
            <Button
              className="w-[100px]"
              aria-label="Invite participants"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden md:block">Invite</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Professional Tab Bar */}
      <div className="bg-background">
        <ProfessionalTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div
          className="h-full bg-background"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {children || (
            <div className="flex items-center justify-center h-full text-para-muted">
              <div className="text-center max-w-md mx-auto p-8">
                {tabs.find((tab) => tab.id === activeTab)?.icon && (
                  <div className="mb-6">
                    {React.createElement(
                      tabs.find((tab) => tab.id === activeTab)!.icon,
                      {
                        className: "h-20 w-20 mx-auto text-para-muted/30",
                      }
                    )}
                  </div>
                )}
                <h2 className="text-xl font-raleway font-semibold text-heading mb-3">
                  {tabs.find((tab) => tab.id === activeTab)?.label}
                </h2>
                <p className="text-para-muted leading-relaxed">
                  This section is ready for content. Select a tab component to
                  get started with collaborative learning.
                </p>
                <div className="mt-6 px-4 py-2 bg-gray-50 rounded-lg inline-block">
                  <code className="text-sm text-para">
                    Room ID: {roomData.id}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roomId={params.id}
        roomName={roomData.name}
      />
    </div>
  );
};

export default RoomLayout;
