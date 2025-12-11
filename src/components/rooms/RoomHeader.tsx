import { Users, Video, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { RoomDetails } from "@/hooks/rooms/use-fetch-room-details";

interface RoomHeaderProps {
  room: RoomDetails;
  onInviteClick: () => void;
}

export default function RoomHeader({ room, onInviteClick }: RoomHeaderProps) {
  return (
    <header className="bg-main-background border-b-[0.5px] border-light-border px-4 md:px-6 py-4 md:py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-raleway font-bold text-heading truncate">
              {room.title}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-sm text-para">
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {room.memberCount} participants
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <Button className="px-3 md:px-4">
            <Video className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Start a live session</span>
          </Button>
          <Button
            className="px-3 md:px-4"
            aria-label="Invite participants"
            onClick={onInviteClick}
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden md:inline ml-2">Invite</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
