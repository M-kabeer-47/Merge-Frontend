"use client";

import { useState } from "react";
import CreateRoomModal from "@/components/rooms/modals/CreateRoomModal";
import JoinRoomModal from "@/components/rooms/modals/JoinRoomModal";
import DeleteRoomModal from "@/components/rooms/modals/DeleteRoomModal";
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
  const { updateParams } = useUrlParams({
    basePath: "/rooms",
    defaultValues: { filter: "all", search: "" },
  });

  // Validate filter from server props
  const validFilter =
    initialFilter === "created" || initialFilter === "joined"
      ? initialFilter
      : "all";

  // Local state for UI (tabs map to API filter values)
  const [activeTab, setActiveTab] = useState<"all" | "joined" | "my-rooms">(
    validFilter === "created"
      ? "my-rooms"
      : validFilter === "joined"
        ? "joined"
        : "all",
  );
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Map tab to API filter
  const filterMap: Record<typeof activeTab, "all" | "created" | "joined"> = {
    all: "all",
    "my-rooms": "created",
    joined: "joined",
  };

  // Tab counts
  const tabOptions = [
    { key: "all", label: "All Rooms" },
    { key: "joined", label: "Joined" },
    { key: "my-rooms", label: "My Rooms" },
  ];

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

      {/* Room List - no context wrapper needed */}
      {children}

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
      {/* Delete modal reads state from URL - no props needed */}
      <DeleteRoomModal />
    </div>
  );
}
