"use client";

// ambagan-web/app/campaigns/[id]/payouts/page.tsx
//
// Payouts — Katiwala dashboard area (spec §4.3, §11). Real
// PayoutDestination/Payout entities exist and are partially
// live-HTTP-verified per the project summary, but no Katiwala-facing
// "request a payout" route was in the confirmed contract — "Request
// payout" is disabled rather than guessed at, same honesty pattern as
// /account/payment-methods.

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";

function PayoutsContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  const detail = MOCK_CAMPAIGN_DETAILS[campaign.slug];

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Payouts</h1>
      </div>

      {!detail ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          No payout destination set up yet for this campaign.
        </p>
      ) : (
        <div className="border border-line px-5 py-4 text-sm">
          <div className="flex justify-between border-b border-line py-2">
            <span className="text-ink">Destination type</span>
            <span className="font-mono text-ink">
              {detail.payoutTransparency.destinationType}
            </span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span className="text-muted">Released</span>
            <span className="font-mono text-ink">
              {formatPeso(detail.payoutTransparency.releasedMinorUnits)}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted">Remaining</span>
            <span className="font-mono text-ink">
              {formatPeso(detail.payoutTransparency.remainingMinorUnits)}
            </span>
          </div>
        </div>
      )}

      <button
        disabled
        title="No confirmed request-payout route yet — see comment at top of this file"
        className="border border-line px-5 py-2.5 text-sm text-muted opacity-50"
      >
        Request payout
      </button>
    </div>
  );
}

export default function PayoutsPage() {
  return (
    <ProtectedRoute>
      <PayoutsContent />
    </ProtectedRoute>
  );
}