import z from "zod";

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Note title is required")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .optional(),
  folderId: z.string().optional().nullable(),
});

export type UpdateNoteType = z.infer<typeof updateNoteSchema>;
