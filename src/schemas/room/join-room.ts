import { z } from "zod";

export const joinRoomSchema = z.object({
  roomCode: z
    .string()
    .min(1, "Room code is required")
    .regex(/^[A-Z0-9]{6,8}$/, "Room code must be 6-8 characters (letters and numbers)"),
});

export type JoinRoomType = z.infer<typeof joinRoomSchema>;
