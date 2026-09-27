"use client";

// ambagan-web/app/recipient/unbanked/page.tsx
//
// Simplified recipient home — unbanked/access-limited recipient (spec
// §4.3, §12.2). Deliberately different from the banked dashboard, not
// just a stripped-down copy: REC-003 requires a genuinely simplified
// interface for low digital literacy and low-bandwidth devices — fewer
// words per screen, larger touch targets, no tables, and Support Contact
// given equal weight to everything else (REC-004: assisted verification
// through staff is a real, first-class path here, not a fallback).

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_RECIPIENT_LINKS } from "@/lib/recipient-mock-data";

function UnbankedHomeContent() {
  const link = MOCK_RECIPIENT_LINKS.find((l) => l.recipientType === "unbanked");
  const campaign = link ? MOCK_CAMPAIGNS.find((c) => c.slug === link.campaignSlug) : undefined;

  return (
    <div className="max-w-md space-y-8">
      <h1 className="font-serif text-3xl text-ink">Hello</h1>

      {!link || !campaign ? (
        <p className="border border-line px-5 py-8 text-center text-lg text-muted">
          No Ambagan is connected to you yet.
        </p>
      ) : (
        <div className="border border-line px-6 py-6">
          <p className="text-lg text-ink">{campaign.title}</p>
          <p className="mt-3 text-base text-muted">Your status:</p>
          <p className="mt-1 text-xl text-ink">
            {link.verificationStatus === "VERIFIED" ? "Verified" : "Not verified yet"}
          </p>
          {link.incomingMinorUnits !== "0" && (
            <p className="mt-4 text-base text-ink">
              {formatPeso(link.incomingMinorUnits)} is on its way to you.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <Link
          href="/recipient/unbanked/payout-method"
          className="border border-teal bg-teal px-6 py-5 text-center text-lg text-paper hover:bg-teal-dark"
        >
          How I&apos;ll get my money
        </Link>
        <Link
          href="/recipient/unbanked/confirm"
          className="border border-teal px-6 py-5 text-center text-lg text-teal hover:bg-teal hover:text-paper"
        >
          Confirm I received it
        </Link>
      </div>

      <div className="border-t-2 border-gold pt-6">
        <p className="text-base text-ink">Need help?</p>
        <p className="mt-2 text-base text-muted">
          A support person can help you by phone, in person, or through
          someone you trust — you don&apos;t need to do this alone.
        </p>
        <a
          href="tel:+18001234567"
          className="mt-3 inline-block border border-line px-5 py-3 text-lg text-ink hover:border-teal hover:text-teal"
        >
          Call Support
        </a>
      </div>
    </div>
  );
}

export default function UnbankedHomePage() {
  return (
    <ProtectedRoute>
      <UnbankedHomeContent />
    </ProtectedRoute>
  );
}