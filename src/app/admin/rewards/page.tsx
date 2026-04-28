"use client";

import { useEffect, useState } from "react";
import {
  PageHeader, Card, Table, THead, Th, Tr, Td, Badge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import Modal from "@/components/ui/Modal";
import {
  listChallenges, createChallenge, updateChallenge, deleteChallenge,
  listAdminBadges, updateAdminBadge, listAwardedBadges,
} from "@/server-api/admin";
import { Pencil, Trash2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

type Tab = "challenges" | "badges" | "awarded";

const TIER_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "max", label: "Max" },
];

const ROLE_OPTIONS = [
  { value: "all", label: "Both (students + instructors)" },
  { value: "student", label: "Students only" },
  { value: "instructor", label: "Instructors only" },
];

const ACTION_OPTIONS = [
  { value: "calendar_task_completed", label: "Task completed" },
  { value: "note_created", label: "Note created" },
  { value: "room_created", label: "Room created" },
  { value: "room_joined", label: "Room joined" },
  { value: "live_session_attended", label: "Live session attended" },
  { value: "quiz_completed", label: "Quiz completed" },
  { value: "assignment_submitted", label: "Assignment submitted" },
  { value: "focus_score", label: "Focus score" },
];

export default function AdminRewardsPage() {
  const [tab, setTab] = useState<Tab>("challenges");

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Rewards"
        subtitle="Manage challenges, badges, and view who has earned what."
      />

      <div className="flex gap-1 rounded-xl bg-secondary/10 p-1 w-fit">
        {(["challenges", "badges", "awarded"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-background text-heading shadow-sm" : "text-para hover:text-heading"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "challenges" && <ChallengesTab />}
      {tab === "badges" && <BadgesTab />}
      {tab === "awarded" && <AwardedTab />}
    </div>
  );
}

// ─── Challenges tab ───────────────────────────────────────────────────────────

function ChallengesTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await listChallenges();
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onSubmit = async (form: any) => {
    try {
      if (editing) {
        await updateChallenge(editing.id, form);
        toast.success("Challenge updated");
      } else {
        await createChallenge(form);
        toast.success("Challenge created");
      }
      setEditing(null); setCreating(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this challenge?")) return;
    try {
      await deleteChallenge(id);
      toast.success("Challenge deleted");
      await load();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
  };

  return (
    <Card>
      <div className="mb-4 flex justify-end">
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /> New challenge
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-para-muted">Loading…</p>
      ) : (
        <Table>
          <THead>
            <tr>
              <Th>Name</Th><Th>Tier</Th><Th>For</Th><Th>Action</Th><Th>Target</Th><Th>Points</Th><Th>Min plan</Th><Th>Active</Th><Th></Th>
            </tr>
          </THead>
          <tbody>
            {rows.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <div className="font-medium text-heading">{c.name}</div>
                  <div className="text-xs text-para-muted">{c.description}</div>
                </Td>
                <Td><Badge tone="info">{c.tier}</Badge></Td>
                <Td>
                  <Badge tone={c.targetRole === "all" ? "neutral" : "accent"}>
                    {c.targetRole === "student" ? "Students" : c.targetRole === "instructor" ? "Instructors" : "All"}
                  </Badge>
                </Td>
                <Td className="text-xs">{c.actionType}</Td>
                <Td>{c.target}</Td>
                <Td>{c.points}</Td>
                <Td><Badge tone={c.minPlanTier === "free" ? "neutral" : "accent"}>{c.minPlanTier}</Badge></Td>
                <Td>
                  <Badge tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "Yes" : "No"}</Badge>
                </Td>
                <Td>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-secondary/10">
                      <Pencil className="h-4 w-4 text-para" />
                    </button>
                    <button onClick={() => onDelete(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && (
              <Tr><Td className="text-center text-para-muted">No challenges yet.</Td></Tr>
            )}
          </tbody>
        </Table>
      )}

      <ChallengeForm
        open={creating || !!editing}
        initial={editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSubmit={onSubmit}
      />
    </Card>
  );
}

// Convert any input date string (YYYY-MM-DD or YYYY-MM) into a label that
// describes the actual schedule window the backend will compute.
function describeSchedule(tier: string, value: string): string {
  if (!value) return "";
  try {
    if (tier === "daily") {
      const [y, m, d] = value.split("-").map(Number);
      if (!y || !m || !d) return "";
      const date = new Date(Date.UTC(y, m - 1, d));
      return `Runs on ${date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })}`;
    }
    if (tier === "weekly") {
      const [y, m, d] = value.split("-").map(Number);
      if (!y || !m || !d) return "";
      const dt = new Date(Date.UTC(y, m - 1, d));
      const day = dt.getUTCDay();
      const diff = day === 0 ? -6 : 1 - day;
      const mon = new Date(Date.UTC(y, m - 1, d + diff));
      const sun = new Date(mon);
      sun.setUTCDate(sun.getUTCDate() + 6);
      const fmt = (x: Date) =>
        x.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      return `Runs the week of ${fmt(mon)} – ${fmt(sun)}`;
    }
    if (tier === "monthly") {
      const [y, m] = value.split("-").map(Number);
      if (!y || !m) return "";
      const date = new Date(Date.UTC(y, m - 1, 1));
      return `Runs throughout ${date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })}`;
    }
  } catch {
    return "";
  }
  return "";
}

function ChallengeForm({
  open, initial, onClose, onSubmit,
}: {
  open: boolean;
  initial: any | null;
  onClose: () => void;
  onSubmit: (form: any) => void;
}) {
  const [form, setForm] = useState<any>({});
  useEffect(() => {
    if (initial) {
      const periodStartStr = initial.periodStart
        ? new Date(initial.periodStart).toISOString().slice(0, initial.tier === "monthly" ? 7 : 10)
        : "";
      setForm({ ...initial, periodStart: periodStartStr });
    } else {
      setForm({
        name: "", description: "",
        tier: "daily", actionType: "calendar_task_completed",
        target: 1, points: 10, minPlanTier: "free", targetRole: "all", isActive: true,
        periodStart: "",
      });
    }
  }, [initial, open]);

  const handleTierChange = (newTier: string) => {
    setForm({ ...form, tier: newTier, periodStart: "" });
  };

  const isMonthly = (form.tier ?? "daily") === "monthly";
  const dateLabel =
    form.tier === "monthly" ? "Month"
    : form.tier === "weekly" ? "Week (pick any day in the week)"
    : "Date";
  const scheduleHint = describeSchedule(form.tier ?? "daily", form.periodStart ?? "");
  const canSave = !!form.name && !!form.description && !!form.periodStart;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={initial ? "Edit challenge" : "Create challenge"}
      description="Configure the schedule, action, and visibility."
      icon={<div className="rounded-xl bg-primary/10 p-2 text-primary"><Sparkles className="h-5 w-5" /></div>}
      footer={
        <div className="flex justify-end gap-2 px-6 py-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(form)} disabled={!canSave}>Save</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <FormField label="Name" htmlFor="ch-name">
          <Input
            id="ch-name"
            value={form.name ?? ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Task Sprinter"
          />
        </FormField>

        <FormField label="Description" htmlFor="ch-desc">
          <Textarea
            id="ch-desc"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Short, action-oriented sentence shown to users."
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Tier" htmlFor="ch-tier">
            <Select
              id="ch-tier"
              options={TIER_OPTIONS}
              value={form.tier ?? "daily"}
              onChange={(e) => handleTierChange(e.target.value)}
            />
          </FormField>
          <FormField label="Min plan" htmlFor="ch-minplan">
            <Select
              id="ch-minplan"
              options={PLAN_OPTIONS}
              value={form.minPlanTier ?? "free"}
              onChange={(e) => setForm({ ...form, minPlanTier: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="For role" htmlFor="ch-role">
          <Select
            id="ch-role"
            options={ROLE_OPTIONS}
            value={form.targetRole ?? "all"}
            onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
          />
        </FormField>

        <FormField label="Action type" htmlFor="ch-action">
          <Select
            id="ch-action"
            options={ACTION_OPTIONS}
            value={form.actionType ?? "calendar_task_completed"}
            onChange={(e) => setForm({ ...form, actionType: e.target.value })}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Target" htmlFor="ch-target">
            <Input
              id="ch-target"
              type="number"
              min={1}
              value={form.target ?? 1}
              onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
            />
          </FormField>
          <FormField label="Points" htmlFor="ch-points">
            <Input
              id="ch-points"
              type="number"
              min={0}
              value={form.points ?? 0}
              onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
            />
          </FormField>
        </div>

        <FormField label={dateLabel} htmlFor="ch-date">
          <Input
            id="ch-date"
            type={isMonthly ? "month" : "date"}
            value={form.periodStart ?? ""}
            onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
          />
          {scheduleHint && (
            <p className="mt-1 text-[11px] text-para-muted">{scheduleHint}</p>
          )}
        </FormField>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="h-4 w-4 rounded border-light-border accent-primary"
          />
          <span className="text-heading font-medium">Active</span>
        </label>
      </div>
    </Modal>
  );
}

// ─── Badges tab ────────────────────────────────────────────────────────────────

function BadgesTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    setLoading(true);
    const data = await listAdminBadges();
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => { if (editing) setForm({ ...editing }); }, [editing]);

  const onSave = async () => {
    try {
      await updateAdminBadge(editing.id, form);
      toast.success("Badge updated");
      setEditing(null);
      await load();
    } catch (e: any) { toast.error(e?.message || "Failed"); }
  };

  return (
    <Card>
      {loading ? (
        <p className="text-sm text-para-muted">Loading…</p>
      ) : (
        <Table>
          <THead>
            <tr>
              <Th>Name</Th><Th>Tier</Th><Th>Required</Th><Th>Discount %</Th><Th>Active</Th><Th></Th>
            </tr>
          </THead>
          <tbody>
            {rows.map((b) => (
              <Tr key={b.id}>
                <Td>
                  <div className="font-medium text-heading">{b.name}</div>
                  <div className="text-xs text-para-muted">{b.description}</div>
                </Td>
                <Td><Badge tone="info">{b.tier}</Badge></Td>
                <Td>
                  <span className="font-semibold text-heading">{b.requiredCount}</span>
                  <span className="ml-1 text-xs text-para-muted">/ month</span>
                </Td>
                <Td className="font-semibold text-accent">{b.discountPercentage}%</Td>
                <Td><Badge tone={b.isActive ? "success" : "neutral"}>{b.isActive ? "Yes" : "No"}</Badge></Td>
                <Td>
                  <button onClick={() => setEditing(b)} className="p-1.5 rounded-lg hover:bg-secondary/10">
                    <Pencil className="h-4 w-4 text-para" />
                  </button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title="Edit badge"
        description="Tweak the visible badge metadata or its discount."
        footer={
          <div className="flex justify-end gap-2 px-6 py-4">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Name" htmlFor="b-name">
            <Input
              id="b-name"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="Description" htmlFor="b-desc">
            <Textarea
              id="b-desc"
              rows={2}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </FormField>
          <FormField label="Icon (lucide name)" htmlFor="b-icon">
            <Input
              id="b-icon"
              value={form.icon ?? ""}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="e.g. flame, trophy, book-open"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Required completions / month" htmlFor="b-req">
              <Input
                id="b-req"
                type="number"
                min={1}
                value={form.requiredCount ?? 1}
                onChange={(e) => setForm({ ...form, requiredCount: Number(e.target.value) })}
              />
            </FormField>
            <FormField label="Discount %" htmlFor="b-disc">
              <Input
                id="b-disc"
                type="number"
                min={0}
                max={100}
                value={form.discountPercentage ?? 0}
                onChange={(e) => setForm({ ...form, discountPercentage: Number(e.target.value) })}
              />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-light-border accent-primary"
            />
            <span className="text-heading font-medium">Active</span>
          </label>
        </div>
      </Modal>
    </Card>
  );
}

// ─── Awarded tab ───────────────────────────────────────────────────────────────

function AwardedTab() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    listAwardedBadges(page).then((d) => { setData(d); setLoading(false); });
  }, [page]);

  return (
    <Card>
      {loading ? <p className="text-sm text-para-muted">Loading…</p> : (
        <>
          <Table>
            <THead>
              <tr>
                <Th>User</Th><Th>Badge</Th><Th>Month</Th><Th>Code</Th><Th>Status</Th><Th>Earned</Th>
              </tr>
            </THead>
            <tbody>
              {data?.awarded?.map((row: any) => (
                <Tr key={row.id}>
                  <Td>
                    <div className="text-xs text-para-muted">{row.user?.email}</div>
                  </Td>
                  <Td>
                    <span className="font-medium text-heading">{row.badge?.name}</span>
                    <span className="ml-2 text-xs text-accent">{row.badge?.discountPercentage}%</span>
                  </Td>
                  <Td className="text-xs">{format(new Date(row.periodMonth), "MMM yyyy")}</Td>
                  <Td><code className="text-xs font-mono">{row.lsDiscountCode ?? "—"}</code></Td>
                  <Td><Badge tone={row.isRedeemed ? "success" : "neutral"}>{row.isRedeemed ? "Used" : "Unused"}</Badge></Td>
                  <Td className="text-xs text-para-muted">{format(new Date(row.earnedAt), "dd MMM yyyy")}</Td>
                </Tr>
              ))}
              {data?.awarded?.length === 0 && (
                <Tr><Td className="text-center text-para-muted">No badges awarded yet.</Td></Tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Card>
  );
}
