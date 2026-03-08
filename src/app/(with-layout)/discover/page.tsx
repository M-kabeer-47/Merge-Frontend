"use client";

import { useState, useMemo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchBar from "@/components/ui/SearchBar";
import FilterBar from "@/components/discover/FilterBar";
import RoomGrid from "@/components/discover/RoomGrid";
import RoomPreviewModal from "@/components/discover/room-preview/RoomPreviewModal";
import EmptyState from "@/components/discover/EmptyState";
import LoaderSkeleton from "@/components/discover/LoaderSkeleton";
import { useFetchFeed } from "@/hooks/discover/use-fetch-feed";
import useFetchAvailableTags from "@/hooks/user/use-fetch-available-tags";
import useJoinRoom from "@/hooks/rooms/use-join-room";
import { useAuth } from "@/providers/AuthProvider";
import type { FeedRoom, SortOption } from "@/types/discover";

export default function DiscoverPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedRoom, setSelectedRoom] = useState<FeedRoom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get user tags from auth context
  const userTags = useMemo(() => {
    if (!user?.tags) return [];
    return user.tags.map((t) => t.name);
  }, [user?.tags]);

  // Fetch feed from API
  const { rooms, hasMore, isLoading, isFetchingNextPage, fetchNextPage, total } =
    useFetchFeed({ search: searchQuery || undefined, userTags });

  // Fetch available tags for filter bar
  const { data: availableTags } = useFetchAvailableTags();
  const tagNames = useMemo(
    () => availableTags?.map((t) => t.name) ?? [],
    [availableTags],
  );

  // Join room hook
  const { joinRoom } = useJoinRoom();

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
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

  const handleJoinRoom = useCallback(
    (roomCode: string) => {
      joinRoom({ roomCode });
    },
    [joinRoom],
  );

  const handlePreviewRoom = useCallback((room: FeedRoom) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRoom(null), 300);
  }, []);

  const hasFilters = searchQuery || selectedTags.length > 0;
  const showEmpty = !isLoading && rooms.length === 0;

  return (
    <div className="min-h-screen bg-main-background">
      <div className="sm:px-6 px-4 sm:py-6 py-4 transition-all duration-300 ease-in-out">
        <div>
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

          {/* Filter Bar */}
          <div className="mb-8">
            <FilterBar
              availableTags={tagNames}
              selectedTags={selectedTags}
              sortBy={sortBy}
              onTagToggle={handleTagToggle}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Results Count */}
          {!showEmpty && !isLoading && (
            <div className="mb-4">
              <p className="text-sm text-para-muted">
                Showing {rooms.length} of {total} room
                {total !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Initial Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <LoaderSkeleton key={`initial-skeleton-${i}`} />
              ))}
            </div>
          ) : showEmpty ? (
            <EmptyState
              type="no-results"
              searchQuery={searchQuery}
              onClearFilters={hasFilters ? handleClearFilters : undefined}
            />
          ) : (
            <InfiniteScroll
              dataLength={rooms.length}
              next={() => fetchNextPage()}
              hasMore={!!hasMore}
              loader={
                <div className="grid grid-cols-1 gap-6 mt-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <LoaderSkeleton key={`scroll-skeleton-${i}`} />
                  ))}
                </div>
              }
              endMessage={
                rooms.length > 0 ? (
                  <p className="text-center text-sm text-para-muted py-8">
                    No more rooms to show
                  </p>
                ) : null
              }
            >
              <RoomGrid
                rooms={rooms}
                onJoin={handleJoinRoom}
                onPreview={handlePreviewRoom}
              />
            </InfiniteScroll>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <RoomPreviewModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onJoin={handleJoinRoom}
      />
    </div>
  );
}
