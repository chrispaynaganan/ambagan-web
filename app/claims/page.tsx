"use client";

// ambagan-web/app/claims/page.tsx
//
// Claims — Kaambag dashboard area (spec §4.3), tied to Protektadong
// Ambag's claim workflow (§18.3). Filing a claim is local-state only, same
// pattern as /report — Protection & Cases isn't a built backend module yet
// (per the project summary's backend "not yet built" list).

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CLAIMS, type MockClaim } from "@/lib/kaambag-mock-data";

const STATUS_LABEL: Record<MockClaim["status"], string> = {
  submitted: "Submitted",
  under_review: "Under review",
  resolved: "Resolved",
};

function ClaimsContent() {
  const [claims, setClaims] = useState<MockClaim[]>(MOCK_CLAIMS);
  const [campaignSlug, setCampaignSlug] = useState(MOCK_CAMPAIGNS[0]?.slug ?? "");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!campaignSlug || !reason.trim()) return;
    setClaims((prev) => [
      {
        id: `local-${Date.now()}`,
        campaignSlug,
        reason: reason.trim(),
        status: "submitted",
        filedDate: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setReason("");
    setSubmitted(true);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Claims</h1>
        <p className="mt-2 max-w-xl text-muted">
          Filed under Protektadong Ambag — every claim goes through Trust
          &amp; Safety review.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-ink">File a new claim</h2>
        <form onSubmit={handleSubmit} className="mt-3 max-w-xl space-y-4 border border-line px-6 py-6">
          <label className="block text-sm text-ink">
            Which campaign?
            <select
              value={campaignSlug}
              onChange={(e) => setCampaignSlug(e.target.value)}
              className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
            >
              {MOCK_CAMPAIGNS.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-ink">
            What happened?
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
              className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
            />
          </label>

          <button
            type="submit"
            className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark"
          >
            Submit claim
          </button>

          {submitted && (
            <p className="text-sm text-teal">
              Claim submitted — you&apos;ll be notified of any updates.
            </p>
          )}
        </form>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">Your claims</h2>
        {claims.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No claims filed.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {claims.map((claim) => {
              const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === claim.campaignSlug);
              return (
                <div key={claim.id} className="border border-line px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-ink">
                      {campaign?.title ?? claim.campaignSlug}
                    </h3>
                    <span className="font-mono text-xs text-muted">
                      {STATUS_LABEL[claim.status]} · {claim.filedDate}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{claim.reason}</p>
                  {claim.resolutionNote && (
                    <p className="mt-2 border-t border-line pt-2 text-sm text-ink">
                      {claim.resolutionNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
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