import RoomSettingsContent from "@/components/rooms/settings/RoomSettingsContent";
import { getRoomMembers } from "@/server-api/rooms";

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomSettingsPage({ params }: SettingsPageProps) {
  const { id: roomId } = await params;
  const members = await getRoomMembers(roomId);

  return <RoomSettingsContent members={members} />;
}
