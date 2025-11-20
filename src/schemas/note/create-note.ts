import z from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Note title is required")
    .max(200, "Title must not exceed 200 characters"),
  content: z
    .string()
    .min(1, "Content is required"),
  folderId: z.string().optional(),
});

export type CreateNoteType = z.infer<typeof createNoteSchema>;
