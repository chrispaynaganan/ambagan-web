"use client";

// ambagan-web/app/category/[slug]/page.tsx
//
// Category landing — Visitor persona (spec §4.1's "Category landing" row).
// The spec's required content for this page is thin — essentially "browse
// campaigns in this category" — so this is built as Discover's search +
// sort, scoped to one fixed category instead of a picker, reusing the same
// mock data and CampaignCard.
//
// params.slug handled as possibly string[] the same way
// campaigns/[id]/manage and campaigns/[id]/recipients already do, per the
// noUncheckedIndexedAccess convention.

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CampaignCard } from "@/components/campaign-card";
import { MOCK_CAMPAIGNS, categoryFromSlug } from "@/lib/mock-data";

type SortOption = "recommended" | "newest";

export default function CategoryLandingPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const category = typeof slug === "string" ? categoryFromSlug(slug) : undefined;

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  const results = useMemo(() => {
    if (!category) return [];
    const q = query.trim().toLowerCase();

    const filtered = MOCK_CAMPAIGNS.filter((c) => {
      if (c.category !== category) return false;
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
  }, [category, query, sortBy]);

  if (!category) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-ink">Category not found</h1>
        <p className="text-muted">
          That category doesn&apos;t exist yet.{" "}
          <Link href="/discover" className="text-teal hover:text-teal-dark">
            Browse all Ambagans instead →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-muted">
          Category
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">{category}</h1>
        <p className="mt-2 text-muted">
          {results.length} {results.length === 1 ? "Ambagan" : "Ambagans"} in
          this category.
        </p>
      </div>

      <div className="flex flex-col gap-4 border border-line px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search within this category"
          className="w-full flex-1 border border-line px-3 py-2 text-sm text-ink sm:min-w-[240px]"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="border border-line px-3 py-2 text-sm text-ink"
        >
          <option value="recommended">Recommended</option>
          <option value="newest">Newest</option>
        </select>

        <Link href="/discover" className="text-sm text-teal hover:text-teal-dark">
          ← All categories
        </Link>
      </div>

      {results.length === 0 ? (
        <p className="border border-line px-5 py-8 text-center text-muted">
          No Ambagans in this category yet.
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