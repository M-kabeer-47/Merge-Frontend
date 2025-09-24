"use client";
import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { IconPlus, IconUsers, IconSearch } from "@tabler/icons-react";
import Tabs from "@/components/ui/Tabs";
import SearchBar from "@/components/ui/SearchBar";
import RoomCard from "@/components/rooms/RoomCard";

// Sample data - this would come from your API
const sampleRooms = [
  {
    id: "1",
    title: "Advanced React Patterns",
    description: "Deep dive into advanced React patterns including hooks, context, and performance optimization techniques.",
    memberCount: 12,
    maxMembers: 20,
    createdBy: { name: "Sarah Chen", image: undefined },
    createdAt: "2 days ago",
    isPrivate: false,
    tags: ["React", "JavaScript", "Frontend"],
    isOwner: false,
    isMember: true
  },
  {
    id: "2", 
    title: "Machine Learning Study Group",
    description: "Weekly discussions on ML algorithms, papers, and practical implementations using Python and TensorFlow.",
    memberCount: 8,
    maxMembers: 15,
    createdBy: { name: "Dr. Michael Rodriguez", image: undefined },
    createdAt: "5 days ago",
    isPrivate: true,
    tags: ["ML", "Python", "TensorFlow", "AI"],
    isOwner: true,
    isMember: true
  },
  {
    id: "3",
    title: "UI/UX Design Workshop",
    description: "Learn modern design principles, create beautiful interfaces, and improve user experience design skills.",
    memberCount: 15,
    maxMembers: 25,
    createdBy: { name: "Emma Thompson", image: undefined },
    createdAt: "1 week ago",
    isPrivate: false,
    tags: ["Design", "UI/UX", "Figma"],
    isOwner: false,
    isMember: false
  },
  {
    id: "4",
    title: "Data Structures & Algorithms",
    description: "Master DSA concepts through collaborative problem solving and code reviews. Perfect for interview prep.",
    memberCount: 20,
    maxMembers: 30,
    createdBy: { name: "John Smith", image: undefined },
    createdAt: "3 days ago",
    isPrivate: false,
    tags: ["DSA", "Programming", "Interview"],
    isOwner: false,
    isMember: true
  },
  {
    id: "5",
    title: "Blockchain Development",
    description: "Explore blockchain technology, smart contracts, and decentralized applications using Solidity and Web3.",
    memberCount: 6,
    maxMembers: 12,
    createdBy: { name: "Alex Kumar", image: undefined },
    createdAt: "1 day ago",
    isPrivate: true,
    tags: ["Blockchain", "Solidity", "Web3"],
    isOwner: false,
    isMember: false
  },
  {
    id: "6",
    title: "System Design Interviews",
    description: "Practice system design problems and learn how to architect scalable distributed systems.",
    memberCount: 18,
    createdBy: { name: "Lisa Wang", image: undefined },
    createdAt: "6 days ago",
    isPrivate: false,
    tags: ["System Design", "Architecture", "Interview"],
    isOwner: true,
    isMember: true
  }
];

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rooms based on active tab
  const filteredRoomsByTab = useMemo(() => {
    switch (activeTab) {
      case "my-rooms":
        return sampleRooms.filter(room => room.isOwner);
      case "joined":
        return sampleRooms.filter(room => room.isMember && !room.isOwner);
      case "all":
      default:
        return sampleRooms;
    }
  }, [activeTab]);

  // Further filter by search term
  const filteredRooms = useMemo(() => {
    if (!searchTerm.trim()) return filteredRoomsByTab;
    
    const searchLower = searchTerm.toLowerCase();
    return filteredRoomsByTab.filter(room =>
      room.title.toLowerCase().includes(searchLower) ||
      room.description.toLowerCase().includes(searchLower) ||
      room.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
      room.createdBy.name.toLowerCase().includes(searchLower)
    );
  }, [filteredRoomsByTab, searchTerm]);

  const tabOptions = [
    { 
      key: "all", 
      label: "All Rooms", 
      count: sampleRooms.length 
    },
    { 
      key: "joined", 
      label: "Joined", 
      count: sampleRooms.filter(room => room.isMember && !room.isOwner).length 
    },
    { 
      key: "my-rooms", 
      label: "My Rooms", 
      count: sampleRooms.filter(room => room.isOwner).length 
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-raleway font-bold text-heading">{getPageTitle()}</h1>
          <p className="text-normal-text-muted mt-2">
            {activeTab === "all" && "Discover and join collaborative learning rooms"}
            {activeTab === "joined" && "Rooms you're currently participating in"}
            {activeTab === "my-rooms" && "Rooms you've created and manage"}
          </p>
        </div>
        
        <motion.button
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <IconPlus className="h-4 w-4" />
          Create Room
        </motion.button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between"
      >
        {/* Tabs */}
        <div className="lg:flex-1 lg:max-w-lg">
          <Tabs
            options={tabOptions}
            activeKey={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Search */}
        <div className="lg:w-[40%]">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search rooms..."
          />
        </div>
      </motion.div>

      {/* Results Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between text-sm text-normal-text-muted"
      >
        <span>
          {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </span>
        {filteredRooms.length > 0 && (
          <span className="flex items-center gap-1">
            <IconUsers className="h-4 w-4" />
            {filteredRooms.reduce((acc, room) => acc + room.memberCount, 0)} total members
          </span>
        )}
      </motion.div>

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <RoomCard
                room={room}
                onJoin={handleJoinRoom}
                onView={handleViewRoom}
                onEdit={handleEditRoom}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconSearch className="h-8 w-8 text-normal-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-heading mb-2">No rooms found</h3>
          <p className="text-normal-text-muted mb-4">
            {searchTerm
              ? `No rooms match your search "${searchTerm}"`
              : "There are no rooms in this category yet"}
          </p>
          {activeTab === "my-rooms" && (
            <motion.button
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Your First Room
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}