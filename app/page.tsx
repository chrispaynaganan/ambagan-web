import Link from "next/link";
import { CampaignCard } from "@/components/campaign-card";
import { getFeaturedCampaigns, categorySlug, CAMPAIGN_CATEGORIES } from "@/lib/mock-data";

// Home — Visitor persona (spec §4.1), pure-frontend pass. No ambagan-api
// calls yet: "Featured Ambagans" and "Categories" render from
// lib/mock-data.ts. Links to /category/{slug} and /ambagan/{slug} are
// wired for when those screens exist — expect 404s on those specific links
// until we build them, since we're doing this one persona/screen at a
// time. /login and /discover are real today.
//
// Headline/subtext copy below is a placeholder for layout purposes, not
// reviewed marketing copy — get real PH-market English/Filipino copy
// signed off before this ships.

const TRUST_STEPS = [
  {
    step: "01",
    title: "Katiwala verified",
    body: "Every campaign steward is identity-verified before they can publish.",
  },
  {
    step: "02",
    title: "Kaambag contributes",
    body: "Funds stay inside regulated payment infrastructure the whole time.",
  },
  {
    step: "03",
    title: "Patunay submitted",
    body: "Proof of delivery or use is required, not an optional update.",
  },
  {
    step: "04",
    title: "Tiwala earned",
    body: "Verified Kaambags can each give one trust signal, building the Katiwala's public record.",
  },
] as const;

export default function HomePage() {
  const featured = getFeaturedCampaigns();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section>
        <div className="h-px w-16 bg-gold" />
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-ink">
          Give with proof. Build real trust.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Ambagan is a Philippine-native donation platform built around a
          closed accountability loop — identity verification, fund custody
          through regulated payment infrastructure, mandatory proof of
          delivery, and a public trust record for every{" "}
          <span className="font-medium text-ink">Katiwala</span>.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/login"
            className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark"
          >
            Tara, ambagan.
          </Link>
          <Link
            href="/discover"
            className="rounded border border-teal px-5 py-2.5 text-teal hover:bg-teal hover:text-paper"
          >
            Discover Ambagans
          </Link>
        </div>
      </section>

      {/* Trust explanation */}
      <section className="border border-line">
        <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {TRUST_STEPS.map((item) => (
            <div key={item.step} className="px-6 py-6">
              <p className="font-mono text-xs text-muted">{item.step}</p>
              <h3 className="mt-2 font-serif text-lg text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="font-serif text-2xl text-ink">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {CAMPAIGN_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${categorySlug(category)}`}
              className="rounded border border-line px-4 py-2 text-sm text-ink/80 hover:border-teal hover:text-teal"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Ambagans */}
      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-ink">Featured Ambagans</h2>
          <Link href="/discover" className="text-sm text-teal hover:text-teal-dark">
            See all →
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featured.map((c) => (
            <CampaignCard key={c.slug} campaign={c} />
          ))}
        </div>
      </section>
    </div>
  );
}