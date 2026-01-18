import GeneralChatClientWrapper from "./GeneralChatClientWrapper";

interface GeneralChatDataWrapperProps {
  roomId: string;
}

/**
 * Server component wrapper for general chat.
 * Delegates to client component to avoid SSR/hydration issues.
 */
export default function GeneralChatDataWrapper({
  roomId,
}: GeneralChatDataWrapperProps) {
  return <GeneralChatClientWrapper roomId={roomId} />;
}
