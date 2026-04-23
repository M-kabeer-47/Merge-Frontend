import z from "zod";
export const createAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must be 2000 characters or less")
    .optional(),
  points: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z
      .number()
      .min(0, "Total score must be a positive number")
      .max(1000, "Total score cannot exceed 1000"),
  ),
  scheduledAt: z.string().default(new Date().toISOString()).nullable(),
  endAt: z.string().min(1, "Due date is required"),
  isTurnInLateEnabled: z.boolean(),
});
