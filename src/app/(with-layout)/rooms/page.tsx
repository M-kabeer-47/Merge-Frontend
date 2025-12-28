"use client";
import React, { useState, useMemo } from "react";
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
import useGetUserRooms from "@/hooks/rooms/use-get-user-rooms";
import { Button } from "@/components/ui/Button";

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "joined" | "my-rooms">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
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

  const { rooms, counts, isLoading } = useGetUserRooms({
    filter: filterMap[activeTab],
    search: searchTerm,
  });

  // Tab counts from API data
  const tabOptions = useMemo(() => {
    return [
      {
        key: "all",
        label: "All Rooms",
        count: counts.total,
      },
      {
        key: "joined",
        label: "Joined",
        count: counts.joined,
      },
      {
        key: "my-rooms",
        label: "My Rooms",
        count: counts.created,
      },
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
    // Implement join room logic
  };

  const handleViewRoom = (roomId: string) => {
    console.log("Viewing room:", roomId);
    // Navigate to room details
  };

  const handleEditRoom = (roomId: string) => {
    console.log("Editing room:", roomId);
    // Navigate to room edit
  };

  const handleRoomCreated = (room: any) => {
    console.log("Room created:", room);
    // Optionally refresh the room list or add the new room to the state
    // For now, you might want to refetch or navigate to the new room
  };

  const handleJoinRequestSent = (room: any) => {
    console.log("Join request sent:", room);
    // Optionally show a notification or update UI
  };

  return (
    <div className="sm:px-6 px-4 sm:py-6 py-4 min-h-screen bg-main-background space-y-6">
      {/* Page Header - Simple fade in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
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
            className="px-4 py-2 rounded-lg font-medium  transition-colors flex items-center gap-2"
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

      {/* Controls - No animation */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Tabs */}
        <div className="w-full flex-1 lg:max-w-lg">
          <Tabs
            options={tabOptions}
            activeKey={activeTab}
            onChange={(string) =>
              setActiveTab(string as "all" | "joined" | "my-rooms")
            }
          />
        </div>

        {/* Search */}
        <div className="lg:w-80">
          <SearchBar onSearch={setSearchTerm} placeholder="Search rooms..." />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-background rounded-xl p-6 animate-pulse border border-light-border"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length > 0 ? (
        // Room Grid - No stagger, just CSS fade
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onJoin={handleJoinRoom}
              onView={handleViewRoom}
              onEdit={handleEditRoom}
              onDelete={setRoomToDelete}
            />
          ))}
        </div>
      ) : (
        // Empty State - Simple animation
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <div className="mb-6">
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
          </div>
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
        </div>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRoomCreated}
      />

      {/* Join Room Modal */}
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSuccess={handleJoinRequestSent}
      />

      {/* Delete Room Modal */}
      <DeleteRoomModal
        isOpen={!!roomToDelete}
        onClose={() => setRoomToDelete(null)}
        roomId={roomToDelete?.id || null}
        roomTitle={roomToDelete?.title || ""}
        filter={filterMap[activeTab]}
        search={searchTerm}
      />
    </div>
  );
}
