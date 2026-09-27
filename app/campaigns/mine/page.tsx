"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/lib/auth/use-require-auth";
import { ApiError } from "@/lib/api/client";
import { listCampaigns, type Campaign } from "@/lib/api/campaigns";
import { formatPeso } from "@/lib/money";
import { CAMPAIGN_STATE_INFO, toneClasses } from "@/lib/campaign-state";

export default function MyCampaignsPage() {
  const { user, ready } = useRequireAuth();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    listCampaigns({ katiwalaUserId: user.id, limit: 50 })
      .then((result) => setCampaigns(result.items))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Couldn't load your campaigns."),
      );
  }, [ready, user]);

  if (!ready) {
    return <p className="p-8 text-stone-600">Loading…</p>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-stone-900">My Campaigns</h1>
        <Link
          href="/campaigns/new"
          className="border border-teal-800 bg-teal-800 px-4 py-2 text-sm text-white hover:bg-teal-900"
        >
          + New campaign
        </Link>
      </div>

      {error && (
        <p className="mt-6 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      )}

      {campaigns === null && !error && (
        <p className="mt-8 text-stone-600">Loading your campaigns…</p>
      )}

      {campaigns !== null && campaigns.length === 0 && (
        <p className="mt-8 text-stone-600">
          You haven&apos;t started a campaign yet.{" "}
          <Link href="/campaigns/new" className="text-teal-800 underline">
            Start one now
          </Link>
          .
        </p>
      )}

      <ul className="mt-8 divide-y divide-stone-200 border-t border-stone-200">
        {campaigns?.map((c) => {
          const info = CAMPAIGN_STATE_INFO[c.lifecycleState];
          return (
            <li key={c.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-serif text-lg text-stone-900">{c.title}</p>
                <p className="mt-1 font-mono text-sm text-stone-600">
                  Goal: {formatPeso(c.goalAmountMinorUnits, c.currency)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`border px-2 py-1 text-xs font-medium ${toneClasses(info.tone)}`}>
                  {info.label}
                </span>
                <Link
                  href={`/campaigns/${c.id}/manage`}
                  className="border border-stone-400 px-3 py-1.5 text-sm text-stone-800 hover:border-teal-800 hover:text-teal-800"
                >
                  Manage
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}