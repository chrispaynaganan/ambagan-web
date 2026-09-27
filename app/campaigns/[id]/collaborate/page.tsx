"use client";

// ambagan-web/app/campaigns/[id]/collaborate/page.tsx
//
// The actual collaborator workspace — spec §3: "may edit story, post
// updates, or view campaign metrics as assigned. Cannot receive/request
// funds unless separately authorized." Only those three things are here,
// nothing else — no Payouts, no Compliance, no Team, no submit-for-review.
//
// Access: the campaign owner (who can see everything a collaborator can)
// or a person listed in MOCK_COLLABORATOR_ACCESS for this specific
// campaign, with sections shown only for the permissions they were
// actually granted.
//
// Story edits append a new version rather than overwriting — mirrors the
// real Campaign.story jsonb shape confirmed in §4.7 (append-only array of
// {version, content, updatedAt}), and matches how UpdateCampaignDto's
// storyContent field is described as behaving for the owner's own edits.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_COLLABORATOR_ACCESS } from "@/lib/collaborator-mock-data";

interface LocalStoryVersion {
  version: number;
  content: string;
  updatedAt: string;
}

function CollaborateContent() {
  const { campaign, loading, error, isOwner } = useOwnedCampaign();

  const [storyVersions, setStoryVersions] = useState<LocalStoryVersion[]>([]);
  const [storyDraft, setStoryDraft] = useState("");
  const [updates, setUpdates] = useState<{ date: string; title: string; body: string }[]>([]);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateBody, setUpdateBody] = useState("");

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;

  const summary = MOCK_CAMPAIGNS.find((c) => c.slug === campaign.slug);
  const access = MOCK_COLLABORATOR_ACCESS.find((a) => a.campaignSlug === campaign.slug);

  if (!isOwner && !access) {
    return <p className="text-ink">You don&apos;t have access to this page.</p>;
  }

  // Owner sees everything; a collaborator sees only what they were granted.
  const permissions = isOwner
    ? { canEditStory: true, canPostUpdates: true, canViewMetrics: true }
    : access!.permissions;

  function handleStorySave(e: React.FormEvent) {
    e.preventDefault();
    if (!storyDraft.trim()) return;
    setStoryVersions((prev) => [
      ...prev,
      {
        version: prev.length + 1,
        content: storyDraft.trim(),
        updatedAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    setStoryDraft("");
  }

  function handlePostUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!updateTitle.trim()) return;
    setUpdates((prev) => [
      { date: new Date().toISOString().slice(0, 10), title: updateTitle.trim(), body: updateBody.trim() },
      ...prev,
    ]);
    setUpdateTitle("");
    setUpdateBody("");
  }

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <Link href="/collaborating" className="text-sm text-teal hover:text-teal-dark">
          ← Campaigns you&apos;re helping with
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">{campaign.title}</h1>
        {!isOwner && (
          <p className="mt-1 text-xs text-muted">
            You&apos;re a collaborator here ({access!.role}), not the owner — you
            can&apos;t receive or request funds on this campaign.
          </p>
        )}
      </div>

      {permissions.canViewMetrics && summary && (
        <section className="grid grid-cols-2 gap-3">
          <div className="border border-line px-4 py-3">
            <p className="text-sm text-muted">Raised</p>
            <p className="mt-1 font-mono text-ink">{formatPeso(summary.raisedMinorUnits)}</p>
          </div>
          <div className="border border-line px-4 py-3">
            <p className="text-sm text-muted">Goal</p>
            <p className="mt-1 font-mono text-ink">{formatPeso(summary.goalMinorUnits)}</p>
          </div>
        </section>
      )}

      {permissions.canEditStory && (
        <section>
          <h2 className="font-serif text-lg text-ink">Story</h2>
          <p className="mt-1 text-xs text-muted">
            Each save adds a new version — it never overwrites what&apos;s
            already there.
          </p>
          <form onSubmit={handleStorySave} className="mt-3 space-y-3 border border-line px-5 py-5">
            <textarea
              value={storyDraft}
              onChange={(e) => setStoryDraft(e.target.value)}
              rows={4}
              placeholder="Write the next version of the story…"
              className="block w-full border border-line px-3 py-2 text-sm text-ink"
            />
            <button
              type="submit"
              className="rounded bg-teal px-4 py-2 text-sm text-paper hover:bg-teal-dark"
            >
              Save new version
            </button>
          </form>
          {storyVersions.length > 0 && (
            <div className="mt-3 space-y-2">
              {storyVersions
                .slice()
                .reverse()
                .map((v) => (
                  <div key={v.version} className="border-b border-line pb-2 text-sm">
                    <p className="font-mono text-xs text-muted">
                      v{v.version} · {v.updatedAt}
                    </p>
                    <p className="mt-1 text-ink">{v.content}</p>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {permissions.canPostUpdates && (
        <section>
          <h2 className="font-serif text-lg text-ink">Post an update</h2>
          <form onSubmit={handlePostUpdate} className="mt-3 space-y-3 border border-line px-5 py-5">
            <input
              type="text"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              placeholder="Update title"
              className="block w-full border border-line px-3 py-2 text-sm text-ink"
            />
            <textarea
              value={updateBody}
              onChange={(e) => setUpdateBody(e.target.value)}
              rows={3}
              placeholder="Details"
              className="block w-full border border-line px-3 py-2 text-sm text-ink"
            />
            <button
              type="submit"
              className="rounded bg-teal px-4 py-2 text-sm text-paper hover:bg-teal-dark"
            >
              Post update
            </button>
          </form>
          {updates.length > 0 && (
            <div className="mt-3 space-y-2">
              {updates.map((u, i) => (
                <div key={`${u.date}-${i}`} className="border-b border-line pb-2 text-sm">
                  <p className="font-mono text-xs text-muted">{u.date}</p>
                  <p className="text-ink">{u.title}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function CollaboratePage() {
  return (
    <ProtectedRoute>
      <CollaborateContent />
    </ProtectedRoute>
  );
}