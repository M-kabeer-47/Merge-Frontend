import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-main-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-heading mb-2">Access Denied</h1>
        <p className="text-para-muted mb-6">
          You don't have permission to access this page. Please contact your
          instructor if you believe this is an error.
        </p>
        <Link
          href="/rooms"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Go to Rooms
        </Link>
      </div>
    </div>
  );
}
