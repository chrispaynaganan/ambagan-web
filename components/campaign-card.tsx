// ambagan-web/components/campaign-card.tsx
//
// Shared campaign-card rendering for Home's "Featured Ambagans" and
// Discover's results grid — extracted so the two screens can't drift out
// of sync on card markup. Once real campaign data replaces MockCampaign,
// this is the one place to update the shape.

import Link from "next/link";
import { formatPeso } from "@/lib/money";
import type { MockCampaign } from "@/lib/mock-data";

export function CampaignCard({ campaign }: { campaign: MockCampaign }) {
  const pct = Math.min(
    100,
    Math.round(
      (Number(campaign.raisedMinorUnits) / Number(campaign.goalMinorUnits)) * 100
    )
  );

  return (
    <Link
      href={`/ambagan/${campaign.slug}`}
      className="block border border-line px-5 py-5 hover:border-teal"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">
          {campaign.category}
        </span>
        {campaign.katiwalaVerified && (
          <span className="border border-teal px-2 py-0.5 text-xs text-teal">
            Verified
          </span>
        )}
      </div>

      <h3 className="mt-3 font-serif text-lg text-ink">{campaign.title}</h3>
      <p className="mt-1 text-sm text-muted">
        {campaign.recipientLine} · {campaign.location}
      </p>

      <div className="mt-4">
        <div className="h-1.5 w-full bg-line">
          <div className="h-1.5 bg-teal" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-ink">
          {formatPeso(campaign.raisedMinorUnits)}{" "}
          <span className="text-muted">
            raised of {formatPeso(campaign.goalMinorUnits)}
          </span>
        </p>
      </div>
    </Link>
  );
}