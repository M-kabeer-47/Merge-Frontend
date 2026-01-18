"use client";

import dynamic from "next/dynamic";

// Import GeneralChatClient as client-only to avoid SSR issues with AuthProvider
const GeneralChatClient = dynamic(() => import("./GeneralChatClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

interface GeneralChatClientWrapperProps {
  roomId: string;
}

export default function GeneralChatClientWrapper({ roomId }: GeneralChatClientWrapperProps) {
  return <GeneralChatClient roomId={roomId} />;
}
