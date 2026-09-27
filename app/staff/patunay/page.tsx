"use client";

// ambagan-web/app/staff/patunay/page.tsx
//
// Patunay Queue — spec §19.2: "Evidence due/submitted, reviewer tools,
// redaction, public/private versions." patunay:review is a real confirmed
// permission. Reuses campaign-detail-data.ts's patunay records — same
// entries shown on the public Campaign Detail page and Katiwala's own
// Patunay page, viewed here from the reviewer's side.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";

function PatunayQueueContent() {
  const [decisions, setDecisions] = useState<Record<string, "accepted" | "rejected">>({});

  const pending = MOCK_CAMPAIGNS.flatMap((c) => {
    const detail = MOCK_CAMPAIGN_DETAILS[c.slug];
    if (!detail) return [];
    return detail.patunay
      .filter((p) => !p.verified)
      .map((p) => ({ campaignTitle: c.title, campaignSlug: c.slug, ...p }));
  });

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-ink">Patunay Queue</h1>
      {pending.length === 0 ? (
        <p className="border border-line px-5 py-6 text-center text-muted">
          Nothing pending review.
        </p>
      ) : (
        <div className="space-y-3">
          {pending.map((p) => {
            const key = `${p.campaignSlug}-${p.title}`;
            return (
              <div key={key} className="border border-line px-5 py-4">
                <p className="text-ink">{p.campaignTitle}</p>
                <p className="mt-1 font-mono text-xs text-muted">{p.date}</p>
                <p className="mt-2 text-sm text-ink">{p.title}</p>
                <p className="mt-1 text-sm text-muted">{p.summary}</p>
                <div className="mt-3 flex gap-2 text-xs">
                  {decisions[key] ? (
                    <span className="font-mono text-muted">{decisions[key]}</span>
                  ) : (
                    <>
                      <button
                        onClick={() => setDecisions((prev) => ({ ...prev, [key]: "accepted" }))}
                        className="border border-teal px-3 py-1.5 text-teal hover:bg-teal hover:text-paper"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setDecisions((prev) => ({ ...prev, [key]: "rejected" }))}
                        className="border border-danger px-3 py-1.5 text-danger hover:bg-danger hover:text-paper"
                      >
                        Reject (needs reason + resubmission path per PAT-004)
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PatunayQueuePage() {
  return (
    <StaffModuleGate permission="patunay:review" title="Patunay Queue">
      <PatunayQueueContent />
    </StaffModuleGate>
  );
}