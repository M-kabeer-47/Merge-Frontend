import z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInType = z.infer<typeof signInSchema>;