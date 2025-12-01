import z from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    image: z.string().optional(),
});

export type UpdateProfileSchemaType = z.infer<typeof updateProfileSchema>;
