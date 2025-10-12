"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import RoomCard from "@/components/rooms/RoomCard";
import type { Room } from "@/lib/constants/mock-data";

export default function MyRooms() {
  const [rooms] = useState<Room[]>([
    {
      id: "1",
      title: "React Dev",
      description: "Advanced React development techniques and best practices",
      members: [
        {
          id: "1",
          name: "Sarah Chen",
          image:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "2",
          name: "Dr. Michael Rodriguez",
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "3",
          name: "Emma Thompson",
          image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "4",
          name: "John Smith",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
      ],
      createdBy: {
        id: "1",
        name: "Sarah Chen",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      },
      createdAt: "2024-01-15",
      isPrivate: false,
      tags: ["React", "JavaScript", "Frontend"],
      isOwner: false,
      isMember: true,
    },
    {
      id: "2",
      title: "ML Study",
      description: "Machine Learning algorithms and data science concepts",
      members: [
        {
          id: "2",
          name: "Dr. Michael Rodriguez",
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "3",
          name: "Emma Thompson",
          image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
      ],
      createdBy: {
        id: "2",
        name: "Dr. Michael Rodriguez",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      createdAt: "2024-01-20",
      isPrivate: false,
      tags: ["Machine Learning", "Python", "Data Science"],
      isOwner: false,
      isMember: true,
    },
    {
      id: "3",
      title: "Data Structure",
      description: "Fundamental data structures and algorithms",
      members: [
        {
          id: "3",
          name: "Emma Thompson",
          image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "4",
          name: "John Smith",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "5",
          name: "Alex Kumar",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        },
      ],
      createdBy: {
        id: "3",
        name: "Emma Thompson",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
      createdAt: "2024-01-25",
      isPrivate: false,
      tags: ["Algorithms", "C++", "Computer Science"],
      isOwner: false,
      isMember: true,
    },
  ]);

  const handleJoinRoom = (roomId: string) => {
    console.log("Join room:", roomId);
    // TODO: Implement join room functionality
  };

  const handleViewRoom = (roomId: string) => {
    console.log("View room:", roomId);
    // TODO: Navigate to room page
  };

  const handleEditRoom = (roomId: string) => {
    console.log("Edit room:", roomId);
    // TODO: Open edit room modal
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Rooms Joined
          </h2>
        </div>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onJoin={handleJoinRoom}
            onView={handleViewRoom}
            onEdit={handleEditRoom}
          />
        ))}
      </div>
    </div>
  );
}
