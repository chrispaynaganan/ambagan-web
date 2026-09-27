// ambagan-web/app/my-ambag/page.tsx
//
// My Ambag — Kaambag dashboard area (spec §4.3). The campaigns a Kaambag
// has actually contributed to, grouped by campaign rather than itemized
// per transaction (that's Receipts' job). Mock data from
// lib/kaambag-mock-data.ts.

import Link from "next/link";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS, type MockCampaign } from "@/lib/mock-data";
import { MOCK_CONTRIBUTIONS } from "@/lib/kaambag-mock-data";

export default function MyAmbagPage() {
  const bySlug = new Map<string, { totalMinorUnits: number; count: number }>();
  for (const c of MOCK_CONTRIBUTIONS) {
    const existing = bySlug.get(c.campaignSlug) ?? { totalMinorUnits: 0, count: 0 };
    bySlug.set(c.campaignSlug, {
      totalMinorUnits: existing.totalMinorUnits + Number(c.amountMinorUnits),
      count: existing.count + 1,
    });
  }

  const rows = Array.from(bySlug.entries())
    .map(([slug, agg]) => ({
      campaign: MOCK_CAMPAIGNS.find((c) => c.slug === slug),
      ...agg,
    }))
    .filter(
      (
        r
      ): r is { campaign: MockCampaign; totalMinorUnits: number; count: number } =>
        r.campaign !== undefined
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">My Ambag</h1>
        <p className="mt-2 max-w-xl text-muted">
          Every Ambagan you&apos;ve personally contributed to.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          You haven&apos;t contributed to an Ambagan yet.{" "}
          <Link href="/discover" className="text-teal hover:text-teal-dark">
            Discover one →
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map(({ campaign, totalMinorUnits, count }) => (
            <Link
              key={campaign.slug}
              href={`/ambagan/${campaign.slug}`}
              className="block border border-line px-5 py-4 hover:border-teal"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-ink">{campaign.title}</h3>
                <span className="font-mono text-sm text-ink">
                  {formatPeso(String(totalMinorUnits))}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {count} contribution{count === 1 ? "" : "s"} · {campaign.recipientLine}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}