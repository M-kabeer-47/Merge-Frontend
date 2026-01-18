"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useWebSocketChat } from "@/hooks/general-chat/use-websocket-chat";
import { useFetchMessages } from "@/hooks/general-chat/use-fetch-messages";
import MessageItem from "@/components/chat/MessageItem";
import MessageComposer from "@/components/chat/MesageComposer";
import { AttachmentFile } from "@/components/chat/AttachmentPreview";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import type { ChatMessage, MessageAttachment, ApiChatMessage } from "@/types/general-chat";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

interface GeneralChatClientProps {
  roomId: string;
}

// Transform API message to frontend ChatMessage
function transformMessage(apiMessage: ApiChatMessage): ChatMessage {
  const attachments: MessageAttachment[] = apiMessage.attachmentURL
    ? [
        {
          id: `att-${apiMessage.id}`,
          name: apiMessage.attachmentURL.split("/").pop() || "file",
          type: "file",
          url: apiMessage.attachmentURL,
          size: 0,
        },
      ]
    : [];

  return {
    id: apiMessage.id,
    content: apiMessage.content,
    userId: apiMessage.author.id,
    roomId: apiMessage.room.id,
    replyToId: apiMessage.replyToId,
    attachments,
    createdAt: apiMessage.createdAt,
    updatedAt: apiMessage.updatedAt,
    isEdited: apiMessage.isEdited,
    deletedForEveryone: apiMessage.isDeletedForEveryone,
    user: apiMessage.author,
    status: "sent", // Explicitly set status as sent
    isUploading: false, // Explicitly set uploading as false
  };
}

// Convert mock User interface to MessageUser for compatibility
interface MessageUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

// Mock ChatMessage interface from UI components
interface MockChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions: {
    emoji: string;
    users: string[];
    count: number;
  }[];
  attachments?: {
    id: string;
    name: string;
    file: File;
    type: "image" | "file" | "link";
    url: string;
    size?: number;
    preview?: string;
    uploadProgress?: number;
    isUploading?: boolean;
  }[];
  seen?: boolean;
  seenBy?: string[];
  status?: "sending" | "sent" | "delivered" | "seen";
  uploadProgress?: number;
  isUploading?: boolean;
}

const GeneralChatClient: React.FC<GeneralChatClientProps> = ({ roomId }) => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | undefined>();
  const [editingMessage, setEditingMessage] = useState<ChatMessage | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousScrollHeight = useRef(0);

  // Don't render until we have user info
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Fetch messages with infinite scroll
  const {
    messages: fetchedMessages,
    hasMore,
    isFetchingNextPage,
    fetchNextPage,
  } = useFetchMessages({
    roomId,
    limit: 20,
  });

  // WebSocket connection
  const {
    isConnected,
    sendMessage,
    updateMessage: wsUpdateMessage,
    deleteForMe: wsDeleteForMe,
    deleteForEveryone: wsDeleteForEveryone,
    error: wsError,
  } = useWebSocketChat({
    roomId,
    onNewMessage: (message) => {
      console.log("📨 New message from WebSocket:", message);
      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        const exists = prev.some((m) => m.id === message.id);
        if (exists) {
          console.log("Message already exists, skipping");
          return prev;
        }
        
        // Check if this is replacing a temp message (for own messages)
        // Find the most recent temp message from the same user
        const tempMessageIndex = prev.findIndex(
          (m) => m.id.startsWith('temp-') && m.userId === message.userId
        );
        
        if (tempMessageIndex !== -1) {
          console.log("Replacing temp message at index:", tempMessageIndex, "with real message:", message);
          // Replace the temp message with the real one
          const newMessages = [...prev];
          newMessages[tempMessageIndex] = message;
          return newMessages;
        }
        
        console.log("Adding new message from others:", message);
        return [...prev, message];
      });
    },
    onMessageUpdated: (message) => {
      console.log("✏️ Message updated from WebSocket:", message);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m))
      );
    },
    onMessageDeleted: ({ messageId }) => {
      console.log("🗑️ Message deleted from WebSocket:", messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    },
    onError: (error) => {
      console.error("❌ WebSocket error:", error);
      toast.error(error.error || "An error occurred");
    },
  });

  // Show WebSocket connection error
  useEffect(() => {
    if (wsError) {
      toast.error(wsError);
    }
  }, [wsError]);

  // Initialize messages from fetched data (reverse to show oldest first)
  useEffect(() => {
    if (fetchedMessages.length > 0) {
      setMessages([...fetchedMessages].reverse());
    }
  }, [fetchedMessages.length]);

  // Auto-scroll to bottom when new messages arrive (only for new messages, not initial load)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if user was at the bottom before new message
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle infinite scroll - load more messages when scrolling up
  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container) {
      console.log("No container ref");
      return;
    }
    
    console.log("Scroll event:", {
      scrollTop: container.scrollTop,
      hasMore,
      isFetchingNextPage,
      isLoadingMore,
    });

    if (!hasMore) {
      console.log("No more messages to load");
      return;
    }
    
    if (isFetchingNextPage || isLoadingMore) {
      console.log("Already fetching");
      return;
    }

    // Check if user scrolled to top (within 100px)
    if (container.scrollTop < 100) {
      console.log("At top, fetching next page...");
      setIsLoadingMore(true);
      previousScrollHeight.current = container.scrollHeight;

      await fetchNextPage();

      // Maintain scroll position after loading more messages
      setTimeout(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight.current;
        }
        setIsLoadingMore(false);
      }, 100);
    }
  }, [hasMore, isFetchingNextPage, isLoadingMore, fetchNextPage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleSendMessage = async (
    content: string,
    replyToId?: string,
    attachments?: AttachmentFile[]
  ) => {
    if (!currentUser) {
      toast.error("You must be logged in to send messages");
      return;
    }

    try {
      if (!attachments || attachments.length === 0) {
        // Send text-only message
        const tempId = `temp-${Date.now()}`;
        const tempMessage: ChatMessage = {
          id: tempId,
          userId: currentUser.id,
          roomId,
          content,
          replyToId: replyToId || null,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isEdited: false,
          deletedForEveryone: false,
          user: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            image: currentUser.image,
          },
          status: "sending",
        };

        // Optimistically add message to UI
        setMessages((prev) => [...prev, tempMessage]);

        // Send via WebSocket
        const response = await sendMessage({
          roomId,
          content,
          replyToId,
        });

        // The real message will come via WebSocket onNewMessage and replace the temp message
        if (response.message) {
          console.log("✅ Message sent:", response.message);
        }
      } else {
        // Handle attachments - upload first, then send
        const attachmentType = attachments[0].type;
        const tempId = `temp-${Date.now()}`;

        if (attachmentType === "image") {
          // For images, create one message with all images
          const tempMessage: ChatMessage = {
            id: tempId,
            userId: currentUser.id,
            roomId,
            content: content || "",
            replyToId: replyToId || null,
            attachments: attachments.map((att, index) => ({
              id: `att-${tempId}-${index}`,
              name: att.file.name,
              type: "image" as const,
              url: att.preview || "",
              size: att.file.size,
              preview: att.preview,
              isUploading: true,
              uploadProgress: 0,
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isEdited: false,
            deletedForEveryone: false,
            user: {
              id: currentUser.id,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              email: currentUser.email,
              image: currentUser.image,
            },
            status: "sending",
            isUploading: true,
            uploadProgress: 0,
          };

          setMessages((prev) => [...prev, tempMessage]);

          // Upload images with progress tracking
          const uploadedAttachments: MessageAttachment[] = await Promise.all(
            attachments.map(async (att: AttachmentFile, index: number) => {
              const uploadedUrl = await uploadToCloudinary({
                file: att.file,
                attachmentType,
                onProgress: (progress) => {
                  setMessages((prev) =>
                    prev.map((msg) => {
                      if (msg.id === tempId && msg.attachments) {
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
                id: `att-${tempId}-${index}`,
                name: att.file.name,
                type: "image" as const,
                url: uploadedUrl,
                size: att.file.size,
              };
            })
          );

          // Send message with uploaded attachments
          const response = await sendMessage({
            roomId,
            content,
            replyToId,
            attachments: uploadedAttachments,
          });

          // The real message will come via WebSocket and replace the temp message
          if (response.message) {
            console.log("✅ Image message sent:", response.message);
          }
        } else {
          // For files, send separate messages for each file
          for (let index = 0; index < attachments.length; index++) {
            const att = attachments[index];
            const fileTempId = `${tempId}-${index}`;

            const tempMessage: ChatMessage = {
              id: fileTempId,
              userId: currentUser.id,
              roomId,
              content: index === 0 ? content : "",
              replyToId: replyToId || null,
              attachments: [
                {
                  id: `att-${fileTempId}`,
                  name: att.file.name,
                  type: "file" as const,
                  url: "",
                  size: att.file.size,
                  isUploading: true,
                  uploadProgress: 0,
                },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isEdited: false,
              deletedForEveryone: false,
              user: {
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                image: currentUser.image,
              },
              status: "sending",
              isUploading: true,
            };

            setMessages((prev) => [...prev, tempMessage]);

            // Upload file
            const uploadedUrl = await uploadToCloudinary({
              file: att.file,
              attachmentType,
              onProgress: (progress) => {
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === fileTempId && msg.attachments?.[0]) {
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

            // Send message with uploaded file
            const response = await sendMessage({
              roomId,
              content: index === 0 ? content : "",
              replyToId,
              attachments: [
                {
                  name: att.file.name,
                  type: "file" as const,
                  url: uploadedUrl,
                  size: att.file.size,
                },
              ],
            });

            // The real message will come via WebSocket and replace the temp message
            if (response.message) {
              console.log("✅ File message sent:", response.message);
            }
          }
        }
      }

      // Clear reply state
      setReplyingTo(undefined);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
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

  const handleEdit = (messageId: string) => {
    const messageToEdit = messages.find((m) => m.id === messageId);
    if (messageToEdit) {
      setEditingMessage(messageToEdit);
      // Clear reply if any
      setReplyingTo(undefined);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(undefined);
  };

  const handleUpdateMessage = async (messageId: string, content: string) => {
    try {
      // Set the message as updating (loading state)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, status: "sending" as const, isEditing: true }
            : m
        )
      );
      
      await wsUpdateMessage({
        messageId,
        roomId,
        content: content.trim(),
      });
      setEditingMessage(undefined);
      // No toast - the message will update via WebSocket
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message");
      // Revert the loading state on error
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, status: "sent" as const, isEditing: false }
            : m
        )
      );
    }
  };

  const handleDeleteForMe = async (messageId: string) => {
    try {
      await wsDeleteForMe({
        messageId,
        roomId,
      });
      toast.success("Message deleted for you");
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleDeleteForEveryone = async (messageId: string) => {
    const confirmed = confirm("Are you sure you want to delete this message for everyone?");
    if (confirmed) {
      try {
        await wsDeleteForEveryone({
          messageId,
          roomId,
        });
        toast.success("Message deleted for everyone");
      } catch (error) {
        console.error("Failed to delete message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Convert ChatMessage user to mock User format for existing UI components
  const convertToMockUser = (messageUser: MessageUser) => ({
    id: messageUser.id,
    name: `${messageUser.firstName} ${messageUser.lastName}`,
    initials: `${messageUser.firstName[0]}${messageUser.lastName[0]}`,
    role: "student" as const,
    isOnline: true,
    avatar: messageUser.image || undefined,
  });

  // Convert API ChatMessage to Mock ChatMessage format for UI components
  const convertToMockMessage = (message: ChatMessage): MockChatMessage => ({
    id: message.id,
    userId: message.userId,
    content: message.content,
    timestamp: new Date(message.createdAt),
    edited: message.isEdited,
    replyTo: message.replyToId || undefined,
    reactions: [],
    attachments: message.attachments.map((att) => ({
      id: att.id,
      name: att.name,
      type: att.type,
      url: att.url,
      size: att.size,
      preview: att.preview,
      uploadProgress: att.uploadProgress,
      isUploading: att.isUploading,
      file: new File([], att.name, { type: "application/octet-stream" }),
    })),
    seen: message.seen,
    status: message.status === "failed" ? "sent" : message.status,
    uploadProgress: message.uploadProgress,
    isUploading: message.isUploading,
  });

  return (
    <div className="flex flex-col h-full bg-main-background">
      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          ⚠️ Connecting to chat server...
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto pb-[120px]"
      >
        {/* Loading More Indicator */}
        {(isLoadingMore || isFetchingNextPage) && (
          <div className="py-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground mt-2">
              Loading more messages...
            </p>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-0 py-5 px-4">
          {messages.map((message) => {
            const user = convertToMockUser(message.user);
            const mockMessage = convertToMockMessage(message);
            const replyToMessage = message.replyToId
              ? messages.find((m) => m.id === message.replyToId)
              : undefined;
            const replyToUser = replyToMessage
              ? convertToMockUser(replyToMessage.user)
              : undefined;
            const mockReplyToMessage = replyToMessage
              ? convertToMockMessage(replyToMessage)
              : undefined;

            return (
              <MessageItem
                key={message.id}
                ref={(el) => {
                  messageRefs.current[message.id] = el;
                }}
                message={mockMessage}
                user={user}
                replyToMessage={mockReplyToMessage}
                replyToUser={replyToUser}
                onReply={handleReply}
                onEdit={handleEdit}
                onDeleteForMe={handleDeleteForMe}
                onDeleteForEveryone={handleDeleteForEveryone}
                onScrollToMessage={scrollToMessage}
                currentUserId={currentUser?.id || ""}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Composer */}
      <div className="fixed bottom-0 left-0 right-0 bg-main-background border-t border-light-border z-10">
        <MessageComposer
          onSendMessage={handleSendMessage}
          replyingTo={replyingTo ? convertToMockMessage(replyingTo) : undefined}
          replyingToUser={
            replyingTo ? convertToMockUser(replyingTo.user) : undefined
          }
          onCancelReply={handleCancelReply}
          editingMessage={editingMessage ? convertToMockMessage(editingMessage) : undefined}
          onCancelEdit={handleCancelEdit}
          onUpdateMessage={handleUpdateMessage}
        />
      </div>
    </div>
  );
};

export default GeneralChatClient;
