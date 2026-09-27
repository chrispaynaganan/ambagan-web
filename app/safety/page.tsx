// ambagan-web/app/safety/page.tsx
//
// Trust & Safety Center — Visitor persona (spec §4.1: "Verification, media
// authenticity, fraud reporting, payout protection."). Static content,
// plain server component. Content drawn from §5 (KYC), §16 (Media
// Authenticity), and ties into /report and /protektado rather than
// repeating their full detail here.

import Link from "next/link";

export default function SafetyPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-serif text-3xl text-ink">Trust &amp; Safety Center</h1>
        <p className="mt-2 max-w-xl text-muted">
          Four things keep Ambagan accountable: who we verify, what counts
          as real evidence, how concerns get reported, and how payouts are
          protected.
        </p>
      </div>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">Verification</h2>
        <ul className="mt-3 space-y-3 text-sm text-ink">
          <li>
            Identity verification supports in-browser camera capture or
            secure file upload, and runs integrity, tampering, duplicate-
            reuse, and synthetic-media checks.
          </li>
          <li>
            The normal review window is 1 to 3 business days — a guideline,
            not a contractual guarantee.
          </li>
          <li>
            A Katiwala cannot publish a campaign until identity verification
            is complete.
          </li>
          <li>
            Reviewers only see the data needed for their specific job; raw
            ID access is permission-gated and audited.
          </li>
        </ul>
      </section>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">Media authenticity</h2>
        <ul className="mt-3 space-y-3 text-sm text-ink">
          <li>
            AI-generated or materially synthetic images and video are
            prohibited as campaign evidence or factual campaign media.
            AI-assisted text is allowed.
          </li>
          <li>
            Uploads run through file-integrity, provenance, duplicate-reuse,
            and manipulation/synthetic-risk screening.
          </li>
          <li>
            A detector result alone never permanently bans anyone — a
            high-confidence detection blocks the upload and creates a human
            review event instead.
          </li>
        </ul>
      </section>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">Fraud reporting</h2>
        <p className="mt-2 text-sm text-ink">
          Every campaign has a persistent &quot;Report concern&quot; action.
          You can report a campaign, media, a user, a payout, impersonation,
          or fraud.
        </p>
        <Link href="/report" className="mt-3 inline-block text-sm text-teal hover:text-teal-dark">
          Report a concern →
        </Link>
      </section>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">Payout protection</h2>
        <p className="mt-2 text-sm text-ink">
          Funds are routed toward the recipient, a provider, or a regulated
          cash-pickup option ahead of the Katiwala's own control by default.
          If something goes wrong, Protektadong Ambag covers the claim,
          hold, and investigation process.
        </p>
        <Link
          href="/protektado"
          className="mt-3 inline-block text-sm text-teal hover:text-teal-dark"
        >
          See Protektadong Ambag →
        </Link>
      </section>
    </div>
  );
}