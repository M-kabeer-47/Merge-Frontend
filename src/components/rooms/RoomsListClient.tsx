"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "motion/react";
import { IconPlus } from "@tabler/icons-react";
import { Link } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import RoomCard from "@/components/rooms/RoomCard";
import CreateRoomModal from "@/components/rooms/CreateRoomModal";
import JoinRoomModal from "@/components/rooms/JoinRoomModal";
import DeleteRoomModal from "@/components/rooms/DeleteRoomModal";
import { Button } from "@/components/ui/Button";
import type { Room, RoomsResponse } from "@/server-api/rooms";
import RoomsSkeleton from "./RoomsSkeleton";

// Client-side fetch function for React Query
async function fetchRoomsClient(
  filter: string,
  search: string
): Promise<RoomsResponse> {
  const { default: api } = await import("@/utils/api");
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const response = await api.get(`/user/rooms?filter=${filter}${searchParam}`);
  return (
    response.data ?? {
      rooms: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
      filter: "all",
      counts: { created: 0, joined: 0, total: 0 },
    }
  );
}

interface RoomsListClientProps {
  initialFilter: "all" | "created" | "joined";
  initialSearch: string;
}

export default function RoomsListClient({
  initialFilter,
  initialSearch,
}: RoomsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for UI
  const [activeTab, setActiveTab] = useState<"all" | "joined" | "my-rooms">(
    initialFilter === "created"
      ? "my-rooms"
      : initialFilter === "joined"
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

  // Use React Query - data is hydrated from server on first render
  // When filter/search changes, queryKey changes and triggers new fetch
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rooms", currentFilter, searchTerm],
    queryFn: () => fetchRoomsClient(currentFilter, searchTerm),
    // Data is considered fresh, won't refetch on mount if hydrated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get rooms and counts from query data with null safety
  const rooms = data?.rooms ?? [];
  const counts = data?.counts ?? { created: 0, joined: 0, total: 0 };

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

  // Handle search with debounce
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

  // Tab counts from API data
  const tabOptions = useMemo(() => {
    return [
      { key: "all", label: "All Rooms", count: counts.total },
      { key: "joined", label: "Joined", count: counts.joined },
      { key: "my-rooms", label: "My Rooms", count: counts.created },
    ];
  }, [counts]);

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

  const handleJoinRoom = (roomId: string) => {
    console.log("Joining room:", roomId);
  };

  const handleViewRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  const handleEditRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}/settings`);
  };

  const handleJoinRequestSent = (room: Room) => {
    console.log("Join request sent:", room);
  };

  if (isLoading) {
    return <RoomsSkeleton />;
  }

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

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between text-sm text-para-muted"
      ></motion.div>

      {/* Room List or Empty State */}
      {rooms.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delay: 0.3, staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: "easeOut" },
                },
              }}
            >
              <RoomCard
                room={room}
                onJoin={handleJoinRoom}
                onView={handleViewRoom}
                onEdit={handleEditRoom}
                onDelete={setRoomToDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <Image
              src={
                searchTerm
                  ? "/illustrations/no-search-results.png"
                  : "/illustrations/empty-rooms.png"
              }
              alt={searchTerm ? "No search results" : "No rooms"}
              width={160}
              height={160}
              className="object-contain"
            />
          </motion.div>
          <h3 className="text-lg font-semibold text-heading mb-2">
            No rooms found
          </h3>
          <p className="text-para-muted mb-4">
            {searchTerm
              ? `No rooms match your search "${searchTerm}"`
              : "There are no rooms in this category yet"}
          </p>
          {activeTab === "my-rooms" && (
            <Button
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Your First Room
            </Button>
          )}
        </motion.div>
      )}

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
