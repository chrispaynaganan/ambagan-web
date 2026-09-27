// ambagan-web/app/staff/audit/page.tsx
//
// Audit Logs — spec §19.2: "Searchable immutable privileged event
// history and export." One of the realest modules here —
// admin-audit's AuditEvent entity is hash-chained (AUDIT-002) with
// tamper-detection confirmed real. Fields below match RBAC-004's exact
// requirement: actor, timestamp, action, target, before/after, reason.

import { StaffModuleGate } from "@/components/staff-module-gate";

const MOCK_EVENTS = [
  {
    actor: "chris@example.com",
    timestamp: "2026-09-26 14:02",
    action: "CAMPAIGN_LIFECYCLE_CHANGED",
    target: "campaign:47f1b255-...",
    change: "verification_required → under_review",
    reason: "Katiwala identity verified",
  },
  {
    actor: "system",
    timestamp: "2026-09-26 09:15",
    action: "USER_REGISTERED",
    target: "user:b5ad50b3-...",
    change: "—",
    reason: "—",
  },
];

export default function AuditLogsPage() {
  return (
    <StaffModuleGate permission="audit:read" title="Audit Logs">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">Audit Logs</h1>
        <div className="border border-line">
          {MOCK_EVENTS.map((e, i) => (
            <div key={i} className="border-b border-line px-4 py-3 text-sm last:border-b-0">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-ink">{e.action}</span>
                <span className="font-mono text-xs text-muted">{e.timestamp}</span>
              </div>
              <p className="mt-1 text-muted">
                {e.actor} on {e.target}
              </p>
              {e.change !== "—" && <p className="mt-1 text-ink">{e.change}</p>}
              {e.reason !== "—" && <p className="text-xs text-muted">Reason: {e.reason}</p>}
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}