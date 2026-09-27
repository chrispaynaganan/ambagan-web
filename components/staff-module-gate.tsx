"use client";

// ambagan-web/components/staff-module-gate.tsx
//
// Shared permission check for Operations Console module pages —
// demonstrates RBAC-001/002 by actually hiding content when the
// previewed role lacks the permission, rather than just listing modules
// in prose. Executive Overview and Activity Stream don't use this (spec
// treats them as generally staff-visible, not permission-specific).

import type { ReactNode } from "react";
import { useStaffRole } from "@/lib/staff-role-context";
import type { Permission } from "@/lib/staff-rbac";

export function StaffModuleGate({
  permission,
  title,
  children,
}: {
  permission: Permission;
  title: string;
  children: ReactNode;
}) {
  const { has, role } = useStaffRole();

  if (!has(permission)) {
    return (
      <div className="space-y-3">
        <h1 className="font-serif text-2xl text-ink">{title}</h1>
        <p className="border border-line px-5 py-6 text-muted">
          {role} doesn&apos;t have the{" "}
          <span className="font-mono text-xs text-ink">{permission}</span> permission.
          Switch roles in the sidebar to preview this module.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}