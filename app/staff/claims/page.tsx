"use client";

// ambagan-web/app/staff/claims/page.tsx
//
// Claims & Disputes — spec §19.2: "Protektadong Ambag and recipient
// disputes with SLAs, evidence, decisions, recovery/refund." Combines
// Kaambag's MOCK_CLAIMS and Recipient's MOCK_RECIPIENT_DISPUTES — same
// records the Kaambag/Katiwala/Recipient pages already show, one staff
// queue over both.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CLAIMS } from "@/lib/kaambag-mock-data";
import { MOCK_RECIPIENT_DISPUTES } from "@/lib/recipient-mock-data";

function ClaimsQueueContent() {
  const [resolved, setResolved] = useState<Record<string, boolean>>({});

  const items = [
    ...MOCK_CLAIMS.map((c) => ({ id: c.id, campaignSlug: c.campaignSlug, reason: c.reason, source: "Kaambag claim" })),
    ...MOCK_RECIPIENT_DISPUTES.map((d) => ({
      id: d.id,
      campaignSlug: d.campaignSlug,
      reason: d.description,
      source: "Recipient dispute",
    })),
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-ink">Claims &amp; Disputes</h1>
      {items.length === 0 ? (
        <p className="border border-line px-5 py-6 text-center text-muted">No open items.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === item.campaignSlug);
            return (
              <div key={item.id} className="border border-line px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-ink">{campaign?.title ?? item.campaignSlug}</span>
                  <span className="font-mono text-xs text-muted">{item.source}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{item.reason}</p>
                <button
                  onClick={() => setResolved((prev) => ({ ...prev, [item.id]: true }))}
                  disabled={resolved[item.id]}
                  className="mt-3 border border-teal px-3 py-1.5 text-xs text-teal hover:bg-teal hover:text-paper disabled:opacity-50"
                >
                  {resolved[item.id] ? "Resolved" : "Mark resolved"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ClaimsQueuePage() {
  return (
    <StaffModuleGate permission="claims:manage" title="Claims & Disputes">
      <ClaimsQueueContent />
    </StaffModuleGate>
  );
}