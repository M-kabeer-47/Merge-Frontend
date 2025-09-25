"use client";
import React from "react";
import { motion } from "motion/react";
import { IconCalendar, IconLock, IconGlobe } from "@tabler/icons-react";
import Avatar from "@/components/ui/Avatar";
import MemberAvatars from "./MembersAvatar";
import { Room } from "@/lib/constants/mockData";

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
    <div
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
              <IconLock className="h-4 w-4 text-para-muted" />
            ) : (
              <IconGlobe className="h-4 w-4 text-para-muted" />
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

        <p className="text-para text-sm line-clamp-2 mb-4">
          {room.description}
        </p>

        {/* Tags */}
        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent/15 text-accent text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {room.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-para-muted text-xs rounded-full font-medium">
                +{room.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between mb-3">
          {/* Creator Info */}
          <div className="flex items-center gap-2">
            <Avatar profileImage={room.createdBy.image} size="md" />
            <div className="text-xs">
              <p className="text-para-muted">Created by</p>
              <p className="text-heading font-medium">{room.createdBy.name}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MemberAvatars members={room.members} maxVisible={4} size="sm" />
              <span className="text-xs text-para-muted">
                {room.members.length} member
                {room.members.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Members Section */}

        <div className="border-t border-gray-100 my-3"></div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <motion.button className="px-4 sm:py-2 py-1.5 bg-white border-2 border-secondary rounded-lg text-primary font-medium transition-colors text-sm w-[40%] hover:bg-secondary/5">
            {room.isOwner ? "Delete" : "Leave"}
          </motion.button>

          <motion.button className="px-4 sm:py-2 py-1.5 bg-primary rounded-lg text-white font-medium transition-colors text-sm w-[60%] hover:bg-primary/90">
            {room.isMember || room.isOwner ? "Enter" : "View"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
