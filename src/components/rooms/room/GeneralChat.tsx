// File: src/components/rooms/chat/GeneralChat.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  mockMessages,
  mockUsers,
  ChatMessage,
  currentUserId,
} from "@/lib/constants/mock-chat-data";
import MessageItem from "@/components/chat/MessageItem";
import MessageComposer from "@/components/chat/MesageComposer";
import { AttachmentFile } from "@/components/chat/AttachmentPreview";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";

const GeneralChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (
    content: string,
    replyToId?: string,
    attachments?: AttachmentFile[]
  ) => {
    if (!attachments || attachments.length === 0) {
      // Send message without attachments - show instantly with sending status
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: currentUserId,
        content,
        timestamp: new Date(),
        replyTo: replyToId,
        reactions: [],
        seen: false,
        status: "sending",
      };
      setMessages((prev) => [...prev, newMessage]);

      // Simulate sending (replace with actual API call)
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
          )
        );
      }, 1000);
    } else {
      // Handle attachments - show message instantly with upload progress
      const attachmentType = attachments[0].type;
      const messageId = Date.now().toString();

      if (attachmentType === "image") {
        // For images, create one message with all images
        const newMessage: ChatMessage = {
          id: messageId,
          userId: currentUserId,
          content: content || "",
          timestamp: new Date(),
          replyTo: replyToId,
          reactions: [],
          seen: false,
          status: "sending",
          isUploading: true,
          uploadProgress: 0,
          attachments: attachments.map((att, index) => ({
            id: `att-${messageId}-${index}`,
            name: att.file.name,
            file: att.file,
            type: "image" as const,
            url: att.preview || "",
            size: att.file.size,
            preview: att.preview,
            isUploading: true,
            uploadProgress: 0,
          })),
        };
        setMessages((prev) => [...prev, newMessage]);

        // Upload images with progress tracking
        const uploadedAttachments = await Promise.all(
          attachments.map(async (att: AttachmentFile, index: number) => {
            const uploadedUrl = await uploadToCloudinary({
              file: att.file,
              attachmentType,
              onProgress: (progress) => {
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === messageId && msg.attachments) {
                      const updatedAttachments = [...msg.attachments];
                      if (updatedAttachments[index]) {
                        updatedAttachments[index] = {
                          ...updatedAttachments[index],
                          uploadProgress: progress,
                        };
                      }
                      const overallProgress = Math.round(
                        updatedAttachments.reduce(
                          (sum, a) => sum + (a.uploadProgress || 0),
                          0
                        ) / updatedAttachments.length
                      );
                      return {
                        ...msg,
                        attachments: updatedAttachments,
                        uploadProgress: overallProgress,
                      };
                    }
                    return msg;
                  })
                );
              },
            });

            return {
              ...att,
              url: uploadedUrl,
            };
          })
        );

        // Update message with uploaded URLs
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              return {
                ...msg,
                isUploading: false,
                uploadProgress: 100,
                status: "sent",
                attachments: uploadedAttachments.map((att, index) => ({
                  id: `att-${messageId}-${index}`,
                  name: att.file.name,
                  file: att.file,
                  type: "image" as const,
                  url: att.url,
                  size: att.file.size,
                  preview: att.preview,
                  isUploading: false,
                  uploadProgress: 100,
                })),
              };
            }
            return msg;
          })
        );
      } else {
        // For files, send separate messages for each file
        const newMessages: ChatMessage[] = attachments.map((att, index) => ({
          id: `${messageId}-${index}`,
          userId: currentUserId,
          content: index === 0 ? content : "",
          timestamp: new Date(Date.now() + index),
          replyTo: replyToId,
          reactions: [],
          seen: false,
          status: "sending",
          isUploading: true,
          attachments: [
            {
              id: `att-${messageId}-${index}`,
              name: att.file.name,
              file: att.file,
              type: "file" as const,
              url: "",
              size: att.file.size,
              preview: att.preview,
              isUploading: true,
              uploadProgress: 0,
            },
          ],
        }));
        setMessages((prev) => [...prev, ...newMessages]);

        // Upload files individually with progress
        await Promise.all(
          attachments.map(async (att: AttachmentFile, index: number) => {
            const msgId = `${messageId}-${index}`;
            const uploadedUrl = await uploadToCloudinary({
              file: att.file,
              attachmentType,
              onProgress: (progress) => {
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === msgId && msg.attachments?.[0]) {
                      return {
                        ...msg,
                        attachments: [
                          {
                            ...msg.attachments[0],
                            uploadProgress: progress,
                          },
                        ],
                      };
                    }
                    return msg;
                  })
                );
              },
            });

            // Update message with uploaded URL
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id === msgId) {
                  return {
                    ...msg,
                    isUploading: false,
                    status: "sent",
                    attachments: [
                      {
                        id: `att-${msgId}`,
                        name: att.file.name,
                        file: att.file,
                        type: "file" as const,
                        url: uploadedUrl,
                        size: att.file.size,
                        preview: att.preview,
                        isUploading: false,
                        uploadProgress: 100,
                      },
                    ],
                  };
                }
                return msg;
              })
            );
          })
        );
      }
    }
  };

  const handleReply = (messageId: string) => {
    const messageToReply = messages.find((m) => m.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageToReply);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(undefined);
  };

  // Function to scroll to a specific message
  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add a brief highlight effect
    }
  };

  const getUserById = (userId: string) => {
    return mockUsers.find((user) => user.id === userId);
  };

  return (
    <div className="flex flex-col h-full bg-main-background pb-[80px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Welcome Message */}

        {/* Messages List */}
        <div className="space-y-0 py-5 px-4">
          {messages.map((message) => {
            const user = getUserById(message.userId);
            const replyToMessage = message.replyTo
              ? messages.find((m) => m.id === message.replyTo)
              : undefined;
            const replyToUser = replyToMessage
              ? getUserById(replyToMessage.userId)
              : undefined;

            if (!user) return null;

            return (
              <MessageItem
                key={message.id}
                ref={(el) => {
                  messageRefs.current[message.id] = el;
                }}
                message={message}
                user={user}
                replyToMessage={replyToMessage}
                replyToUser={replyToUser}
                onReply={handleReply}
                onScrollToMessage={scrollToMessage}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="fixed bottom-0 bg-main-background border-t border-light-border w-full ">
        <MessageComposer
          onSendMessage={handleSendMessage}
          replyingTo={replyingTo}
          replyingToUser={
            replyingTo ? getUserById(replyingTo.userId) : undefined
          }
          onCancelReply={handleCancelReply}
        />
      </div>
      {/* Message Composer */}
    </div>
  );
};

export default GeneralChat;
