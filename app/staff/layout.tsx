"use client";

// ambagan-web/app/staff/layout.tsx
//
// Console shell for all /staff/* routes — spec §19: "a dedicated internal
// web console with role-based access control, permission scoping, case
// queues, configuration, and immutable audit history."
//
// Real limitation, stated plainly: this wraps in the same <ProtectedRoute>
// as everywhere else (any logged-in user), not a real staff-only gate —
// there's no confirmed backend check for "is this user actually staff."
// The role switcher below lets you preview any of the 11 roles regardless
// of who's logged in; it's a UI demonstration of RBAC-001's permission
// model, not real enforcement. That has to happen server-side.
//
// Also: this still renders inside the public site's root layout.tsx, so
// the public Header (logo, Discover, Log in/out) appears above this
// console nav — same simplification already flagged on the Provider
// portal page. A real internal tool would likely use a separate root
// layout without the public chrome.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { StaffRoleProvider, useStaffRole, STAFF_ROLES } from "@/lib/staff-role-context";
import type { Permission } from "@/lib/staff-rbac";

const NAV: { href: string; label: string; permission: Permission | null }[] = [
  { href: "/staff", label: "Executive Overview", permission: null },
  { href: "/staff/activity", label: "Activity Stream", permission: null },
  { href: "/staff/users", label: "User Search", permission: "support:manage" },
  { href: "/staff/campaigns", label: "Campaign Review Queue", permission: "campaigns:review" },
  { href: "/staff/kyc", label: "KYC Queue", permission: "identity:review_verification" },
  { href: "/staff/compliance", label: "DSWD/Compliance Queue", permission: "dswd:review" },
  { href: "/staff/payments", label: "Payments", permission: "finance:reconcile" },
  { href: "/staff/payouts", label: "Payouts", permission: "payouts:approve" },
  { href: "/staff/patunay", label: "Patunay Queue", permission: "patunay:review" },
  { href: "/staff/trust-safety", label: "Trust & Safety", permission: "trust:invalidate_grant" },
  { href: "/staff/claims", label: "Claims & Disputes", permission: "claims:manage" },
  { href: "/staff/tiwala", label: "Tiwala Administration", permission: "trust:invalidate_grant" },
  { href: "/staff/cms", label: "CMS", permission: "cms:edit" },
  { href: "/staff/config", label: "Configuration", permission: "config:edit" },
  { href: "/staff/roles", label: "Staff & Roles", permission: "staff:manage" },
  { href: "/staff/analytics", label: "Analytics", permission: "analytics:read" },
  { href: "/staff/audit", label: "Audit Logs", permission: "audit:read" },
  { href: "/staff/system", label: "System Health", permission: "system:read" },
];

function ConsoleShell({ children }: { children: React.ReactNode }) {
  const { role, setRole, has } = useStaffRole();
  const pathname = usePathname();

  const visibleNav = NAV.filter((item) => item.permission === null || has(item.permission));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-muted">
            Previewing as
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="mt-1 block w-full border border-line px-2 py-1.5 text-sm text-ink"
          >
            {STAFF_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <nav className="space-y-1">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 text-sm ${
                pathname === item.href
                  ? "border border-teal text-teal"
                  : "text-ink/80 hover:text-teal"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main>{children}</main>
    </div>
  );
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <StaffRoleProvider>
        <ConsoleShell>{children}</ConsoleShell>
      </StaffRoleProvider>
    </ProtectedRoute>
  );
}