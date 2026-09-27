"use client";

// ambagan-web/app/discover/page.tsx
//
// Discover — Visitor persona (spec §4.1 + §22). Search/filter/sort against
// lib/mock-data.ts's full campaign list — pure frontend, no ambagan-api
// call yet.
//
// Deliberately simplified against the full spec, flagged here rather than
// silently dropped: DISC-002 lists verification completeness, activity
// freshness, local relevance, category, urgency, and Patunay history as
// real ranking inputs. Mock data doesn't carry most of those signals (no
// real activity/urgency/Patunay fields), so "Recommended" below is just
// the list's natural order, not an actual ranking model — build the real
// one once real campaign records exist. "Newest" is real (sorts on the
// mock postedDaysAgo field). Location/urgency/status filters aren't
// implemented for the same reason — category, verification, and a text
// search are the three mock data actually supports meaningfully.
//
// DISC-001: ranking must not simply reward total money raised — there is
// deliberately no "Most funded" sort option below.

import { useMemo, useState } from "react";
import { CampaignCard } from "@/components/campaign-card";
import { MOCK_CAMPAIGNS, CAMPAIGN_CATEGORIES } from "@/lib/mock-data";

type SortOption = "recommended" | "newest";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = MOCK_CAMPAIGNS.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (verifiedOnly && !c.katiwalaVerified) return false;
      if (q) {
        const haystack = `${c.title} ${c.recipientLine} ${c.location}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "newest") {
      return [...filtered].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    }
    return filtered;
  }, [query, category, verifiedOnly, sortBy]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Discover Ambagans</h1>
        <p className="mt-2 text-muted">
          Every campaign here has gone through review — search, filter, and
          sort to find one to support.
        </p>
      </div>

      <div className="flex flex-col gap-4 border border-line px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, recipient, or location"
          className="w-full flex-1 border border-line px-3 py-2 text-sm text-ink sm:min-w-[240px]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-line px-3 py-2 text-sm text-ink"
        >
          <option value="all">All categories</option>
          {CAMPAIGN_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="border border-line px-3 py-2 text-sm text-ink"
        >
          <option value="recommended">Recommended</option>
          <option value="newest">Newest</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
          />
          Verified Katiwala only
        </label>
      </div>

      {results.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          No Ambagans match those filters yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {results.map((c) => (
            <CampaignCard key={c.slug} campaign={c} />
          ))}
        </div>
      )}
    </div>
  );
}