"use client";

// ambagan-web/app/staff/kyc/page.tsx
//
// KYC Queue — spec §19.2: "ID cases, liveness/provider results,
// duplicates, manual decisions, audit." This is one of the modules with
// a genuinely real backend behind it — identity-access.controller.ts and
// POST /identity/verification/:id/review exist — but the exact DTO shape
// was never confirmed (the same open item flagged at the very start of
// this whole session). Approve/reject here are local state only.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";

interface KycCase {
  id: string;
  email: string;
  submittedAt: string;
  documentType: string;
  duplicateFlag: boolean;
}

const MOCK_CASES: KycCase[] = [
  {
    id: "kyc-1",
    email: "test@ambagan.dev",
    submittedAt: "2026-09-26",
    documentType: "PhilSys National ID",
    duplicateFlag: false,
  },
];

export default function KycQueuePage() {
  const [decisions, setDecisions] = useState<Record<string, "approved" | "needs_attention">>({});

  return (
    <StaffModuleGate permission="identity:review_verification" title="KYC Queue">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">KYC Queue</h1>
        <div className="space-y-3">
          {MOCK_CASES.map((c) => (
            <div key={c.id} className="border border-line px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-ink">{c.email}</span>
                <span className="font-mono text-xs text-muted">{c.submittedAt}</span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {c.documentType}
                {c.duplicateFlag && <span className="ml-2 text-danger">Duplicate flagged</span>}
              </p>
              <div className="mt-3 flex gap-2">
                {decisions[c.id] ? (
                  <span className="font-mono text-xs text-muted">{decisions[c.id]}</span>
                ) : (
                  <>
                    <button
                      onClick={() => setDecisions((prev) => ({ ...prev, [c.id]: "approved" }))}
                      className="border border-teal px-3 py-1.5 text-xs text-teal hover:bg-teal hover:text-paper"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        setDecisions((prev) => ({ ...prev, [c.id]: "needs_attention" }))
                      }
                      className="border border-line px-3 py-1.5 text-xs text-ink/80 hover:border-teal hover:text-teal"
                    >
                      Needs attention
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