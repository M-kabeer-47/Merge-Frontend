"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateRoomModal from "@/components/rooms/modals/CreateRoomModal";
import JoinRoomModal from "@/components/rooms/modals/JoinRoomModal";
import DeleteRoomModal from "@/components/rooms/modals/DeleteRoomModal";
import { RoomsProvider } from "@/contexts/RoomsContext";
import type { Room } from "@/server-api/rooms";
import useUrlParams from "@/hooks/common/use-url-params";
import RoomsHeader from "./RoomsHeader";
import RoomsControls from "./RoomsControls";

interface RoomsPageClientProps {
  children: React.ReactNode;
  initialFilter?: string;
  initialSearch?: string;
}

export default function RoomsPageClient({
  children,
  initialFilter = "all",
  initialSearch = "",
}: RoomsPageClientProps) {
  const router = useRouter();
  const { updateParams } = useUrlParams({ basePath: "/rooms" });
  // Validate filter from server props
  const validFilter =
    initialFilter === "created" || initialFilter === "joined"
      ? initialFilter
      : "all";

  // Local state for UI
  const [activeTab, setActiveTab] = useState<"all" | "joined" | "my-rooms">(
    validFilter === "created"
      ? "my-rooms"
      : validFilter === "joined"
      ? "joined"
      : "all"
  );
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Map tab to API filter
  const filterMap: Record<typeof activeTab, "all" | "created" | "joined"> = {
    all: "all",
    "my-rooms": "created",
    joined: "joined",
  };

  const currentFilter = filterMap[activeTab];

  // Tab counts
  const tabOptions = [
    { key: "all", label: "All Rooms" },
    { key: "joined", label: "Joined" },
    { key: "my-rooms", label: "My Rooms" },
  ];

  // Update URL params

  // Handle tab change
  const handleTabChange = (tab: string) => {
    const newTab = tab as "all" | "joined" | "my-rooms";
    setActiveTab(newTab);
    updateParams({ filter: filterMap[newTab] });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateParams({ search: value });
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "my-rooms":
        return "My Rooms";
      case "joined":
        return "Joined Rooms";
      case "all":
      default:
        return "All Rooms";
    }
  };

  const handleJoinRequestSent = (room: Room) => {
    console.log("Join request sent:", room);
  };

  return (
    <div className="sm:px-6 px-4 sm:py-6 py-4 min-h-screen bg-main-background space-y-6">
      {/* Page Header */}
      <RoomsHeader
        title={getPageTitle()}
        activeTab={activeTab}
        setIsJoinModalOpen={setIsJoinModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />

      {/* Controls */}
      <RoomsControls
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        tabOptions={tabOptions}
      />

      {/* Server Component passed as children */}
      <RoomsProvider
        filter={currentFilter}
        search={searchTerm}
        onDeleteRoom={setRoomToDelete}
      >
        {children}
      </RoomsProvider>

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => setIsCreateModalOpen(false)}
      />
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinRequestSent}
      />
      <DeleteRoomModal
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        roomId={roomToDelete?.id || null}
        roomTitle={roomToDelete?.title || ""}
        filter={currentFilter}
        search={searchTerm}
      />
    </div>
  );
}
