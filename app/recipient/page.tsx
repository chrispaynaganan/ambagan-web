"use client";

// ambagan-web/app/recipient/page.tsx
//
// Banked recipient — Overview + My Campaigns + Confirm Receipt + Patunay
// (spec §12.1). Consolidated into one page rather than four routes,
// since all four are fundamentally "per linked campaign" concerns and the
// mock data is the same shape either way — flagged here rather than
// silently merged. Payout Destination and Disputes stay separate (they're
// genuinely different concerns: how money arrives, vs. a formal
// complaint). Verification and Notifications reuse the existing
// /account/verification and /notifications pages — same underlying
// mechanism regardless of role.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_RECIPIENT_LINKS, type RecipientCampaignLink } from "@/lib/recipient-mock-data";

const CONSENT_LABEL: Record<RecipientCampaignLink["consentStatus"], string> = {
  pending: "Consent pending",
  granted: "Consent granted",
  revoked: "Consent revoked",
};

function RecipientOverviewContent() {
  const [confirmed, setConfirmed] = useState<Record<string, "full" | "partial" | "none">>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  const links = MOCK_RECIPIENT_LINKS.filter((l) => l.recipientType === "banked");

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Campaigns for Me</h1>
        <p className="mt-2 max-w-xl text-muted">
          Every Ambagan that names you as the recipient — you shouldn&apos;t
          have to rely entirely on the Katiwala for information about money
          intended for you.
        </p>
      </div>

      {links.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          No campaigns currently name you as a recipient.
        </p>
      ) : (
        <div className="space-y-4">
          {links.map((link) => {
            const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === link.campaignSlug);
            if (!campaign) return null;
            const confirmedState = confirmed[link.campaignSlug];
            const isFlagged = flagged[link.campaignSlug];

            return (
              <div key={link.campaignSlug} className="border border-line px-6 py-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/ambagan/${campaign.slug}`}
                    className="font-serif text-lg text-ink hover:text-teal"
                  >
                    {campaign.title}
                  </Link>
                  <span className="font-mono text-xs text-muted">
                    {CONSENT_LABEL[link.consentStatus]}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted">Incoming</p>
                    <p className="font-mono text-ink">
                      {formatPeso(link.incomingMinorUnits)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted">Identity verification</p>
                    <p className="text-ink">{link.verificationStatus}</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-line pt-4">
                  <p className="text-sm text-ink">Confirm receipt</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["full", "partial", "none"] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setConfirmed((prev) => ({ ...prev, [link.campaignSlug]: option }))
                        }
                        className={`border px-3 py-1.5 text-xs ${
                          confirmedState === option
                            ? "border-teal bg-teal text-paper"
                            : "border-line text-ink/80 hover:border-teal hover:text-teal"
                        }`}
                      >
                        {option === "full"
                          ? "Received in full"
                          : option === "partial"
                            ? "Received partially"
                            : "Not received"}
                      </button>
                    ))}
                  </div>
                  {confirmedState === "none" && (
                    <p className="mt-2 text-xs text-danger">
                      This opens a case — see Disputes for details.
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <button
                    onClick={() => setFlagged((prev) => ({ ...prev, [link.campaignSlug]: true }))}
                    disabled={isFlagged}
                    className="text-xs text-danger hover:underline disabled:opacity-50"
                  >
                    {isFlagged ? "Flagged for review" : "Flag unauthorized or inaccurate use"}
                  </button>
                  <Link
                    href="/recipient/disputes"
                    className="text-xs text-teal hover:text-teal-dark"
                  >
                    View disputes →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/recipient/payout-destination"
          className="border border-line px-5 py-4 hover:border-teal"
        >
          <p className="text-ink">Payout destination</p>
          <p className="mt-1 text-sm text-muted">Bank/e-wallet details</p>
        </Link>
        <Link href="/recipient/funds" className="border border-line px-5 py-4 hover:border-teal">
          <p className="text-ink">Funds</p>
          <p className="mt-1 text-sm text-muted">Incoming and received</p>
        </Link>
      </div>
    </div>
  );
}

export default function RecipientOverviewPage() {
  return (
    <ProtectedRoute>
      <RecipientOverviewContent />
    </ProtectedRoute>
  );
}