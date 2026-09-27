"use client";

// ambagan-web/app/recipient/funds/page.tsx
//
// Incoming Funds + Received Funds — banked recipient dashboard (spec
// §12.1). Combined into one page with two sections since they're both
// "money views" over the same MOCK_RECIPIENT_LINKS records.

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_RECIPIENT_LINKS } from "@/lib/recipient-mock-data";

function FundsContent() {
  const links = MOCK_RECIPIENT_LINKS.filter((l) => l.recipientType === "banked");

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <Link href="/recipient" className="text-sm text-teal hover:text-teal-dark">
          ← Campaigns for Me
        </Link>
        <h1 className="mt-2 font-serif text-3xl text-ink">Funds</h1>
      </div>

      <section>
        <h2 className="font-serif text-xl text-ink">Incoming</h2>
        <p className="mt-1 text-xs text-muted">
          Eligible, pending, or held — not yet paid out.
        </p>
        <div className="mt-3 space-y-2">
          {links.map((link) => {
            const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === link.campaignSlug);
            if (!campaign || link.incomingMinorUnits === "0") return null;
            return (
              <div
                key={link.campaignSlug}
                className="flex items-center justify-between border border-line px-4 py-3 text-sm"
              >
                <span className="text-ink">{campaign.title}</span>
                <span className="font-mono text-ink">
                  {formatPeso(link.incomingMinorUnits)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">Received</h2>
        <div className="mt-3 space-y-2">
          {links.flatMap((link) =>
            link.receivedPayouts.map((payout) => {
              const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === link.campaignSlug);
              return (
                <div
                  key={payout.reference}
                  className="flex items-center justify-between border border-line px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-ink">{campaign?.title ?? link.campaignSlug}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {payout.reference} · {payout.date}
                    </p>
                  </div>
                  <span className="font-mono text-ink">
                    {formatPeso(payout.amountMinorUnits)}
                  </span>
                </div>
              );
            })
          )}
          {links.every((l) => l.receivedPayouts.length === 0) && (
            <p className="border border-line px-4 py-6 text-center text-muted">
              No completed payouts yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default function FundsPage() {
  return (
    <ProtectedRoute>
      <FundsContent />
    </ProtectedRoute>
  );
}