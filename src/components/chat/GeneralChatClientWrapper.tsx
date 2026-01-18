"use client";

import GeneralChatClient from "./GeneralChatClient";

interface GeneralChatClientWrapperProps {
  roomId: string;
}

export default function GeneralChatClientWrapper({ roomId }: GeneralChatClientWrapperProps) {
  return <GeneralChatClient roomId={roomId} />;
}
