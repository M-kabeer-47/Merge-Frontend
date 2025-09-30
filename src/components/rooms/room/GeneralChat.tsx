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
      // Send message without attachments
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: currentUserId,
        content,
        timestamp: new Date(),
        replyTo: replyToId,
        reactions: [],
        seen: false, // New messages start as unseen
      };
      setMessages((prev) => [...prev, newMessage]);
    } else {
      // Handle attachments - upload to Cloudinary
      const attachmentType = attachments[0].type;
      const uploadedAttachments = await Promise.all(
        attachments.map(async (att: AttachmentFile) => {
          const uploadedUrl = await uploadToCloudinary(att.file);
          alert("Uploaded " + uploadedUrl);
          return {
            ...att,
            url: uploadedUrl,
          };
        })
      );

      if (attachmentType === "image") {
        // For images, send one message with all images
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          userId: currentUserId,
          content: content || "",
          timestamp: new Date(),
          replyTo: replyToId,
          reactions: [],
          seen: false,
          attachments: uploadedAttachments.map((att, index) => ({
            id: `att-${Date.now()}-${index}`,
            name: att.file.name,
            file: att.file,
            type: "image" as const,
            url: att.url,
            size: att.file.size,
            preview: att.preview,
          })),
        };
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // For files, send separate messages for each file
        const newMessages: ChatMessage[] = uploadedAttachments.map((att, index) => ({
          id: `${Date.now()}-${index}`,
          userId: currentUserId,
          content: index === 0 ? content : "",
          timestamp: new Date(Date.now() + index),
          replyTo: replyToId,
          reactions: [],
          seen: false,
          attachments: [
            {
              id: `att-${Date.now()}-${index}`,
              name: att.file.name,
              file: att.file,
              type: "file" as const,
              url: att.url,
              size: att.file.size,
              preview: att.preview,
            },
          ],
        }));
        setMessages((prev) => [...prev, ...newMessages]);
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
