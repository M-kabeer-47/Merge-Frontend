"use client";
import React from "react";

export function StatTile({
  label,
  value,
  hint,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "primary" | "accent" | "info" | "success" | "destructive";
}) {
  const accentClass = {
    primary: "text-primary",
    accent: "text-accent",
    info: "text-info",
    success: "text-success",
    destructive: "text-destructive",
  }[accent];
  return (
    <div className="rounded-2xl bg-background p-5 ring-1 ring-light-border">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-para-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-raleway text-2xl font-bold leading-none ${accentClass}`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {hint && <p className="mt-2 text-xs text-para-muted">{hint}</p>}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-raleway text-2xl font-bold text-heading">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-para-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-background ring-1 ring-light-border ${className}`}
    >
      {title && (
        <div className="border-b border-light-border px-5 py-3">
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-background ring-1 ring-light-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-light-border bg-secondary/[0.04]">
      {children}
    </thead>
  );
}

export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-para-muted ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "", colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={`px-4 py-3 text-para ${className}`}>{children}</td>
  );
}

export function Tr({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-light-border/60 last:border-0 ${
        onClick ? "cursor-pointer hover:bg-secondary/[0.03]" : ""
      }`}
    >
      {children}
    </tr>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "info" | "destructive" | "accent";
}) {
  const cls = {
    neutral: "bg-secondary/10 text-para ring-light-border",
    success: "bg-success/10 text-success ring-success/30",
    warning: "bg-accent/10 text-accent ring-accent/30",
    info: "bg-info/10 text-info ring-info/30",
    destructive: "bg-destructive/10 text-destructive ring-destructive/30",
    accent: "bg-accent/10 text-accent ring-accent/30",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${cls}`}
    >
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: {
  variant?: "primary" | "ghost" | "destructive";
  size?: "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeCls = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const variantCls = {
    primary:
      "bg-primary text-white hover:bg-primary/90 disabled:opacity-50",
    ghost:
      "text-para ring-1 ring-light-border hover:bg-secondary/10 disabled:opacity-50",
    destructive:
      "text-destructive ring-1 ring-destructive/30 hover:bg-destructive/10 disabled:opacity-50",
  }[variant];
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition-colors ${sizeCls} ${variantCls} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string },
) {
  const { label, className = "", ...rest } = props;
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-semibold text-heading">
          {label}
        </span>
      )}
      <input
        {...rest}
        className={`w-full rounded-xl bg-background px-3 py-2 text-sm text-heading ring-1 ring-light-border focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      />
    </label>
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    options: Array<{ value: string; label: string }>;
  },
) {
  const { label, options, className = "", ...rest } = props;
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-semibold text-heading">
          {label}
        </span>
      )}
      <select
        {...rest}
        className={`w-full rounded-xl bg-background px-3 py-2 text-sm text-heading ring-1 ring-light-border focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-para">
      <span>
        Page <strong className="text-heading">{page}</strong> of{" "}
        <strong className="text-heading">{totalPages}</strong>
      </span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-background ring-1 ring-light-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-light-border px-5 py-3">
          <h3 className="text-base font-semibold text-heading">{title}</h3>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
