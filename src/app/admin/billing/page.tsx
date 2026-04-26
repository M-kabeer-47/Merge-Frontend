"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PageHeader, StatTile, Card, Table, THead, Th, Tr, Td, Badge, Pagination,
} from "@/components/admin/AdminUI";
import {
  listPayments, getRevenueSeries, getSubscriptionsSummary,
} from "@/server-api/admin";
import { format } from "date-fns";

export default function AdminBillingPage() {
  const [revenue, setRevenue] = useState<Array<{ day: string; total: number }>>([]);
  const [subs, setSubs] = useState<any | null>(null);
  const [payments, setPayments] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getRevenueSeries(30).then((d) => setRevenue(d ?? []));
    getSubscriptionsSummary().then((d) => setSubs(d));
  }, []);

  useEffect(() => {
    listPayments({ page, limit: 20 }).then((d) => setPayments(d));
  }, [page]);

  const totalRevenue = useMemo(
    () => revenue.reduce((a, r) => a + Number(r.total ?? 0), 0),
    [revenue],
  );
  const maxRevenue = useMemo(
    () => Math.max(1, ...revenue.map((r) => Number(r.total ?? 0))),
    [revenue],
  );

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Billing"
        subtitle="Revenue, subscriptions, and payment history."
      />

      {/* Subscription summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatTile label="Active" value={subs?.active ?? 0} accent="success" />
        <StatTile label="Trialing" value={subs?.trialing ?? 0} accent="info" />
        <StatTile label="Cancelled" value={subs?.cancelled ?? 0} accent="accent" />
        <StatTile label="Past due" value={subs?.past_due ?? 0} accent="destructive" />
        <StatTile label="Expired" value={subs?.expired ?? 0} accent="primary" />
      </div>

      {/* Revenue chart */}
      <Card title="Revenue last 30 days">
        <div className="mb-4 flex items-baseline gap-3">
          <p className="font-raleway text-2xl font-bold text-heading">
            PKR {totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-para-muted">total in window</p>
        </div>
        {revenue.length === 0 ? (
          <p className="text-sm text-para-muted">No paid invoices in this window.</p>
        ) : (
          <div className="flex items-end gap-1 h-48">
            {revenue.map((r) => {
              const pct = (Number(r.total) / maxRevenue) * 100;
              return (
                <div
                  key={r.day}
                  className="flex-1 flex flex-col items-center justify-end gap-1"
                  title={`${r.day}: PKR ${Number(r.total).toLocaleString()}`}
                >
                  <div
                    className="w-full bg-primary/80 rounded-t-md transition-all"
                    style={{ height: `${pct}%`, minHeight: "2px" }}
                  />
                  <span className="text-[9px] text-para-muted rotate-[-45deg] origin-top-left whitespace-nowrap">
                    {r.day.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Payments table */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-heading">All payments</h2>
        {!payments ? (
          <p className="text-sm text-para-muted">Loading…</p>
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <Th>User</Th><Th>Plan</Th><Th>Amount</Th><Th>Status</Th><Th>Order</Th><Th>Paid at</Th>
                </tr>
              </THead>
              <tbody>
                {payments.payments?.map((p: any) => (
                  <Tr key={p.id}>
                    <Td>
                      <div className="font-medium text-heading">{p.user?.firstName} {p.user?.lastName}</div>
                      <div className="text-xs text-para-muted">{p.user?.email}</div>
                    </Td>
                    <Td>{p.plan?.displayName ?? "—"}</Td>
                    <Td className="font-semibold text-heading">PKR {p.amountPkr.toLocaleString()}</Td>
                    <Td>
                      <Badge tone={p.status === "paid" ? "success" : p.status === "failed" ? "destructive" : "neutral"}>
                        {p.status}
                      </Badge>
                    </Td>
                    <Td><code className="text-xs font-mono text-para-muted">{p.lsOrderId ?? "—"}</code></Td>
                    <Td className="text-xs text-para-muted">{p.paidAt ? format(new Date(p.paidAt), "dd MMM yyyy HH:mm") : "—"}</Td>
                  </Tr>
                ))}
                {payments.payments?.length === 0 && (
                  <Tr><Td className="text-center text-para-muted">No payments yet.</Td></Tr>
                )}
              </tbody>
            </Table>
            <Pagination page={payments.page} totalPages={payments.totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
