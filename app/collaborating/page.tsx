"use client";

// ambagan-web/app/collaborating/page.tsx
//
// Campaign collaborator — own landing page. Not a spec-named route (§4.3
// has no dedicated row for this actor); named to parallel /my-ambag,
// /followed, etc. Lists campaigns the current person has been added to as
// a collaborator, per lib/collaborator-mock-data.ts.

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_COLLABORATOR_ACCESS } from "@/lib/collaborator-mock-data";

function CollaboratingContent() {
  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Campaigns you&apos;re helping with</h1>
        <p className="mt-2 text-muted">
          Story edits, updates, and metrics — scoped to what each Katiwala
          assigned you.
        </p>
      </div>

      {MOCK_COLLABORATOR_ACCESS.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          You haven&apos;t been added as a collaborator on any campaign yet.
        </p>
      ) : (
        <div className="space-y-3">
          {MOCK_COLLABORATOR_ACCESS.map((access) => {
            const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === access.campaignSlug);
            if (!campaign) return null;
            return (
              <Link
                key={access.campaignSlug}
                href={`/campaigns/${campaign.slug}/collaborate`}
                className="block border border-line px-5 py-4 hover:border-teal"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-ink">{campaign.title}</h3>
                  <span className="font-mono text-xs text-muted">{access.role}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {[
                    access.permissions.canEditStory && "Edit story",
                    access.permissions.canPostUpdates && "Post updates",
                    access.permissions.canViewMetrics && "View metrics",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CollaboratingPage() {
  return (
    <ProtectedRoute>
      <CollaboratingContent />
    </ProtectedRoute>
  );
}