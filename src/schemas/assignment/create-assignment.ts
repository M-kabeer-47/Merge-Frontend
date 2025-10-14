import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less")
    .trim(),
  points: z
    .number()
    .min(0, "Points must be a positive number")
    .max(1000, "Points cannot exceed 1000"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine((date) => {
      const dueDate = new Date(date);
      const now = new Date();
      return dueDate > now;
    }, "Due date must be in the future"),
  allowLateSubmissions: z.boolean(),
  attachments: z.array(z.instanceof(File)),
});

export type CreateAssignmentType = z.infer<typeof createAssignmentSchema>;
