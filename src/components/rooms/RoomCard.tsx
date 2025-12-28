"use client";
import React from "react";
import Avatar from "@/components/ui/Avatar";
import MemberAvatars from "./MembersAvatar";
import { Room } from "@/hooks/rooms/use-get-user-rooms";
import { useWindowSize } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface RoomCardProps {
  room: Room;
  onJoin?: (roomId: string) => void;
  onView?: (roomId: string) => void;
  onEdit?: (roomId: string) => void;
  onDelete?: (room: { id: string; title: string }) => void;
}

export default function RoomCard({ room, onJoin, onDelete }: RoomCardProps) {
  const { width } = useWindowSize();
  const router = useRouter();

  const handleJoinRoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onJoin) onJoin(room.id);
  };

  const handleViewRoom = () => {
    router.push(`/rooms/${room.id}/general-chat`);
  };

  const getStatusBadge = () => {
    if (room.userRole === "admin")
      return { text: "Owner", color: "bg-primary text-white" };
    if (room.type === "joined")
      return { text: "Joined", color: "bg-secondary/10 text-secondary" };
    return null;
  };

  const statusBadge = getStatusBadge();

  // Get admin full name
  const adminName = `${room.admin.firstName} ${room.admin.lastName}`;

  return (
    <div className="sm:p-6 p-4 bg-background rounded-xl border border-light-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col h-full">
      {/* Top content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-heading group-hover:text-primary transition-colors font-raleway line-clamp-1">
              {room.title}
            </h3>
          </div>
          {statusBadge && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
            >
              {statusBadge.text}
            </span>
          )}
        </div>

        <p className="text-para text-sm line-clamp-3 mb-4">
          {room.description}
        </p>

        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-accent/15 text-accent text-xs rounded-full font-medium"
              >
                {tag.name}
              </span>
            ))}
            {room.tags.length > 3 && (
              <span className="px-2 py-1 bg-light-border/50 text-para-muted text-xs rounded-full font-medium">
                +{room.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-3 mt-auto">
          <div className="flex items-center gap-2">
            <Avatar profileImage={room.admin.image} size="md" />
            <div className="text-xs">
              <p className="text-para-muted">Created by</p>
              <p className="text-heading font-medium">{adminName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {room.members &&
              room.members.length > 0 &&
              (width && width > 640 ? (
                <MemberAvatars
                  members={room.members.map((m) => ({
                    id: m.id,
                    name: `${m.firstName} ${m.lastName}`,
                    image: m.image,
                  }))}
                  maxVisible={4}
                  size="sm"
                />
              ) : (
                <MemberAvatars
                  members={room.members.map((m) => ({
                    id: m.id,
                    name: `${m.firstName} ${m.lastName}`,
                    image: m.image,
                  }))}
                  maxVisible={2}
                  size="sm"
                />
              ))}
            <span className="text-xs text-para-muted">
              {room.memberCount} member{room.memberCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Footer pinned */}
      <div className="mt-auto pt-3">
        <div className="border-t border-gray-100 mb-3"></div>
        <div className="flex gap-2 w-full">
          <Button
            className="px-4 rounded-lg font-medium transition-colors text-sm w-[40%]"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (room.userRole === "admin" && onDelete) {
                onDelete({ id: room.id, title: room.title });
              }
            }}
          >
            {room.userRole === "admin" ? "Delete" : "Leave"}
          </Button>
          <Button
            className="px-4 rounded-lg text-white font-medium transition-colors text-sm w-[60%] "
            onClick={handleViewRoom}
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  );
}
