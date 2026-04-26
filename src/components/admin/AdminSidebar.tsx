"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Trophy } from "lucide-react";

const NAV: Array<{ href: string; label: string; icon: React.ElementType }> = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/rewards", label: "Rewards", icon: Trophy },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-shrink-0 flex-col border-r border-light-border bg-background">
      <div className="px-5 py-5 border-b border-light-border">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-para-muted">
          Admin Panel
        </p>
        <h2 className="mt-1 font-raleway text-base font-bold text-heading">
          Platform Console
        </h2>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-para hover:bg-secondary/10 hover:text-heading"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-light-border p-4">
        <Link
          href="/admin-login"
          className="text-xs font-medium text-para-muted hover:text-heading"
        >
          ← Sign out
        </Link>
      </div>
    </aside>
  );
}
