// ambagan-web/app/staff/system/page.tsx
//
// System Health — spec §19.2: "Processor/webhook status, queue latency,
// failed jobs, integration status, incident banner controls." Fully
// illustrative.

import { StaffModuleGate } from "@/components/staff-module-gate";

const CHECKS = [
  { name: "PayMongo webhook", status: "Not configured" },
  { name: "Database", status: "Healthy" },
  { name: "Storage (LocalDiskStorageAdapter)", status: "Healthy" },
  { name: "Failed background jobs", status: "0" },
];

export default function SystemHealthPage() {
  return (
    <StaffModuleGate permission="system:read" title="System Health">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">System Health</h1>
        <div className="border border-line">
          {CHECKS.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between border-b border-line px-4 py-3 text-sm last:border-b-0"
            >
              <span className="text-ink">{c.name}</span>
              <span className="font-mono text-xs text-muted">{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}