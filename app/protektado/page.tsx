// ambagan-web/app/protektado/page.tsx
//
// Protektadong Ambag — Visitor persona (spec §4.1: "Coverage, exclusions,
// claims, investigation, refund/recovery logic."). Static content, plain
// server component. Content drawn directly from §18, §18.1–18.3.
//
// The "not insurance" line isn't optional framing — the canonical naming
// table (§1.1) explicitly requires it not be presented as insurance unless
// legal counsel and licensing structure support that classification. Don't
// soften or drop this line.

const COVERED = [
  "Materially fabricated campaign story, confirmed by investigation.",
  "Fake or impersonated recipient.",
  "Confirmed deliberate synthetic/manipulated factual evidence.",
  "Intentional diversion of funds from the represented purpose without proper disclosure or approval.",
  "Recipient did not receive funds represented as delivered.",
  "Provider payment falsely represented as completed.",
  "Falsified required Patunay.",
  "Unauthorized use of a recipient's identity where authorization was required.",
];

const EXCLUDED = [
  "Campaign did not reach its goal or milestone.",
  "Treatment, project, or personal outcome failed despite legitimate use of funds.",
  "Recipient died after legitimate fundraising/use.",
  "Donor changed their mind absent an applicable refund basis.",
  "Minor good-faith allocation changes that were transparently disclosed and accepted.",
  "Normal processing delays that don't amount to misuse or non-delivery.",
];

const CLAIM_STEPS = [
  "Claim/report submitted with campaign, contribution, reason, and supporting material.",
  "System immediately evaluates whether unreleased funds should be placed on hold.",
  "Case triage assigns severity, ownership, response deadline, and evidence requests.",
  "The Katiwala, recipient, or provider gets a fair chance to respond, unless doing so would create a material safety or fraud risk.",
  "Trust & Safety investigates payment records, campaign history, verification, Patunay, and supporting evidence.",
  "Decision: no issue, corrective action, partial/full refund, redirected/recovered funds, suspension, or escalation.",
  "Both parties receive a decision notice and an appeal path where appropriate.",
  "The case only updates public trust record once it meets the criteria for confirmed public impact.",
];

export default function ProtektadoPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-ink">Protektadong Ambag</h1>
        <p className="mt-2 max-w-xl text-muted">
          A platform-backed protection policy for both donors and
          recipients. This is <span className="font-medium text-ink">not insurance</span> —
          it's a set of hold, investigation, and recovery mechanics built on
          top of Ambagan's payout-first controls.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-ink">What's covered</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink">
          {COVERED.map((c) => (
            <li key={c} className="border-b border-line py-2">
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">What's not covered</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink">
          {EXCLUDED.map((e) => (
            <li key={e} className="border-b border-line py-2">
              {e}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink">How a claim is handled</h2>
        <ol className="mt-4 space-y-3">
          {CLAIM_STEPS.map((step, i) => (
            <li key={step} className="flex gap-4 border border-line px-5 py-3">
              <span className="font-mono text-sm text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-sm text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border border-line px-6 py-6">
        <p className="text-sm text-muted">
          Reimbursement is limited to approved policy, available recoveries,
          reserve capacity, legal terms, and payment-partner capabilities —
          Ambagan does not promise unlimited reimbursement it can't fund.
        </p>
      </section>
    </div>
  );
}