"use client";

import { useEffect, useState } from "react";
import {
  PageHeader, Card, Table, THead, Th, Tr, Td, Badge, Button, Modal, Input, Select, Pagination,
} from "@/components/admin/AdminUI";
import {
  listUsers, getUserDetail, updateUserRole, setUserSuspension,
} from "@/server-api/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "", label: "Any role" },
  { value: "student", label: "Student" },
  { value: "instructor", label: "Instructor" },
  { value: "super_admin", label: "Super admin" },
];
const TIER_OPTIONS = [
  { value: "", label: "Any plan" },
  { value: "free", label: "Free" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "max", label: "Max" },
];

export default function AdminUsersPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [role, setRole] = useState("");
  const [tier, setTier] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    const d = await listUsers({ page, search, role, tier });
    setData(d);
    setLoading(false);
  };
  useEffect(() => { reload(); }, [page, search, role, tier]);

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Users"
        subtitle={data?.total ? `${data.total.toLocaleString()} total users` : "Manage platform users"}
      />

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-9 h-4 w-4 text-para-muted" />
            <Input
              label="Search"
              placeholder="Email or name…"
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setSearch(searchInput); setPage(1); }
              }}
            />
          </div>
          <Select label="Role" options={ROLE_OPTIONS} value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} />
          <Select label="Plan" options={TIER_OPTIONS} value={tier} onChange={(e) => { setTier(e.target.value); setPage(1); }} />
        </div>
      </Card>

      <div>
        {loading ? (
          <p className="text-sm text-para-muted">Loading…</p>
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>User</Th><Th>Role</Th><Th>Plan</Th><Th>Status</Th><Th>Joined</Th>
                </tr>
              </THead>
              <tbody>
                {data?.users?.map((u: any) => (
                  <Tr key={u.id} onClick={() => setSelectedId(u.id)}>
                    <Td>
                      <div className="font-medium text-heading">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-para-muted">{u.email}</div>
                    </Td>
                    <Td>
                      <Badge tone={u.role === "super_admin" ? "destructive" : u.role === "instructor" ? "info" : "neutral"}>
                        {u.role ?? "—"}
                      </Badge>
                    </Td>
                    <Td><Badge tone={u.subscriptionTier === "free" ? "neutral" : "accent"}>{u.subscriptionTier}</Badge></Td>
                    <Td>
                      {u.suspendedAt ? (
                        <Badge tone="destructive">Suspended</Badge>
                      ) : (
                        <Badge tone="success">Active</Badge>
                      )}
                    </Td>
                    <Td className="text-xs text-para-muted">{format(new Date(u.createdAt), "dd MMM yyyy")}</Td>
                  </Tr>
                ))}
                {data?.users?.length === 0 && (
                  <Tr><Td className="text-center text-para-muted">No users match the filter.</Td></Tr>
                )}
              </tbody>
            </Table>
            <Pagination page={data?.page ?? 1} totalPages={data?.totalPages ?? 1} onChange={setPage} />
          </>
        )}
      </div>

      <UserDetailModal
        userId={selectedId}
        onClose={() => setSelectedId(null)}
        onChanged={reload}
      />
    </div>
  );
}

// ─── User detail modal ────────────────────────────────────────────────────────

function UserDetailModal({
  userId,
  onClose,
  onChanged,
}: {
  userId: string | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getUserDetail(userId).then((d) => { setData(d); setLoading(false); });
  }, [userId]);

  const onChangeRole = async (newRole: string) => {
    if (!userId) return;
    try {
      await updateUserRole(userId, newRole);
      toast.success("Role updated");
      const d = await getUserDetail(userId);
      setData(d);
      onChanged();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
  };

  const onToggleSuspend = async () => {
    if (!userId || !data) return;
    const suspending = !data.suspendedAt;
    let reason = "Suspended by admin";
    if (suspending) {
      const r = prompt("Reason for suspension?", reason);
      if (r === null) return;
      reason = r || reason;
    }
    try {
      await setUserSuspension(userId, suspending, reason);
      toast.success(suspending ? "User suspended" : "User reinstated");
      const d = await getUserDetail(userId);
      setData(d);
      onChanged();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
  };

  return (
    <Modal open={!!userId} onClose={onClose} title="User details">
      {loading || !data ? (
        <p className="text-sm text-para-muted">Loading…</p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="font-raleway text-lg font-bold text-heading">{data.firstName} {data.lastName}</p>
            <p className="text-sm text-para-muted">{data.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <Badge tone="neutral">Joined {format(new Date(data.createdAt), "dd MMM yyyy")}</Badge>
              {data.googleAccount && <Badge tone="info">Google account</Badge>}
              {data.suspendedAt && <Badge tone="destructive">Suspended</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-secondary/[0.04] p-3 ring-1 ring-light-border">
              <p className="text-[10px] uppercase text-para-muted">Rooms</p>
              <p className="font-bold text-heading">{data.stats?.ownedRooms ?? 0}</p>
            </div>
            <div className="rounded-xl bg-secondary/[0.04] p-3 ring-1 ring-light-border">
              <p className="text-[10px] uppercase text-para-muted">Badges</p>
              <p className="font-bold text-heading">{data.stats?.badgesCount ?? 0}</p>
            </div>
            <div className="rounded-xl bg-secondary/[0.04] p-3 ring-1 ring-light-border">
              <p className="text-[10px] uppercase text-para-muted">Payments</p>
              <p className="font-bold text-heading">{data.stats?.paymentsCount ?? 0}</p>
            </div>
          </div>

          {data.subscription && (
            <div className="rounded-xl bg-secondary/[0.04] p-4 ring-1 ring-light-border">
              <p className="text-[10px] uppercase text-para-muted mb-1">Subscription</p>
              <div className="text-sm font-medium text-heading">{data.subscription.planName}</div>
              <div className="text-xs text-para-muted">
                Status: {data.subscription.status}
                {data.subscription.currentPeriodEnd && ` · ends ${format(new Date(data.subscription.currentPeriodEnd), "dd MMM yyyy")}`}
              </div>
            </div>
          )}

          <div className="space-y-3 border-t border-light-border pt-4">
            <Select
              label="Role"
              options={ROLE_OPTIONS.filter(o => o.value !== "")}
              value={data.role ?? "student"}
              onChange={(e) => onChangeRole(e.target.value)}
            />
            <Button
              variant={data.suspendedAt ? "primary" : "destructive"}
              onClick={onToggleSuspend}
            >
              {data.suspendedAt ? "Reinstate user" : "Suspend user"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
