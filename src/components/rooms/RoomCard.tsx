"use client";
import React from "react";
import { motion } from "motion/react";
import {
  IconUsers,
  IconCalendar,
  IconDots,
  IconLock,
  IconGlobe,
} from "@tabler/icons-react";
import Avatar from "@/components/ui/Avatar";

interface Room {
  id: string;
  title: string;
  description: string;
  memberCount: number;
  maxMembers?: number;
  createdBy: {
    name: string;
    image?: string;
  };
  createdAt: string;
  isPrivate: boolean;
  tags?: string[];
  isOwner?: boolean;
  isMember?: boolean;
}

interface RoomCardProps {
  room: Room;
  onJoin?: (roomId: string) => void;
  onView?: (roomId: string) => void;
  onEdit?: (roomId: string) => void;
}

export default function RoomCard({
  room,
  onJoin,
  onView,
  onEdit,
}: RoomCardProps) {
  const handleJoinRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoin) onJoin(room.id);
  };

  const handleViewRoom = () => {
    if (onView) onView(room.id);
  };

  const getStatusBadge = () => {
    if (room.isOwner) return { text: "Owner", color: "bg-primary text-white" };
    if (room.isMember)
      return { text: "Joined", color: "bg-secondary/10 text-secondary" };
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleViewRoom}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-heading group-hover:text-primary transition-colors font-raleway line-clamp-1">
              {room.title}
            </h3>
            {room.isPrivate ? (
              <IconLock className="h-4 w-4 text-normal-text-muted" />
            ) : (
              <IconGlobe className="h-4 w-4 text-normal-text-muted" />
            )}
          </div>

          {/* Status Badge */}
          {statusBadge && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
            >
              {statusBadge.text}
            </span>
          )}
        </div>

        <p className="text-normal-text text-sm line-clamp-2 mb-4">
          {room.description}
        </p>

        {/* Tags */}
        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {room.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-normal-text-muted text-xs rounded-full font-medium">
                +{room.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <Avatar profileImage={room.createdBy.image} size="sm" />
            <div className="text-xs">
              <p className="text-normal-text-muted">Created by</p>
              <p className="text-heading font-medium">{room.createdBy.name}</p>
            </div>
          </div>

          {/* Members & Date */}
          <div className="flex items-center gap-4 text-xs text-normal-text-muted">
            <div className="flex items-center gap-1">
              <IconUsers className="h-4 w-4" />
              <span>
                {room.memberCount}
                {room.maxMembers ? `/${room.maxMembers}` : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <IconCalendar className="h-4 w-4" />
              <span>{room.createdAt}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 my-3  "></div>
          {/* Action Button */}
          <div className="mt-3 flex gap-2 w-full">
            <motion.button className="px-4 py-2 bg-white border-2 border-secondary rounded-lg text-primary font-medium transition-colors text-sm w-[40%]">
              {room.isOwner ? "Delete" : "Leave"}
            </motion.button>

            <motion.button className="px-4 py-2 bg-primary rounded-lg text-white font-medium transition-colors text-sm w-[60%] hover:bg-primary/90">
              {room.isMember || room.isOwner ? "Enter" : "View"}
            </motion.button>
          </div>
        
      </div>
    </motion.div>
  );
}
