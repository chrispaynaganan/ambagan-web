"use client";

// ambagan-web/app/campaigns/[id]/patunay/page.tsx
//
// Patunay — Katiwala dashboard area (spec §4.3, §15). Real Evidence/
// Patunay entities exist and were live-HTTP-verified per the project
// summary, but the exact submit-evidence request shape wasn't in the
// confirmed contracts I have — "Submit Patunay" appends to local state
// only. Wire to evidence-patunay.controller.ts's real DTO once shared.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";

interface LocalPatunay {
  date: string;
  title: string;
  summary: string;
  verified: boolean;
}

function PatunayContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();
  const [extra, setExtra] = useState<LocalPatunay[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  const detail = MOCK_CAMPAIGN_DETAILS[campaign.slug];
  const entries = [...(detail?.patunay ?? []), ...extra];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setExtra((prev) => [
      ...prev,
      {
        date: new Date().toISOString().slice(0, 10),
        title: title.trim(),
        summary: summary.trim(),
        verified: false,
      },
    ]);
    setTitle("");
    setSummary("");
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Patunay</h1>
        <p className="mt-1 text-sm text-muted">
          Proof of delivery or use — public versions are redacted of IDs,
          addresses, and other sensitive details (PAT-003).
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="border border-line px-5 py-6 text-center text-muted">
          No Patunay submitted yet.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((p, i) => (
            <div key={`${p.title}-${i}`} className="border border-line px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-ink">{p.title}</h3>
                <span className={`text-xs ${p.verified ? "text-teal" : "text-muted"}`}>
                  {p.verified ? "Verified" : "Pending review"}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{p.date}</p>
              <p className="mt-2 text-sm text-ink">{p.summary}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Submit new Patunay</h2>

        <label className="block text-sm text-ink">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dialysis center receipt — Month 2"
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>

        <label className="block text-sm text-ink">
          Summary
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark"
        >
          Submit for review
        </button>
      </form>
    </div>
  );
}

export default function PatunayPage() {
  return (
    <ProtectedRoute>
      <PatunayContent />
    </ProtectedRoute>
  );
}