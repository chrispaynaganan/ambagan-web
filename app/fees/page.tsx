// ambagan-web/app/fees/page.tsx
//
// Fees — Visitor persona (spec §4.1: "Maximum 1% sustainability policy,
// processor charges, optional platform support, examples."). Static
// content, plain server component. Content drawn from §10, §10.1.
//
// The worked example below deliberately doesn't put a number on the
// processor fee — that's PayMongo's real, published rate, not something to
// invent here. Swap the bracketed placeholder for the real rate once
// PayMongo sandbox credentials are in (per the project summary's open
// items).

import { KATIWALA_LEVELS, KATIWALA_LEVEL_DETAILS } from "@/lib/katiwala-levels";
import { formatPeso } from "@/lib/money";

export default function FeesPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-ink">Fees</h1>
        <p className="mt-2 max-w-xl text-muted">
          The Ambagan sustainability fee is established at launch and will
          never exceed 1% of a contribution under this Phase 1 policy —
          disclosed from day one, even on the days it's charged less or
          waived entirely.
        </p>
      </div>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">What makes up a contribution</h2>
        <ul className="mt-3 space-y-3 text-sm text-ink">
          <li>
            <span className="font-medium">Sustainability fee</span> — up to
            1.00%, itemized separately, never hidden inside another charge.
          </li>
          <li>
            <span className="font-medium">Processor fee</span> — a
            pass-through cost from the payment provider, itemized
            separately from the sustainability fee.
          </li>
          <li>
            <span className="font-medium">Optional &quot;cover transaction costs&quot;</span> —
            lets a Kaambag add a little extra so the campaign receives the
            full amount they meant to give.
          </li>
          <li>
            <span className="font-medium">Optional &quot;Support Ambagan&quot;</span> — a
            separate, optional tip to the platform, adjustable down to
            zero.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">Worked example</h2>
        <div className="mt-3 border border-line px-5 py-4 text-sm">
          <div className="flex justify-between border-b border-line py-2">
            <span className="text-ink">Contribution</span>
            <span className="font-mono text-ink">{formatPeso("100000")}</span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span className="text-muted">Sustainability fee (up to 1%)</span>
            <span className="font-mono text-muted">
              up to {formatPeso("1000")}
            </span>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <span className="text-muted">Processor fee</span>
            <span className="font-mono text-muted">[varies by payment method]</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-ink">Net to campaign</span>
            <span className="font-mono text-ink">the rest, shown before you confirm</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">Fee rewards by Katiwala level</h2>
        <p className="mt-1 text-xs text-muted">
          Optional configuration — never a substitute for trust/safety
          checks. Suggested defaults, adjustable downward or waived by the
          platform.
        </p>
        <div className="mt-4 space-y-3">
          {KATIWALA_LEVELS.map((level) => (
            <div
              key={level}
              className="flex flex-wrap items-baseline justify-between border border-line px-5 py-3"
            >
              <span className="font-serif text-ink">{level}</span>
              <span className="font-mono text-sm text-muted">
                up to {KATIWALA_LEVEL_DETAILS[level].suggestedMaxFeePct.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}