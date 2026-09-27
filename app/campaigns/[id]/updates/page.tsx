"use client";

// ambagan-web/app/campaigns/[id]/updates/page.tsx
//
// Updates — Katiwala dashboard area (spec §4.3). These are the same
// updates Campaign Detail's public "Updates" section reads from
// campaign-detail-data.ts — posting a new one here only appends to local
// state, it doesn't write back to that shared mock file, so a refresh
// loses anything typed here. No confirmed backend route for this exists
// yet either.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";

interface LocalUpdate {
  date: string;
  title: string;
  body: string;
}

function UpdatesContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();
  const [extra, setExtra] = useState<LocalUpdate[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  const detail = MOCK_CAMPAIGN_DETAILS[campaign.slug];
  const updates = [...extra, ...(detail?.updates ?? [])];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setExtra((prev) => [
      { date: new Date().toISOString().slice(0, 10), title: title.trim(), body: body.trim() },
      ...prev,
    ]);
    setTitle("");
    setBody("");
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Updates</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Post an update</h2>
        <label className="block text-sm text-ink">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block text-sm text-ink">
          Details
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>
        <button type="submit" className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark">
          Post update
        </button>
      </form>

      {updates.length === 0 ? (
        <p className="border border-line px-5 py-6 text-center text-muted">No updates posted yet.</p>
      ) : (
        <div className="space-y-4">
          {updates.map((u, i) => (
            <div key={`${u.date}-${i}`} className="border-b border-line pb-4">
              <p className="font-mono text-xs text-muted">{u.date}</p>
              <h3 className="font-serif text-ink">{u.title}</h3>
              <p className="mt-1 text-sm text-muted">{u.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UpdatesPage() {
  return (
    <ProtectedRoute>
      <UpdatesContent />
    </ProtectedRoute>
  );
}