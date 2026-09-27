"use client";

// ambagan-web/app/tiwala-history/page.tsx
//
// Tiwala eligibility & history — Kaambag dashboard area (spec §4.3).
// Eligibility follows TRUST-004: eligible once a contributed campaign has
// at least one accepted Patunay (or reaches its completion trust window —
// not modeled in mock data here). Cross-references contributions,
// campaign-detail-data's Patunay records, and already-given Tiwala.

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CONTRIBUTIONS, MOCK_TIWALA_GIVEN } from "@/lib/kaambag-mock-data";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";

function TiwalaHistoryContent() {
  const contributedSlugs = Array.from(new Set(MOCK_CONTRIBUTIONS.map((c) => c.campaignSlug)));
  const givenSlugs = new Set(MOCK_TIWALA_GIVEN.map((t) => t.campaignSlug));

  const eligibleNow = contributedSlugs.filter((slug) => {
    const detail = MOCK_CAMPAIGN_DETAILS[slug];
    return detail && detail.patunay.some((p) => p.verified) && !givenSlugs.has(slug);
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Tiwala eligibility &amp; history</h1>
        <p className="mt-2 max-w-xl text-muted">
          You can give one Tiwala per Ambagan, once it has an accepted
          Patunay — regardless of how much you contributed.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-ink">Eligible to give now</h2>
        {eligibleNow.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Nothing new right now — either you&apos;ve already given Tiwala
            where you can, or your contributed campaigns don&apos;t have an
            accepted Patunay yet.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {eligibleNow.map((slug) => {
              const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === slug);
              if (!campaign) return null;
              return (
                <div
                  key={slug}
                  className="flex items-center justify-between border border-line px-5 py-4"
                >
                  <span className="text-ink">{campaign.title}</span>
                  <button className="border border-teal px-4 py-1.5 text-sm text-teal hover:bg-teal hover:text-paper">
                    Give Tiwala
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">Tiwala you&apos;ve given</h2>
        {MOCK_TIWALA_GIVEN.length === 0 ? (
          <p className="mt-3 text-sm text-muted">You haven&apos;t given any Tiwala yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {MOCK_TIWALA_GIVEN.map((t) => {
              const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === t.campaignSlug);
              return (
                <div
                  key={t.campaignSlug}
                  className="flex items-center justify-between border-b border-line py-2 text-sm"
                >
                  <Link href={`/ambagan/${t.campaignSlug}`} className="text-ink hover:text-teal">
                    {campaign?.title ?? t.campaignSlug}
                  </Link>
                  <span className="font-mono text-xs text-muted">{t.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function TiwalaHistoryPage() {
  return (
    <ProtectedRoute>
      <TiwalaHistoryContent />
    </ProtectedRoute>
  );
}