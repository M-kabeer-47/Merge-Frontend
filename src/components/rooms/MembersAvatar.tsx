"use client";
import React from "react";
import Image from "next/image";
import { User } from "@/lib/constants/mock-data";
import Avatar from "../ui/Avatar";

interface MemberAvatarsProps {
  members: User[];
  maxVisible?: number;
  size?: "sm" | "md";
}

export default function MemberAvatars({
  members,
  maxVisible = 4,
  size = "sm",
}: MemberAvatarsProps) {
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = Math.max(0, members.length - maxVisible);

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
  };

  if (members.length === 0) {
    return (
      <div className="flex items-center gap-1">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center`}
        >
          <span className={`${textSizes[size]} text-gray-500 font-medium`}>
            0
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {/* Visible member avatars */}
      <div className="flex -space-x-2">
        {visibleMembers.map((member, index) => (
          <Avatar profileImage={member.image} size={size} key={member.id} />
        ))}
      </div>

      {/* Remaining count */}
      {remainingCount > 0 && (
        <div
          className={`${sizeClasses[size]} rounded-full bg-secondary/10 text-white flex items-center justify-center  border-2 border-light-border ml-1`}
        >
          <span className={`${textSizes[size]} font-medium text-primary`}>
            +{remainingCount > 99 ? "99" : remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}
