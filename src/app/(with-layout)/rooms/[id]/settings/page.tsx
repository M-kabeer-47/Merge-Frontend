import SettingsDataWrapper from "@/components/rooms/settings/SettingsDataWrapper";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomSettingsPage({ params }: PageProps) {
  const { id: roomId } = await params;

  return (
    <div className="min-h-screen bg-main-background">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <SettingsDataWrapper roomId={roomId} />
      </div>
    </div>
  );
}
