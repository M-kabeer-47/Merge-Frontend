"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRoom } from "@/providers/RoomProvider";
import useUpdateRoom from "@/hooks/rooms/use-update-room";

/**
 * Test component to measure optimistic update speed
 * Place this in a room page to test
 */
export default function RoomUpdateTest() {
  const { room } = useRoom();
  const [newTitle, setNewTitle] = useState(room?.title || "");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [uiUpdateTime, setUiUpdateTime] = useState<number | null>(null);

  const { updateRoom, isUpdating } = useUpdateRoom(room?.id || "");

  const handleUpdate = async () => {
    if (!room?.id) return;
    setStartTime(Date.now());
    setUiUpdateTime(null);

    try {
      await updateRoom({ title: newTitle });
    } catch (error) {
      // Error handled by hook
    }
  };

  // Track when UI updates (optimistic update should be instant)
  const currentTitle = room?.title;
  if (startTime && !uiUpdateTime && currentTitle === newTitle) {
    setUiUpdateTime(Date.now());
  }

  const uiDelay = startTime && uiUpdateTime ? uiUpdateTime - startTime : null;

  return (
    <div className="p-4 border border-dashed border-green-500 rounded-lg bg-green-500/10 space-y-4">
      <h3 className="font-bold text-green-600">
        🚀 Optimistic Update Test (React Query + Hydration)
      </h3>

      <div className="text-sm space-y-1">
        <p>
          <strong>Current Title (from RoomProvider → React Query):</strong>{" "}
          {room?.title}
        </p>
        <p>
          <strong>Room ID:</strong> {room?.id}
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New title"
          className="flex-1"
        />
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update Title"}
        </Button>
      </div>

      {uiDelay !== null && (
        <div className="p-3 bg-background rounded border">
          <p className="text-sm">
            <strong>UI Update Time:</strong>{" "}
            <span className={uiDelay > 100 ? "text-yellow-500" : "text-green-500"}>
              {uiDelay}ms
            </span>
            {uiDelay < 50 && " ⚡ Instant!"}
          </p>
          <p className="text-xs text-para-muted mt-1">
            This is the optimistic update - UI updates before API call completes.
            Server sync happens in background.
          </p>
        </div>
      )}

      <p className="text-xs text-para-muted">
        With optimistic updates, the title above should change <strong>instantly</strong>{" "}
        when you click update, even before the API responds.
      </p>
    </div>
  );
}
