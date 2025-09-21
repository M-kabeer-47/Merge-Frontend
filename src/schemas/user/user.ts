import z from "zod";
export const userSchema = z
  .object({
    id: z.string().uuid().optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(30, "First name cannot exceed 30 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(30, "Last name cannot exceed 30 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required")
      .min(8, "Confirm Password must be at least 8 characters"),
    role: z.enum(["student", "instructor"], "Please select a role"),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();
export const partialUserSchema = userSchema.partial();
export type UserType = z.infer<typeof userSchema>;
