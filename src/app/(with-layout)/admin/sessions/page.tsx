"use client";

import { useEffect, useState } from "react";
import {
  PageHeader, Card, Table, THead, Th, Tr, Td, Badge, Pagination,
} from "@/components/admin/AdminUI";
import { listLiveSessions, listSessionHistory } from "@/server-api/admin";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

export default function AdminSessionsPage() {
  const [live, setLive] = useState<any[]>([]);
  const [history, setHistory] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  // Auto-refresh "live now" every 30s
  useEffect(() => {
    const fetchLive = () => listLiveSessions().then((d) => setLive(d ?? []));
    fetchLive();
    const id = setInterval(fetchLive, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    listSessionHistory(page).then((d) => setHistory(d));
  }, [page]);

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Live Sessions"
        subtitle="Currently running sessions and recent history."
      />

      {/* Live now */}
      <Card title={`Live now (${live.length})`}>
        {live.length === 0 ? (
          <p className="text-sm text-para-muted">No active sessions.</p>
        ) : (
          <Table>
            <THead>
              <tr>
                <Th>Session</Th><Th>Room</Th><Th>Host</Th><Th>Attendees</Th><Th>Started</Th>
              </tr>
            </THead>
            <tbody>
              {live.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                      </span>
                      <span className="font-medium text-heading">{s.title}</span>
                    </div>
                  </Td>
                  <Td className="text-sm">{s.room?.title ?? "—"}</Td>
                  <Td>{s.host ? `${s.host.firstName} ${s.host.lastName}` : "—"}</Td>
                  <Td><Badge tone="info">{s.attendeeCount}</Badge></Td>
                  <Td className="text-xs text-para-muted">
                    {s.startedAt ? formatDistanceToNow(new Date(s.startedAt), { addSuffix: true }) : "—"}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* History */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-heading">Session history</h2>
        {!history ? (
          <p className="text-sm text-para-muted">Loading…</p>
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>Session</Th><Th>Room</Th><Th>Host</Th><Th>Status</Th><Th>Duration</Th><Th>Ended</Th>
                </tr>
              </THead>
              <tbody>
                {history.sessions?.map((s: any) => (
                  <Tr key={s.id}>
                    <Td className="font-medium text-heading">{s.title}</Td>
                    <Td className="text-sm">{s.room?.title ?? "—"}</Td>
                    <Td>{s.host ? `${s.host.firstName} ${s.host.lastName}` : "—"}</Td>
                    <Td>
                      <Badge tone={s.status === "ended" ? "neutral" : "destructive"}>{s.status}</Badge>
                    </Td>
                    <Td className="text-sm text-para-muted">
                      {s.durationMinutes ? `${s.durationMinutes} min` : "—"}
                    </Td>
                    <Td className="text-xs text-para-muted">
                      {s.endedAt ? format(new Date(s.endedAt), "dd MMM yyyy HH:mm") : "—"}
                    </Td>
                  </Tr>
                ))}
                {history.sessions?.length === 0 && (
                  <Tr><Td className="text-center text-para-muted">No past sessions.</Td></Tr>
                )}
              </tbody>
            </Table>
            <Pagination page={history?.page ?? 1} totalPages={history?.totalPages ?? 1} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
