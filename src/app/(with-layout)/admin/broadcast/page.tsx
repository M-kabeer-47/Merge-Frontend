"use client";

import { useState } from "react";
import {
  PageHeader, Card, Button, Select,
} from "@/components/admin/AdminUI";
import { broadcastMessage } from "@/server-api/admin";
import { toast } from "sonner";
import { Megaphone, Send } from "lucide-react";

const AUDIENCE_OPTIONS = [
  { value: "all", label: "All users" },
  { value: "paid", label: "Paid plans only" },
  { value: "free", label: "Free users only" },
];

export default function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<"all" | "paid" | "free">("all");
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ sent: number; total: number } | null>(null);

  const onSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (!confirm(`Send this notification to ${audience === "all" ? "all users" : audience + " users"}?`)) return;

    setSending(true);
    try {
      const res = await broadcastMessage(message.trim(), audience);
      setLastResult(res);
      toast.success(`Notification sent to ${res.sent} of ${res.total} users`);
      setMessage("");
    } catch (e: any) {
      toast.error(e?.message || "Failed to broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <PageHeader
        title="Broadcast"
        subtitle="Send a system notification to your users. They will receive it in-app and as a push notification."
      />

      <Card>
        <div className="space-y-4">
          <Select
            label="Audience"
            options={AUDIENCE_OPTIONS}
            value={audience}
            onChange={(e) => setAudience(e.target.value as any)}
          />

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-heading">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="Enter your announcement…"
              className="w-full rounded-xl bg-background px-3 py-2 text-sm text-heading ring-1 ring-light-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="mt-1 flex justify-end text-[11px] text-para-muted">
              {message.length} / 500
            </div>
          </label>

          <div className="rounded-xl bg-accent/5 p-4 ring-1 ring-accent/20">
            <div className="flex items-start gap-3">
              <Megaphone className="h-4 w-4 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-heading">Heads up</p>
                <p className="mt-1 text-xs text-para-muted">
                  Each broadcast creates one notification per recipient. This action cannot be undone — recipients will be notified immediately.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSend} disabled={sending || !message.trim()}>
              <Send className="h-4 w-4" />
              {sending ? "Sending…" : "Send broadcast"}
            </Button>
          </div>
        </div>
      </Card>

      {lastResult && (
        <Card>
          <div className="text-sm">
            <p className="font-semibold text-heading">Last broadcast</p>
            <p className="mt-1 text-para-muted">
              Delivered to <strong className="text-heading">{lastResult.sent}</strong> of{" "}
              <strong className="text-heading">{lastResult.total}</strong> recipients.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
