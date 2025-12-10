"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/discover/FilterBar";
import RoomGrid from "@/components/discover/RoomGrid";
import RoomPreviewModal from "@/components/discover/RoomPreviewModal";
import RecommendedRooms from "@/components/discover/RecommendedRooms";
import EmptyState from "@/components/discover/EmptyState";
import { mockRooms, allTags } from "@/lib/constants/discover-mock-data";
import type { PublicRoom, SortOption } from "@/types/discover";

const ITEMS_PER_PAGE = 12;

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedRoom, setSelectedRoom] = useState<PublicRoom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let rooms = [...mockRooms];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      rooms = rooms.filter(
        (room) =>
          room.title.toLowerCase().includes(query) ||
          room.description.toLowerCase().includes(query) ||
          room.creator.name.toLowerCase().includes(query) ||
          room.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      rooms = rooms.filter((room) =>
        selectedTags.every((tag) => room.tags.includes(tag))
      );
    }

    // Sort
    rooms.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.lastActiveAt).getTime() -
            new Date(a.lastActiveAt).getTime()
          );
        case "most-active":
          return b.activeNow === a.activeNow ? 0 : b.activeNow ? 1 : -1;
        case "most-members":
          return b.membersCount - a.membersCount;
        default:
          return 0;
      }
    });

    return rooms;
  }, [searchQuery, selectedTags, sortBy]);

  // Get recommended rooms (mock - top 3 most popular active rooms)
  const recommendedRooms = useMemo(() => {
    return mockRooms
      .filter((room) => room.activeNow)
      .sort((a, b) => b.membersCount - a.membersCount)
      .slice(0, 3);
  }, []);

  // Paginated display
  const displayedRooms = filteredRooms.slice(0, displayedCount);
  const hasMore = displayedCount < filteredRooms.length;

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 500 &&
        hasMore &&
        !isLoadingMore
      ) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore]);

  // Reset pagination when filters change
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedTags, sortBy]);

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy("newest");
  }, []);

  const handleJoinRoom = useCallback((roomId: string) => {
    // TODO: Implement join room logic
    console.log("Join room:", roomId);
    alert(`Request to join room ${roomId} sent!`);
  }, []);

  const handlePreviewRoom = useCallback((room: PublicRoom) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRoom(null), 300);
  }, []);

  const handleOpenFullRoom = useCallback((roomId: string) => {
    // TODO: Navigate to full room page
    console.log("Open full room:", roomId);
    window.location.href = `/rooms/${roomId}`;
  }, []);

  const hasFilters = searchQuery || selectedTags.length > 0;
  const showEmpty = filteredRooms.length === 0;

  return (
    <div className="min-h-screen bg-main-background">
      <div className="sm:px-6 px-4 sm:py-6 py-4 transition-all duration-300 ease-in-out">
        <div className="">
          {/* Header */}

          <header className="mb-8">
            <h1 className="text-3xl font-bold text-heading mb-2 font-raleway">
              Discover Rooms
            </h1>
            <p className="text-para-muted">
              Explore public rooms and join communities that match your
              interests
            </p>
            <div className="mb-6 mt-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search rooms by title, creator, or tags..."
              />
            </div>
          </header>

          {/* Recommended Section
          <RecommendedRooms
            rooms={recommendedRooms}
            onRoomClick={handlePreviewRoom}
          /> */}

          {/* Search Bar */}

          {/* Filter Bar */}
          <div className="mb-8">
            <FilterBar
              availableTags={allTags}
              selectedTags={selectedTags}
              sortBy={sortBy}
              onTagToggle={handleTagToggle}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Results Count */}
          {!showEmpty && (
            <div className="mb-4">
              <p className="text-sm text-para-muted">
                Showing {displayedRooms.length} of {filteredRooms.length} room
                {filteredRooms.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Room Grid */}
          {showEmpty ? (
            <EmptyState
              type={mockRooms.length === 0 ? "no-rooms" : "no-results"}
              searchQuery={searchQuery}
              onClearFilters={hasFilters ? handleClearFilters : undefined}
            />
          ) : (
            <RoomGrid
              rooms={displayedRooms}
              loading={isLoadingMore}
              onJoin={handleJoinRoom}
              onPreview={handlePreviewRoom}
            />
          )}

          {/* Load More Indicator */}
          {hasMore && !isLoadingMore && (
            <div className="text-center mt-8">
              <p className="text-sm text-para-muted">
                Scroll down to load more rooms...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <RoomPreviewModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onJoin={handleJoinRoom}
        onOpenFull={handleOpenFullRoom}
      />
    </div>
  );
}
