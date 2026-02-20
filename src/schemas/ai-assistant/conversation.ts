import z from "zod";
import { AttachmentType } from "@/types/ai-chat";

export const createConversationSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters")
    .trim(),
});

export const updateConversationTitleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters")
    .trim(),
});

export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message is required").trim(),
  attachmentS3Url: z.string().url().optional(),
  attachmentType: z.nativeEnum(AttachmentType).optional(),
  attachmentOriginalName: z.string().optional(),
  attachmentFileSize: z.number().optional(),
});

export type CreateConversationType = z.infer<typeof createConversationSchema>;
export type UpdateConversationTitleType = z.infer<
  typeof updateConversationTitleSchema
>;
export type SendMessageType = z.infer<typeof sendMessageSchema>;
