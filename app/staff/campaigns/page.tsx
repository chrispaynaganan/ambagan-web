"use client";

// ambagan-web/app/staff/campaigns/page.tsx
//
// Campaign Review Queue — spec §19.2: "Automated flags, evidence,
// recipient, story/media, compliance, decision tools." Reuses real
// MOCK_CAMPAIGNS; approve/reject are local state, no confirmed staff
// review-decision route exists.

import { useState } from "react";
import Link from "next/link";
import { StaffModuleGate } from "@/components/staff-module-gate";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";

export default function CampaignReviewQueuePage() {
  const [decisions, setDecisions] = useState<Record<string, "approved" | "rejected">>({});

  return (
    <StaffModuleGate permission="campaigns:review" title="Campaign Review Queue">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">Campaign Review Queue</h1>
        <div className="border border-line">
          {MOCK_CAMPAIGNS.map((c) => (
            <div
              key={c.slug}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm last:border-b-0"
            >
              <div>
                <Link href={`/ambagan/${c.slug}`} className="text-ink hover:text-teal">
                  {c.title}
                </Link>
                <span className="ml-2 font-mono text-xs text-muted">{c.category}</span>
              </div>
              <div className="flex items-center gap-2">
                {decisions[c.slug] ? (
                  <span className="font-mono text-xs text-muted">{decisions[c.slug]}</span>
                ) : (
                  <>
                    <button
                      onClick={() => setDecisions((prev) => ({ ...prev, [c.slug]: "approved" }))}
                      className="border border-teal px-2 py-1 text-xs text-teal hover:bg-teal hover:text-paper"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setDecisions((prev) => ({ ...prev, [c.slug]: "rejected" }))}
                      className="border border-danger px-2 py-1 text-xs text-danger hover:bg-danger hover:text-paper"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}