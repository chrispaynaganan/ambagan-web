"use client";

// ambagan-web/app/staff/payouts/page.tsx
//
// Payouts — spec §19.2: "Destination verification, queue, holds,
// approvals, failures, cash pickup/provider routes." One of the more
// real modules — payouts:verify_destination/approve/hold/process are all
// confirmed real permissions from your test data. Actions here are still
// local state; no confirmed staff-facing payout-action route exists.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";
import { useStaffRole } from "@/lib/staff-role-context";

function PayoutsContent() {
  const { has } = useStaffRole();
  const [status, setStatus] = useState<Record<string, string>>({});

  const rows = MOCK_CAMPAIGNS.map((c) => ({
    campaign: c,
    detail: MOCK_CAMPAIGN_DETAILS[c.slug],
  })).filter((r) => r.detail);

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-ink">Payouts</h1>
      <div className="space-y-3">
        {rows.map(({ campaign, detail }) => (
          <div key={campaign.slug} className="border border-line px-5 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-ink">{campaign.title}</span>
              <span className="font-mono text-xs text-muted">
                {detail!.payoutTransparency.destinationType}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Released {formatPeso(detail!.payoutTransparency.releasedMinorUnits)}, remaining{" "}
              {formatPeso(detail!.payoutTransparency.remainingMinorUnits)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {has("payouts:verify_destination") && (
                <button className="border border-line px-3 py-1.5 text-ink/80 hover:border-teal hover:text-teal">
                  Verify destination
                </button>
              )}
              {has("payouts:hold") && (
                <button
                  onClick={() => setStatus((prev) => ({ ...prev, [campaign.slug]: "on hold" }))}
                  className="border border-gold px-3 py-1.5 text-ink/80 hover:bg-gold hover:text-paper"
                >
                  Hold
                </button>
              )}
              {has("payouts:approve") && (
                <button
                  onClick={() => setStatus((prev) => ({ ...prev, [campaign.slug]: "approved" }))}
                  className="border border-teal px-3 py-1.5 text-teal hover:bg-teal hover:text-paper"
                >
                  Approve
                </button>
              )}
              {has("payouts:process") && (
                <button
                  onClick={() => setStatus((prev) => ({ ...prev, [campaign.slug]: "processed" }))}
                  className="border border-teal bg-teal px-3 py-1.5 text-paper hover:bg-teal-dark"
                >
                  Process
                </button>
              )}
              {status[campaign.slug] && (
                <span className="font-mono text-muted">{status[campaign.slug]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PayoutsPage() {
  return (
    <StaffModuleGate permission="payouts:approve" title="Payouts">
      <PayoutsContent />
    </StaffModuleGate>
  );
}