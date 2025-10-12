"use client";
import React from "react";
import { motion } from "motion/react";
import Avatar from "@/components/ui/Avatar";
import MemberAvatars from "./MembersAvatar";
import { Room } from "@/lib/constants/mock-data";
import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/Button";
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
  const { width } = useWindowSize();
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
      className="sm:p-6 p-4 bg-background rounded-xl border border-light-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleViewRoom}
    >
      {/* Card Header */}
      <div className="">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-heading group-hover:text-primary transition-colors font-raleway line-clamp-1">
              {room.title}
            </h3>
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
              <span className="px-2 py-1 bg-light-border/50 text-para-muted text-xs rounded-full font-medium">
                +{room.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="py-3 ">
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
              {width && width > 640 ? (
                <MemberAvatars
                  members={room.members}
                  maxVisible={4}
                  size="sm"
                />
              ) : (
                <MemberAvatars
                  members={room.members}
                  maxVisible={2}
                  size="sm"
                />
              )}

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
          <Button
            className="px-4 rounded-lg font-medium transition-colors text-sm w-[40%]"
            variant="outline"
          >
            {room.isOwner ? "Delete" : "Leave"}
          </Button>

          <Button className="px-4 rounded-lg text-white font-medium transition-colors text-sm w-[60%] ">
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
}
