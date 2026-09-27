"use client";

// ambagan-web/app/followed/page.tsx
//
// Followed Ambagans — Kaambag dashboard area (spec §4.3). Unfollow is
// local-state only — there's no follows endpoint to persist to yet, so a
// page refresh resets it. Flagged rather than hidden.

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { CampaignCard } from "@/components/campaign-card";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_FOLLOWED_SLUGS } from "@/lib/kaambag-mock-data";

function FollowedContent() {
  const [followed, setFollowed] = useState<string[]>(MOCK_FOLLOWED_SLUGS);

  const campaigns = MOCK_CAMPAIGNS.filter((c) => followed.includes(c.slug));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Followed Ambagans</h1>
        <p className="mt-2 max-w-xl text-muted">
          Campaigns you&apos;re keeping an eye on, whether or not
          you&apos;ve contributed yet.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          You&apos;re not following any Ambagans yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {campaigns.map((c) => (
            <div key={c.slug} className="space-y-2">
              <CampaignCard campaign={c} />
              <button
                onClick={() => setFollowed((prev) => prev.filter((slug) => slug !== c.slug))}
                className="w-full border border-line px-3 py-1.5 text-xs text-ink/70 hover:border-danger hover:text-danger"
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FollowedPage() {
  return (
    <ProtectedRoute>
      <FollowedContent />
    </ProtectedRoute>
  );
}