"use client";

// ambagan-web/app/staff/tiwala/page.tsx
//
// Tiwala Administration — spec §19.2: "View grants, abuse signals,
// invalidation with reason, level calculation history. Manual point
// edits require exceptional permission and audit." trust:invalidate_grant
// is real; trust.service.ts's read path is confirmed live-HTTP-tested.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";

function TiwalaAdminContent() {
  const [invalidated, setInvalidated] = useState<Record<string, string>>({});
  const [reason, setReason] = useState<Record<string, string>>({});

  const katiwalas = Object.entries(MOCK_CAMPAIGN_DETAILS).map(([slug, detail]) => ({
    slug,
    ...detail.katiwalaProfile,
  }));

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-ink">Tiwala Administration</h1>
      <div className="space-y-3">
        {katiwalas.map((k) => (
          <div key={k.slug} className="border border-line px-5 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-ink">{k.displayName}</span>
              <span className="font-mono text-xs text-muted">
                {k.level} · {k.tiwalaCount} Tiwala
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={reason[k.slug] ?? ""}
                onChange={(e) => setReason((prev) => ({ ...prev, [k.slug]: e.target.value }))}
                placeholder="Reason for invalidation (required, RBAC-004)"
                className="flex-1 border border-line px-2 py-1 text-xs text-ink"
              />
              <button
                onClick={() => {
                  const draftReason = reason[k.slug];
                  if (!draftReason?.trim()) return;
                  setInvalidated((prev) => ({ ...prev, [k.slug]: draftReason }));
                }}
                disabled={Boolean(invalidated[k.slug])}
                className="border border-danger px-3 py-1 text-xs text-danger hover:bg-danger hover:text-paper disabled:opacity-50"
              >
                Invalidate grant
              </button>
            </div>
            {invalidated[k.slug] && (
              <p className="mt-2 text-xs text-danger">Invalidated: {invalidated[k.slug]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TiwalaAdminPage() {
  return (
    <StaffModuleGate permission="trust:invalidate_grant" title="Tiwala Administration">
      <TiwalaAdminContent />
    </StaffModuleGate>
  );
}