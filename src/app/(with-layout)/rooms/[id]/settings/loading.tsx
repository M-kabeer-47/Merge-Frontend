import { GeneralSettingsFormSkeleton } from "@/components/rooms/settings/general-settings/GeneralSettingsFormSkeleton";

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-main-background">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="space-y-8">
          <GeneralSettingsFormSkeleton />
        </div>
      </div>
    </div>
  );
}
