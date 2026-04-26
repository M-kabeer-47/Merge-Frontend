"use client";

import { useEffect, useState } from "react";
import {
  PageHeader, Card, Table, THead, Th, Tr, Td, Badge, Button, Input, Pagination,
} from "@/components/admin/AdminUI";
import { listAdminRooms, deleteAdminRoom } from "@/server-api/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, Trash2 } from "lucide-react";

export default function AdminRoomsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const reload = async () => {
    setLoading(true);
    const d = await listAdminRooms({ page, search });
    setData(d); setLoading(false);
  };
  useEffect(() => { reload(); }, [page, search]);

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Permanently delete room "${title}"? This cannot be undone.`)) return;
    try {
      await deleteAdminRoom(id);
      toast.success("Room deleted");
      reload();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Rooms"
        subtitle={data?.total ? `${data.total.toLocaleString()} rooms total` : "Manage rooms across the platform"}
      />

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-9 h-4 w-4 text-para-muted" />
            <Input
              label="Search"
              placeholder="Title or description…"
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <p className="text-sm text-para-muted">Loading…</p>
      ) : (
        <>
          <Table>
            <THead>
              <tr>
                <Th>Room</Th><Th>Owner</Th><Th>Code</Th><Th>Visibility</Th><Th>Members</Th><Th>Created</Th><Th></Th>
              </tr>
            </THead>
            <tbody>
              {data?.rooms?.map((r: any) => (
                <Tr key={r.id}>
                  <Td>
                    <div className="font-medium text-heading">{r.title}</div>
                    {r.description && <div className="text-xs text-para-muted">{r.description.slice(0, 60)}{r.description.length > 60 ? "…" : ""}</div>}
                  </Td>
                  <Td>
                    <div className="text-xs text-para-muted">{r.admin?.email ?? "—"}</div>
                  </Td>
                  <Td><code className="text-xs font-mono">{r.roomCode}</code></Td>
                  <Td><Badge tone={r.isPublic ? "info" : "neutral"}>{r.isPublic ? "Public" : "Private"}</Badge></Td>
                  <Td className="font-semibold text-heading">{r.memberCount}</Td>
                  <Td className="text-xs text-para-muted">{format(new Date(r.createdAt), "dd MMM yyyy")}</Td>
                  <Td>
                    <button onClick={() => onDelete(r.id, r.title)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </Td>
                </Tr>
              ))}
              {data?.rooms?.length === 0 && (
                <Tr><Td className="text-center text-para-muted">No rooms.</Td></Tr>
              )}
            </tbody>
          </Table>
          <Pagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onChange={setPage} />
        </>
      )}
    </div>
  );
}
