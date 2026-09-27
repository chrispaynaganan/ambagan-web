"use client";

// ambagan-web/app/campaigns/[id]/contributions/page.tsx
//
// Contributions — Katiwala dashboard area (spec §4.3). Reuses
// lib/kaambag-mock-data.ts's MOCK_CONTRIBUTIONS filtered to this
// campaign's slug — the same records that show up on a Kaambag's
// Receipts page, just viewed from the receiving side. Real data would
// come from contributions-payments, which isn't live-HTTP-tested yet (no
// PayMongo credentials configured).

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";
import { formatPeso } from "@/lib/money";
import { MOCK_CONTRIBUTIONS } from "@/lib/kaambag-mock-data";

function ContributionsContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  const rows = MOCK_CONTRIBUTIONS.filter((c) => c.campaignSlug === campaign.slug);
  const total = rows.reduce((sum, c) => sum + Number(c.amountMinorUnits), 0);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Contributions</h1>
        <p className="mt-1 text-sm text-muted">
          {rows.length} contribution{rows.length === 1 ? "" : "s"}, {formatPeso(String(total))} total.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          No contributions yet.
        </p>
      ) : (
        <div className="border border-line">
          {rows.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 last:border-b-0"
            >
              <div>
                <p className="text-sm text-ink">{c.anonymous ? "Anonymous Kaambag" : "Kaambag"}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  {c.reference} · {c.date}
                </p>
              </div>
              <span className="font-mono text-sm text-ink">
                {formatPeso(c.amountMinorUnits)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContributionsPage() {
  return (
    <ProtectedRoute>
      <ContributionsContent />
    </ProtectedRoute>
  );
}