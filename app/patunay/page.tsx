// ambagan-web/app/patunay/page.tsx
//
// Patunay explained — Visitor persona (spec §4.1: "Evidence standards and
// public accountability."). Static content, plain server component.
// Content drawn directly from §15 (Patunay Accountability System).

const PATUNAY_TYPES = [
  {
    type: "Payment proof",
    examples: "Processor confirmation, bank/e-wallet settlement reference, cash pickup redemption.",
    verification: "System/partner-verified where possible.",
  },
  {
    type: "Provider proof",
    examples: "Hospital receipt, school official receipt, pharmacy invoice, rent receipt.",
    verification: "Provider confirmation, document review, duplicate detection.",
  },
  {
    type: "Recipient proof",
    examples: "Recipient confirms full or partial receipt.",
    verification: "Authenticated dashboard/assisted confirmation.",
  },
  {
    type: "Purchase/use proof",
    examples: "Receipts for essentials, transport, temporary housing, medicine.",
    verification: "Document/media review and allocation matching.",
  },
  {
    type: "Outcome update",
    examples: "What the funds accomplished or what changed.",
    verification: "Narrative + evidence appropriate to sensitivity.",
  },
  {
    type: "Exception evidence",
    examples: "Reason planned use changed or recipient route changed.",
    verification: "Human review and public disclosure where material.",
  },
];

export default function PatunayPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-ink">Patunay explained</h1>
        <p className="mt-2 max-w-xl text-muted">
          Patunay is the structured evidence system that closes the loop
          after funds are collected or released. It can come from the
          Katiwala, the recipient, the payment processor, a provider, or a
          platform reviewer.
        </p>
      </div>

      <section>
        <h2 className="font-serif text-xl text-ink">Types of Patunay</h2>
        <div className="mt-4 space-y-3">
          {PATUNAY_TYPES.map((p) => (
            <div key={p.type} className="border border-line px-5 py-4">
              <h3 className="font-serif text-ink">{p.type}</h3>
              <p className="mt-1 text-sm text-ink">{p.examples}</p>
              <p className="mt-1 text-xs text-muted">{p.verification}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">How this protects everyone</h2>
        <ul className="mt-3 space-y-3 text-sm text-ink">
          <li>
            Every campaign has a Patunay obligation schedule matched to its
            purpose and payout route.
          </li>
          <li>
            Public Patunay is redacted first — IDs, full addresses, account
            numbers, medical identifiers, and minors&apos; sensitive
            information are removed before anything is shown publicly.
          </li>
          <li>
            If a submission is rejected, the Katiwala gets a reason and a
            path to resubmit — it&apos;s not a dead end.
          </li>
          <li>
            Missing a required Patunay can affect a Katiwala&apos;s future
            privileges and public trust record after due process, but it
            does not automatically confiscate money already legitimately
            delivered to a recipient or provider.
          </li>
        </ul>
      </section>
    </div>
  );
}