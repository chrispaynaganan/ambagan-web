"use client";

// ambagan-web/app/receipts/page.tsx
//
// Receipts — Kaambag dashboard area (spec §4.3, and DON-005: "Successful
// contributions generate a receipt/reference, appear in the Kaambag
// dashboard if linked to an account"). Itemized per transaction, unlike
// My Ambag which groups by campaign.

import { ProtectedRoute } from "@/components/protected-route";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS, type MockCampaign } from "@/lib/mock-data";
import { MOCK_CONTRIBUTIONS } from "@/lib/kaambag-mock-data";

function ReceiptsContent() {
  const rows = MOCK_CONTRIBUTIONS.map((c) => ({
    contribution: c,
    campaign: MOCK_CAMPAIGNS.find((camp) => camp.slug === c.campaignSlug),
  })).filter(
    (r): r is { contribution: typeof r.contribution; campaign: MockCampaign } =>
      r.campaign !== undefined
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Receipts</h1>
        <p className="mt-2 max-w-xl text-muted">
          Every contribution you&apos;ve made, with its reference number.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          No receipts yet.
        </p>
      ) : (
        <div className="border border-line">
          {rows.map(({ contribution, campaign }) => (
            <div
              key={contribution.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 last:border-b-0"
            >
              <div>
                <p className="text-sm text-ink">{campaign.title}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {contribution.reference} · {contribution.date}
                  {contribution.anonymous ? " · given anonymously" : ""}
                </p>
              </div>
              <span className="font-mono text-sm text-ink">
                {formatPeso(contribution.amountMinorUnits)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReceiptsPage() {
  return (
    <ProtectedRoute>
      <ReceiptsContent />
    </ProtectedRoute>
  );
}