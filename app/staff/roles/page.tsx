// ambagan-web/app/staff/roles/page.tsx
//
// Staff & Roles — spec §19.2: "Invite/disable staff, permission bundles,
// access review, MFA enforcement." Shows the actual ROLE_PERMISSIONS
// bundles from lib/staff-rbac.ts directly — this module and the RBAC
// model are the same data, not a separate mock.

import { StaffModuleGate } from "@/components/staff-module-gate";
import { STAFF_ROLES, ROLE_PERMISSIONS } from "@/lib/staff-rbac";

export default function StaffRolesPage() {
  return (
    <StaffModuleGate permission="staff:manage" title="Staff & Roles">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">Staff &amp; Roles</h1>
        <p className="text-xs text-muted">
          Real staff sessions need mandatory MFA (RBAC-003) — not modeled
          here; /account/security's 2FA toggle is a UI placeholder only.
        </p>
        <div className="space-y-3">
          {STAFF_ROLES.map((role) => (
            <div key={role} className="border border-line px-5 py-4">
              <p className="font-serif text-ink">{role}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ROLE_PERMISSIONS[role].map((p) => (
                  <span
                    key={p}
                    className="border border-line px-2 py-0.5 font-mono text-xs text-muted"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}