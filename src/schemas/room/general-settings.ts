import { z } from "zod";

export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 1000;

export const generalSettingsSchema = z.object({
  title: z
    .string()
    .min(1, "Room title is required")
    .min(3, "Title must be at least 3 characters")
    .max(
      MAX_TITLE_LENGTH,
      `Title must not exceed ${MAX_TITLE_LENGTH} characters`
    ),
  description: z
    .string()
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`
    )
    .optional()
    .default(""),
  tags: z.string().optional().default(""),
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;
