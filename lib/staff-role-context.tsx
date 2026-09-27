"use client";

// ambagan-web/lib/staff-role-context.tsx
//
// Holds which staff role is currently being previewed in the console.
// This is a UI-only demonstration of RBAC-001's permission model — it
// does NOT check the real logged-in user's actual permissions (AuthUser
// doesn't carry roles/permissions yet, per the project summary's §5.2
// item 3), so anyone who reaches /staff/* can switch roles freely here.
// Real enforcement has to happen server-side; this only demonstrates
// what each role's console view looks like.

import { createContext, useContext, useState, type ReactNode } from "react";
import { STAFF_ROLES, ROLE_PERMISSIONS, type StaffRole, type Permission } from "./staff-rbac";

interface StaffRoleContextValue {
  role: StaffRole;
  setRole: (role: StaffRole) => void;
  permissions: Permission[];
  has: (permission: Permission) => boolean;
}

const StaffRoleContext = createContext<StaffRoleContextValue | undefined>(undefined);

export function StaffRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<StaffRole>("Creator / Super Admin");
  const permissions = ROLE_PERMISSIONS[role];

  return (
    <StaffRoleContext.Provider
      value={{
        role,
        setRole,
        permissions,
        has: (permission) => permissions.includes(permission),
      }}
    >
      {children}
    </StaffRoleContext.Provider>
  );
}

export function useStaffRole(): StaffRoleContextValue {
  const ctx = useContext(StaffRoleContext);
  if (!ctx) {
    throw new Error("useStaffRole must be used within a StaffRoleProvider");
  }
  return ctx;
}

export { STAFF_ROLES };