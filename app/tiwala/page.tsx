// ambagan-web/app/tiwala/page.tsx
//
// Tiwala & Katiwala levels — Visitor persona (spec §4.1: "Scoring rules,
// eligibility, safeguards, level benefits, what does and does not affect
// public reputation."). Static content, no interactivity needed — plain
// server component. Content drawn directly from §14, §14.1–14.4.

import { KATIWALA_LEVELS, KATIWALA_LEVEL_DETAILS } from "@/lib/katiwala-levels";

const POSITIVE_SIGNALS = [
  "Verified identity.",
  "Completed Ambagan count.",
  "Patunay submitted and accepted on time.",
  "Recipient confirmed receipt.",
  "Provider payment verified.",
  "Required DSWD permit verified.",
  "Purpose changes transparently disclosed and approved.",
  "Resolved disputes and clean long-term history.",
  "Tiwala from eligible verified Kaambags.",
];

const NEGATIVE_SIGNALS = [
  "Missing or repeatedly late required Patunay without accepted explanation.",
  "Confirmed material discrepancy between stated and actual use of funds.",
  "Confirmed beneficiary non-receipt after a represented payout.",
  "False or manipulated receipts/evidence.",
  "Confirmed deliberate use of materially synthetic evidence.",
  "Undisclosed diversion of funds.",
  "Confirmed misrepresentation or identity abuse.",
  "Repeated compliance violations.",
  "Confirmed attempts to bypass approved payout protections.",
  "Upheld serious Protektadong Ambag claim.",
];

const NEUTRAL_SIGNALS = [
  "Failure to reach the funding goal or a milestone.",
  "Small fundraising totals or small donation amounts.",
  "A patient's treatment failing or a recipient dying despite legitimate use of funds.",
  "A campaign being unpopular.",
  "A good-faith change in use that was properly disclosed and approved.",
  "An unproven report or claim that is later denied/unsubstantiated.",
  "Poverty, housing status, location, health condition, or financial exclusion.",
];

export default function TiwalaPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-ink">Tiwala &amp; Katiwala levels</h1>
        <p className="mt-2 max-w-xl text-muted">
          Tiwala is a community trust signal backed by identity and
          transaction eligibility — intentionally not proportional to money.
          A verified Kaambag may give at most one Tiwala per Ambagan,
          regardless of how much they contributed.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-ink">Katiwala levels</h2>
        <div className="mt-4 space-y-3">
          {KATIWALA_LEVELS.map((level) => {
            const d = KATIWALA_LEVEL_DETAILS[level];
            return (
              <div key={level} className="border border-line px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg text-ink">{level}</h3>
                  <span className="font-mono text-xs text-muted">{d.tiwalaRange} Tiwala</span>
                </div>
                <p className="mt-1 text-sm text-muted">{d.gates}</p>
                <p className="mt-2 text-sm text-ink">{d.benefits}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl text-ink">What builds public trust</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            {POSITIVE_SIGNALS.map((s) => (
              <li key={s} className="border-b border-line py-2">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-xl text-ink">What can hurt it</h2>
          <p className="mt-1 text-xs text-muted">
            Only confirmed or fairly established behavior affects public
            reputation — an allegation alone does not.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-ink">
            {NEGATIVE_SIGNALS.map((s) => (
              <li key={s} className="border-b border-line py-2">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">What never affects it</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink">
          {NEUTRAL_SIGNALS.map((s) => (
            <li key={s} className="border-b border-line py-2 last:border-b-0">
              {s}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}