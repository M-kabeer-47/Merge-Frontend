import { Button } from "@/components/ui/Button";
import { ChevronLeft, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
export default function RoomSettingsError({ roomID }: { roomID: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full bg-main-background border border-light-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-raleway font-bold text-heading mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-para-muted mb-6">
          You do not have permission to access room settings. Only instructors
          and room owners can modify settings.
        </p>
        <Button
          onClick={() => redirect(`/rooms/${roomID}`)}
          variant="outline"
          className="w-full"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Room
        </Button>
      </div>
    </div>
  );
}
