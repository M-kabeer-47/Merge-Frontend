import SettingsDataWrapper from "@/components/rooms/settings/SettingsDataWrapper";

interface RoomSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomSettingsPage({
  params,
}: RoomSettingsPageProps) {
  const { id: roomId } = await params;

  return <SettingsDataWrapper roomId={roomId} />;
}
