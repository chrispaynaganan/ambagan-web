"use client";

// ambagan-web/app/campaigns/[id]/milestones/page.tsx
//
// Milestones — Katiwala dashboard area (spec §4.3, §8 MIL-001–005). Fully
// owner-gated via useOwnedCampaign(). Local-state only: the real Milestone
// entity exists (campaigns/entities/milestone.entity.ts, confirmed in your
// tree), but no create/update route for it was in the confirmed campaigns
// contract (§4.7) — only campaign-level routes were. Wire this to a real
// endpoint once that's confirmed rather than guessed.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";

type MilestoneType = "percentage" | "amount" | "date" | "evidence";

interface LocalMilestone {
  id: string;
  title: string;
  description: string;
  type: MilestoneType;
  status: "not_started" | "in_progress" | "completed";
}

function MilestonesContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();

  const [milestones, setMilestones] = useState<LocalMilestone[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<MilestoneType>("percentage");

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setMilestones((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        type,
        status: "not_started",
      },
    ]);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Milestones</h1>
        <p className="mt-1 text-sm text-muted">
          Missing a milestone informs Kaambags, it doesn&apos;t block funds
          already collected (MIL-002).
        </p>
      </div>

      <section>
        {milestones.length === 0 ? (
          <p className="border border-line px-5 py-6 text-center text-muted">
            No milestones added yet.
          </p>
        ) : (
          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m.id} className="border border-line px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-ink">{m.title}</h3>
                  <span className="font-mono text-xs text-muted">
                    {m.type} · {m.status.replace("_", " ")}
                  </span>
                </div>
                {m.description && <p className="mt-1 text-sm text-muted">{m.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <form onSubmit={handleAdd} className="space-y-4 border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Add a milestone</h2>

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
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>

        <label className="block text-sm text-ink">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MilestoneType)}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          >
            <option value="percentage">Percentage-based</option>
            <option value="amount">Amount-based</option>
            <option value="date">Date-based</option>
            <option value="evidence">Evidence-based</option>
          </select>
        </label>

        <button
          type="submit"
          className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark"
        >
          Add milestone
        </button>
      </form>
    </div>
  );
}

export default function MilestonesPage() {
  return (
    <ProtectedRoute>
      <MilestonesContent />
    </ProtectedRoute>
  );
}