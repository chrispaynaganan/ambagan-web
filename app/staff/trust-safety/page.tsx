// ambagan-web/app/staff/trust-safety/page.tsx
//
// Trust & Safety — spec §19.2: "Risk cases, duplicate campaigns/media,
// device/account link signals, enforcement." trust:invalidate_grant is a
// real permission, but the Risk module itself isn't built server-side
// (explicitly on the backend's "not yet built" list) — the case list
// below is illustrative.

import { StaffModuleGate } from "@/components/staff-module-gate";

const RISK_CASES = [
  {
    signal: "Duplicate device fingerprint across 2 accounts",
    severity: "medium",
    status: "under review",
  },
  {
    signal: "Rapid campaign creation from new account",
    severity: "low",
    status: "monitoring",
  },
];

export default function TrustSafetyPage() {
  return (
    <StaffModuleGate permission="trust:invalidate_grant" title="Trust & Safety">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">Trust &amp; Safety</h1>
        <p className="text-xs text-muted">
          Internal risk signals — never shown publicly (§20's separation of
          public reputation from private risk).
        </p>
        <div className="space-y-3">
          {RISK_CASES.map((c) => (
            <div key={c.signal} className="border border-line px-5 py-4">
              <p className="text-ink">{c.signal}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {c.severity} · {c.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}