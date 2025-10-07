"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Users, KeyRound } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { joinRoomSchema, JoinRoomType } from "@/schemas/room/join-room";
import useJoinRoom from "@/hooks/rooms/join-room";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (room: any) => void;
}

export default function JoinRoomModal({
  isOpen,
  onClose,
  onSuccess,
}: JoinRoomModalProps) {
  const { joinRoom, isJoining, isJoinSuccess } = useJoinRoom();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<JoinRoomType>({
    resolver: zodResolver(joinRoomSchema),
    mode: "onChange",
    defaultValues: {
      roomCode: "",
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // Handle success
  useEffect(() => {
    if (isJoinSuccess) {
      setTimeout(() => {
        onClose();
        reset();
        onSuccess?.(null);
      }, 500);
    }
  }, [isJoinSuccess, onClose, reset, onSuccess]);

  const onSubmit = async (data: JoinRoomType) => {
    await joinRoom(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join a Room"
      description="Enter the room code to send a join request"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Room Code Icon */}

        {/* Info Banner */}
        <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 flex items-start gap-3">
          <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="sm:text-sm text-xs">
            <p className="text-para font-medium mb-1">Join Request</p>
            <p className="text-para-muted">
              Your request will be sent to the room owner for approval. You'll
              be notified once accepted.
            </p>
          </div>
        </div>

        {/* Room Code Input */}
        <div>
          <Controller
            name="roomCode"
            control={control}
            render={({ field }) => (
              <FormField
                label="Room Code"
                htmlFor="roomCode"
                error={errors.roomCode?.message}
              >
                <Input
                  {...field}
                  id="roomCode"
                  type="text"
                  placeholder="e.g., ABC12345"
                  maxLength={8}
                  className="uppercase font-mono text-lg tracking-wider"
                  error={errors.roomCode?.message}
                  disabled={isJoining}
                  onChange={(e) => {
                    // Auto-uppercase the input
                    field.onChange(e.target.value.toUpperCase());
                  }}
                />
                <p className="text-xs text-para-muted mt-2">
                  Enter the 6-8 character room code provided by the room owner
                </p>
              </FormField>
            )}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isJoining}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isJoining || !isValid}
            className="flex-1 bg-primary text-white hover:bg-primary/90"
          >
            {isJoining ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              "Send Join Request"
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-para-muted pt-2 border-t border-light-border">
          Don't have a room code?{" "}
          <button
            type="button"
            onClick={onClose}
            className="text-primary hover:underline font-medium"
          >
            Browse public rooms
          </button>
        </div>
      </form>
    </Modal>
  );
}
