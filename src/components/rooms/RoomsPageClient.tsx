"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import CreateRoomModal from "@/components/rooms/CreateRoomModal";
import JoinRoomModal from "@/components/rooms/JoinRoomModal";
import DeleteRoomModal from "@/components/rooms/DeleteRoomModal";
import { Button } from "@/components/ui/Button";
import { RoomActionsProvider } from "@/contexts/RoomActionsContext";
import type { Room } from "@/server-api/rooms";

interface RoomsPageClientProps {
  children: React.ReactNode; // Server component will be passed as children
}

export default function RoomsPageClient({ children }: RoomsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL params
  const filterParam = searchParams.get("filter") || "all";
  const searchParam = searchParams.get("search") || "";

  // Validate filter
  const validFilter =
    filterParam === "created" || filterParam === "joined" ? filterParam : "all";

  // Local state for UI
  const [activeTab, setActiveTab] = useState<"all" | "joined" | "my-rooms">(
    validFilter === "created"
      ? "my-rooms"
      : validFilter === "joined"
      ? "joined"
      : "all"
  );
  const [searchTerm, setSearchTerm] = useState(searchParam);
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
  const tabOptions = useMemo(
    () => [
      { key: "all", label: "All Rooms" },
      { key: "joined", label: "Joined" },
      { key: "my-rooms", label: "My Rooms" },
    ],
    []
  );

  // Update URL params
  const updateUrlParams = useCallback(
    (params: { filter?: string; search?: string }) => {
      const current = new URLSearchParams(searchParams.toString());

      if (params.filter !== undefined) {
        if (params.filter === "all") {
          current.delete("filter");
        } else {
          current.set("filter", params.filter);
        }
      }

      if (params.search !== undefined) {
        if (params.search) {
          current.set("search", params.search);
        } else {
          current.delete("search");
        }
      }

      router.push(`/rooms?${current.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Handle tab change
  const handleTabChange = (tab: string) => {
    const newTab = tab as "all" | "joined" | "my-rooms";
    setActiveTab(newTab);
    updateUrlParams({ filter: filterMap[newTab] });
  };

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const timeoutId = setTimeout(() => {
        updateUrlParams({ search: value });
      }, 500);
      return () => clearTimeout(timeoutId);
    },
    [updateUrlParams]
  );

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-raleway font-bold text-heading">
            {getPageTitle()}
          </h1>
          <p className="text-para-muted mt-2">
            {activeTab === "all" &&
              "Discover and join collaborative learning rooms"}
            {activeTab === "joined" &&
              "Rooms you're currently participating in"}
            {activeTab === "my-rooms" && "Rooms you've created and manage"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            variant="outline"
            onClick={() => setIsJoinModalOpen(true)}
          >
            <Link className="h-4 w-4" />
            Join Room
          </Button>
          <Button
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <IconPlus className="h-4 w-4" />
            Create Room
          </Button>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"
      >
        <div className="w-full flex-1 lg:max-w-lg">
          <Tabs
            options={tabOptions}
            activeKey={activeTab}
            onChange={handleTabChange}
          />
        </div>
        <div className="lg:w-80">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search rooms..."
            defaultValue={searchTerm}
          />
        </div>
      </motion.div>

      {/* Server Component passed as children */}
      <RoomActionsProvider onDeleteRoom={setRoomToDelete}>
        {children}
      </RoomActionsProvider>

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
