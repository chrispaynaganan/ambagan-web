"use client";

// ambagan-web/app/campaigns/[id]/claims/page.tsx
//
// Claims/Disputes — Katiwala dashboard area (spec §4.3). The other side of
// Kaambag's /claims page — same MOCK_CLAIMS records from
// lib/kaambag-mock-data.ts, filtered to this campaign, viewed from the
// Katiwala who has to respond rather than the Kaambag who filed it.
// "Respond" is local-state only, matching §18.3's step 4 (Katiwala gets a
// chance to respond) without a real endpoint behind it yet.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";
import { MOCK_CLAIMS } from "@/lib/kaambag-mock-data";

const STATUS_LABEL = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
} as const;

function ClaimsContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  const claims = MOCK_CLAIMS.filter((c) => c.campaignSlug === campaign.slug);

  function handleRespond(claimId: string) {
    const draft = drafts[claimId]?.trim();
    if (!draft) return;
    setResponses((prev) => ({ ...prev, [claimId]: draft }));
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Claims &amp; Disputes</h1>
      </div>

      {claims.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          No claims filed against this campaign.
        </p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="border border-line px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-muted">
                  {STATUS_LABEL[claim.status]} · {claim.filedDate}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink">{claim.reason}</p>

              {claim.resolutionNote && (
                <p className="mt-2 border-t border-line pt-2 text-sm text-muted">
                  {claim.resolutionNote}
                </p>
              )}

              {claim.status !== "resolved" && (
                <div className="mt-3">
                  {responses[claim.id] ? (
                    <p className="border-t border-line pt-2 text-sm text-ink">
                      Your response: {responses[claim.id]}
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={drafts[claim.id] ?? ""}
                        onChange={(e) =>
                          setDrafts((prev) => ({ ...prev, [claim.id]: e.target.value }))
                        }
                        placeholder="Respond to this claim"
                        className="flex-1 border border-line px-3 py-1.5 text-sm text-ink"
                      />
                      <button
                        onClick={() => handleRespond(claim.id)}
                        className="border border-teal px-3 py-1.5 text-sm text-teal hover:bg-teal hover:text-paper"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClaimsPage() {
  return (
    <ProtectedRoute>
      <ClaimsContent />
    </ProtectedRoute>
  );
}