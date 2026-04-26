import { getOverview } from "@/server-api/admin";
import { StatTile, PageHeader, Card, Table, THead, Th, Tr, Td, Badge } from "@/components/admin/AdminUI";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getOverview();
  if (!data) {
    return (
      <div className="p-6">
        <PageHeader title="Overview" />
        <p className="text-sm text-para-muted">Failed to load overview.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Overview"
        subtitle="Platform health and key business metrics at a glance."
      />

      {/* Top metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Total users" value={data.totalUsers} accent="primary" />
        <StatTile
          label="Active today"
          value={data.dau}
          hint="Last 24 hours"
          accent="info"
        />
        <StatTile label="Total rooms" value={data.totalRooms} accent="accent" />
        <StatTile
          label="Live sessions now"
          value={data.activeLiveSessions}
          accent="success"
        />
      </div>

      {/* Revenue + badges + alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile
          label="Monthly recurring revenue"
          value={`PKR ${Number(data.mrrPkr).toLocaleString()}`}
          hint="Sum of active subscriptions"
          accent="primary"
        />
        <StatTile
          label="Badges earned this month"
          value={data.badgesEarnedThisMonth}
          accent="accent"
        />
        <StatTile
          label="Failed payments (7d)"
          value={data.failedPaymentsLast7d}
          accent={data.failedPaymentsLast7d > 0 ? "destructive" : "success"}
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent signups">
          {data.recentSignups?.length ? (
            <Table>
              <THead>
                <tr>
                  <Th>User</Th>
                  <Th>Tier</Th>
                  <Th>Joined</Th>
                </tr>
              </THead>
              <tbody>
                {data.recentSignups.map((u: any) => (
                  <Tr key={u.id}>
                    <Td>
                      <div className="font-medium text-heading">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-xs text-para-muted">{u.email}</div>
                    </Td>
                    <Td>
                      <Badge tone={u.subscriptionTier === "free" ? "neutral" : "accent"}>
                        {u.subscriptionTier}
                      </Badge>
                    </Td>
                    <Td className="text-xs text-para-muted">
                      {format(new Date(u.createdAt), "dd MMM yyyy")}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-sm text-para-muted">No signups yet.</p>
          )}
        </Card>

        <Card title="Recent payments">
          {data.recentPayments?.length ? (
            <Table>
              <THead>
                <tr>
                  <Th>User</Th>
                  <Th>Plan</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </tr>
              </THead>
              <tbody>
                {data.recentPayments.map((p: any) => (
                  <Tr key={p.id}>
                    <Td>
                      <div className="text-xs text-para-muted">{p.userEmail}</div>
                    </Td>
                    <Td className="text-xs">{p.planName ?? "—"}</Td>
                    <Td className="font-medium text-heading">
                      PKR {p.amountPkr.toLocaleString()}
                    </Td>
                    <Td>
                      <Badge
                        tone={
                          p.status === "paid"
                            ? "success"
                            : p.status === "failed"
                              ? "destructive"
                              : "neutral"
                        }
                      >
                        {p.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-sm text-para-muted">No payments yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
