"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function LiveSessionRedirectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomId = params.id as string;
  const sessionId = searchParams.get("sessionId") || "";

  useEffect(() => {
    if (roomId && sessionId) {
      router.replace(`/live/session?roomId=${roomId}&sessionId=${sessionId}`);
    }
  }, [roomId, sessionId, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-[#202124]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/70 text-sm">Redirecting to session...</span>
      </div>
    </div>
  );
}
