"use client";

// ambagan-web/app/staff/compliance/page.tsx
//
// DSWD/Compliance Queue — spec §19.2: "Permit-required cases, uploads,
// verification, expiry, post-reporting status." Fully illustrative — the
// Compliance/DSWD module isn't built server-side at all yet.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";

const MOCK_CASES = [
  {
    campaign: "Muling Pagtayo Pagkatapos ng Bagyo",
    permitNumber: "—",
    status: "Awaiting permit upload",
  },
];

export default function CompliancePage() {
  const [decisions, setDecisions] = useState<Record<string, boolean>>({});

  return (
    <StaffModuleGate permission="dswd:review" title="DSWD/Compliance Queue">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">DSWD/Compliance Queue</h1>
        <div className="space-y-3">
          {MOCK_CASES.map((c) => (
            <div key={c.campaign} className="border border-line px-5 py-4">
              <p className="text-ink">{c.campaign}</p>
              <p className="mt-1 text-sm text-muted">
                Permit: {c.permitNumber} · {c.status}
              </p>
              <button
                onClick={() => setDecisions((prev) => ({ ...prev, [c.campaign]: true }))}
                disabled={decisions[c.campaign]}
                className="mt-3 border border-teal px-3 py-1.5 text-xs text-teal hover:bg-teal hover:text-paper disabled:opacity-50"
              >
                {decisions[c.campaign] ? "Verified" : "Verify permit"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}