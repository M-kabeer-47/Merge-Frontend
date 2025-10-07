import z from "zod";

export const createRoomSchema = z.object({
  title: z
    .string()
    .min(1, "Room title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  isPublic: z.boolean(),
  tagNames: z.array(z.string()),
});

export type CreateRoomType = z.infer<typeof createRoomSchema>;
