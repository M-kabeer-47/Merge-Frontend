"use client";

import { Activity, Bell } from "lucide-react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFetchNotifications } from "@/hooks/notifications/use-fetch-notifications";
import { useRouter } from "next/navigation";
import type { NotificationPayload } from "@/types/notification";

export default function RecentActivity() {
  const router = useRouter();
  const { notifications, isLoading } = useFetchNotifications();

  const recent: NotificationPayload[] = (notifications ?? []).slice(0, 5);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-raleway font-semibold text-heading">
            Recent Activity
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-secondary/10 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="bg-background border border-light-border rounded-xl p-6 text-center flex-1 flex flex-col justify-center">
          <Bell className="w-8 h-8 text-para-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm text-heading font-medium">No recent activity</p>
          <p className="text-xs text-para-muted mt-1">
            Student submissions and questions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2 flex-1">
          {recent.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                if (n.metadata?.actionUrl) router.push(n.metadata.actionUrl);
              }}
              className={`w-full text-left bg-background border rounded-lg p-3 hover:border-primary/30 transition-colors ${
                n.isRead ? "border-light-border" : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    n.isRead ? "bg-para-muted/40" : "bg-primary"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      n.isRead ? "text-para" : "text-heading font-medium"
                    }`}
                  >
                    {n.content}
                  </p>
                  <p className="text-[10px] text-para-muted mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
