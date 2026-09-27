"use client";

// ambagan-web/app/recipient/disputes/page.tsx
//
// Disputes — banked recipient dashboard (spec §12.1). Local state only —
// no confirmed backend route for raising a recipient-side dispute yet.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_RECIPIENT_DISPUTES, type RecipientDispute } from "@/lib/recipient-mock-data";

const DISPUTE_TYPES: { value: RecipientDispute["type"]; label: string }[] = [
  { value: "non_receipt", label: "I didn't receive funds" },
  { value: "unauthorized_campaign", label: "This campaign wasn't authorized by me" },
  { value: "misrepresentation", label: "My story/identity was misrepresented" },
  { value: "misuse", label: "Funds were misused" },
];

function DisputesContent() {
  const [disputes, setDisputes] = useState<RecipientDispute[]>(MOCK_RECIPIENT_DISPUTES);
  const [campaignSlug, setCampaignSlug] = useState(MOCK_CAMPAIGNS[0]?.slug ?? "");
  const [type, setType] = useState<RecipientDispute["type"]>("non_receipt");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    setDisputes((prev) => [
      {
        id: `local-${Date.now()}`,
        campaignSlug,
        type,
        description: description.trim(),
        status: "submitted",
        filedDate: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setDescription("");
  }

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <Link href="/recipient" className="text-sm text-teal hover:text-teal-dark">
          ← Campaigns for Me
        </Link>
        <h1 className="mt-2 font-serif text-3xl text-ink">Disputes</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Raise a concern</h2>

        <label className="block text-sm text-ink">
          Campaign
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
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value as RecipientDispute["type"])}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          >
            {DISPUTE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-ink">
          Details
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>

        <button type="submit" className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark">
          Submit
        </button>
      </form>

      <section>
        <h2 className="font-serif text-lg text-ink">Your disputes</h2>
        {disputes.length === 0 ? (
          <p className="mt-3 text-sm text-muted">None filed.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {disputes.map((d) => {
              const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === d.campaignSlug);
              return (
                <div key={d.id} className="border border-line px-5 py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-ink">{campaign?.title ?? d.campaignSlug}</h3>
                    <span className="font-mono text-xs text-muted">
                      {d.status} · {d.filedDate}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{d.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function DisputesPage() {
  return (
    <ProtectedRoute>
      <DisputesContent />
    </ProtectedRoute>
  );
}