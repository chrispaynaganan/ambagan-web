"use client";

// ambagan-web/app/campaigns/[id]/compliance/page.tsx
//
// DSWD/Compliance — Katiwala dashboard area (spec §4.3, §17). The
// Compliance/DSWD backend module isn't built at all yet (explicitly on
// the "not yet built" list in the project summary) — everything here is
// local state, further from real than most other pages in this batch.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";

type ScreeningResult = "not_screened" | "likely_required" | "not_required";

function ComplianceContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();
  const [screening, setScreening] = useState<ScreeningResult>("not_screened");
  const [permitNumber, setPermitNumber] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  function runScreening() {
    // Real screening (DSWD-001) weighs purpose, audience, geography, and
    // solicitation method. This is a placeholder result, not a real
    // determination.
    setScreening("likely_required");
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">DSWD / Compliance</h1>
        <p className="mt-1 text-sm text-muted">
          Guidance, not legal advice or a final determination (§17).
        </p>
      </div>

      <div className="border border-line px-5 py-4">
        <p className="text-sm text-ink">
          Screening result:{" "}
          <span className="font-medium">
            {screening === "not_screened"
              ? "Not screened yet"
              : screening === "likely_required"
                ? "Public Solicitation Permit likely required"
                : "Not required"}
          </span>
        </p>
        {screening === "not_screened" && (
          <button
            onClick={runScreening}
            className="mt-3 border border-teal px-4 py-2 text-sm text-teal hover:bg-teal hover:text-paper"
          >
            Run screening
          </button>
        )}
      </div>

      {screening === "likely_required" && (
        <div className="space-y-4 border border-line px-6 py-6">
          <h2 className="font-serif text-lg text-ink">Permit details</h2>
          <label className="block text-sm text-ink">
            Permit number
            <input
              type="text"
              value={permitNumber}
              onChange={(e) => setPermitNumber(e.target.value)}
              className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
            />
          </label>
          <div>
            <p className="text-sm text-ink">Upload proof</p>
            <input
              type="file"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              className="mt-2 block w-full text-sm text-muted"
            />
            {fileName && <p className="mt-1 text-xs text-muted">Selected: {fileName}</p>}
          </div>
          <button className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark">
            Submit for verification
          </button>
        </div>
      )}
    </div>
  );
}

export default function CompliancePage() {
  return (
    <ProtectedRoute>
      <ComplianceContent />
    </ProtectedRoute>
  );
}