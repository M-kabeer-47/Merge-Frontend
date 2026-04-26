"use client";
import { ExternalLink, ReceiptText, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { PaymentRecord } from "@/types/subscription";
import { format } from "date-fns";

interface Props {
  payments: PaymentRecord[];
}

const STATUS_META: Record<
  string,
  { label: string; icon: typeof CheckCircle2; chip: string; dot: string }
> = {
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    chip: "bg-success/10 text-success ring-success/20",
    dot: "bg-success",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    chip: "bg-destructive/10 text-destructive ring-destructive/20",
    dot: "bg-destructive",
  },
  refunded: {
    label: "Refunded",
    icon: RotateCcw,
    chip: "bg-secondary/10 text-secondary ring-secondary/20",
    dot: "bg-secondary",
  },
};

export default function PaymentHistoryTable({ payments }: Props) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/5 ring-1 ring-light-border">
          <ReceiptText className="h-6 w-6 text-para-muted opacity-60" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-heading">No payments yet</p>
          <p className="mt-0.5 text-xs text-para-muted">
            Your payment history will appear here once you upgrade.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-light-border">
      {payments.map((p) => {
        const meta = STATUS_META[p.status] ?? STATUS_META.paid;
        const StatusIcon = meta.icon;
        return (
          <li
            key={p.id}
            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/5"
          >
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${meta.chip}`}
            >
              <StatusIcon className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-heading">
                  Rs. {p.amountPkr.toLocaleString()}
                </p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${meta.chip}`}
                >
                  <span className={`h-1 w-1 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-para-muted">
                {p.paidAt
                  ? format(new Date(p.paidAt), "dd MMM yyyy")
                  : "Pending"}
              </p>
            </div>

            {p.invoiceUrl ? (
              <a
                href={p.invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-light-border px-3 py-1.5 text-xs font-medium text-para transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                Invoice <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-xs text-para-muted">—</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
