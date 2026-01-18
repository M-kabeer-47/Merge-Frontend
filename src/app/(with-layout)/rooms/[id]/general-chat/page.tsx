import GeneralChatDataWrapper from "@/components/chat/GeneralChatDataWrapper";

interface GeneralChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function GeneralChatPage({
  params,
}: GeneralChatPageProps) {
  const { id: roomId } = await params;

  return <GeneralChatDataWrapper roomId={roomId} />;
}
