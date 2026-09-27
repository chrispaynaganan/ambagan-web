// ambagan-web/app/transparency/page.tsx
//
// Platform transparency — spec §4.1: "Aggregate activity, safety
// statistics, resolved claims, fee use, reserve disclosures if approved."
//
// Deliberately no fabricated numbers here. Unlike a homepage headline,
// this page's entire purpose is showing real platform performance —
// inventing plausible-looking stats would mean presenting fiction as fact
// on exactly the page meant to prevent that. Every figure below is a
// labeled placeholder until real aggregation exists.

const STAT_GROUPS = [
  {
    title: "Aggregate activity",
    stats: ["Total Ambagans funded", "Total contributed", "Active Kaambags", "Active Katiwalas"],
  },
  {
    title: "Safety statistics",
    stats: ["Campaigns reviewed", "Verification approval rate", "Media flagged for review"],
  },
  {
    title: "Resolved claims",
    stats: [
      "Protektadong Ambag claims filed",
      "Claims resolved",
      "Funds recovered/redirected",
    ],
  },
  {
    title: "Fee use",
    stats: ["Average effective sustainability fee", "Fee revenue this period"],
  },
];

export default function TransparencyPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-ink">Platform transparency</h1>
        <p className="mt-2 max-w-xl text-muted">
          Aggregate numbers on how Ambagan is actually performing — not
          case-by-case detail, which stays private, but the platform-wide
          picture.
        </p>
      </div>

      {STAT_GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="font-serif text-xl text-ink">{group.title}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {group.stats.map((stat) => (
              <div key={stat} className="border border-line px-4 py-3">
                <p className="text-sm text-muted">{stat}</p>
                <p className="mt-1 font-mono text-lg text-ink">—</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">Reserve disclosures</h2>
        <p className="mt-2 text-sm text-muted">
          Shown here only if/when a Protektadong Ambag reserve fund is
          approved and funded (§18, PROT-003) — not applicable yet.
        </p>
      </section>
    </div>
  );
}