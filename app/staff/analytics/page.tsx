// ambagan-web/app/staff/analytics/page.tsx
//
// Analytics — spec §19.2: "Funnel, conversion, retention, campaign
// success, payout speed, Patunay completion, trust health, fraud/
// chargeback, recipient outcomes." Fully illustrative.

import { StaffModuleGate } from "@/components/staff-module-gate";

const METRICS = [
  { label: "Discover → Campaign Detail", value: "42%" },
  { label: "Campaign Detail → Checkout started", value: "8%" },
  { label: "Checkout started → completed", value: "76%" },
  { label: "Avg. payout speed (approved → processed)", value: "2.1 days" },
  { label: "Patunay on-time completion rate", value: "88%" },
];

export default function AnalyticsPage() {
  return (
    <StaffModuleGate permission="analytics:read" title="Analytics">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">Analytics</h1>
        <div className="border border-line">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="flex items-center justify-between border-b border-line px-4 py-3 text-sm last:border-b-0"
            >
              <span className="text-ink">{m.label}</span>
              <span className="font-mono text-ink">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}