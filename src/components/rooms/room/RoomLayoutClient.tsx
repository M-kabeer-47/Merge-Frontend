"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Bell,
  FileText,
  BookOpen,
  FileQuestion,
  Video,
  Settings,
} from "lucide-react";
import ProfessionalTabs from "@/components/rooms/room/Tabs";
import InviteModal from "@/components/rooms/modals/InviteModal";
import { JoinRequestsModal } from "@/components/rooms/join-requests";
import RoomHeader from "@/components/rooms/RoomHeader";
import { useRoom } from "@/providers/RoomProvider";
import RoomError from "@/components/rooms/Error";
import useFetchJoinRequests from "@/hooks/rooms/use-fetch-join-requests";

const TABS = [
  {
    id: "general-chat",
    label: "General Chat",
    icon: MessageSquare,
    count: 0,
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: Bell,
    count: 0,
  },
  {
    id: "content",
    label: "Content",
    icon: FileText,
    count: 0,
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: BookOpen,
    count: 0,
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: FileQuestion,
    count: 0,
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

export default function RoomLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  const ACTIVE_TAB = [
    "general-chat",
    "announcements",
    "content",
    "assignments",
    "quizzes",
    "sessions",
    "settings",
  ].includes(lastSegment)
    ? lastSegment
    : "general-chat";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(ACTIVE_TAB);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isJoinRequestsModalOpen, setIsJoinRequestsModalOpen] = useState(false);
  const params = useParams();
  const id = (params?.id as string) ?? "";

  // Get room data from context
  const { room, userRole } = useRoom();
  const isInstructor = userRole === "instructor";

  // Fetch join requests for instructors
  const { data: joinRequests } = useFetchJoinRequests({
    roomId: id,
    enabled: isInstructor,
  });
  const pendingRequestsCount =
    joinRequests?.filter((r) => r.status === "pending").length ?? 0;

  // Update active tab based on current route
  useEffect(() => {
    if (!pathname) return;

    const pathSegments = pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === id) {
      setActiveTab("general-chat");
    } else if (
      [
        "general-chat",
        "announcements",
        "content",
        "assignments",
        "quizzes",
        "sessions",
        "settings",
      ].includes(lastSegment)
    ) {
      setActiveTab(lastSegment);
    }
  }, [pathname, id]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/rooms/${id}/${tab}`);
  };

  // Error state
  if (!room) {
    return <RoomError />;
  }

  return (
    <div className="flex flex-col h-full bg-main-background">
      {/* Room Header */}

      <RoomHeader
        onInviteClick={() => setIsInviteModalOpen(true)}
        onJoinRequestsClick={() => setIsJoinRequestsModalOpen(true)}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Tab Bar */}
      <div className="bg-background">
        <ProfessionalTabs
          tabs={TABS}
          roomID={id}
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
          {children}
        </div>
      </main>

      {/* Invite Modal */}
      {room && (
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          roomName={room.title}
        />
      )}

      {/* Join Requests Modal - Instructor Only */}
      {room && isInstructor && (
        <JoinRequestsModal
          isOpen={isJoinRequestsModalOpen}
          onClose={() => setIsJoinRequestsModalOpen(false)}
          roomId={id}
          roomName={room.title}
        />
      )}
    </div>
  );
}
