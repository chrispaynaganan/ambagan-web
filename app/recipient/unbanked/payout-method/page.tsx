"use client";

// ambagan-web/app/recipient/unbanked/payout-method/page.tsx
//
// Payout Method — unbanked recipient (spec §12.2). REC-002's explicit
// order: provider payment, regulated cash pickup, assisted account
// access, verified proxy — presented in that order, not alphabetically or
// as an arbitrary list. Selecting one is local state; nothing here calls
// a real endpoint.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";

const METHODS = [
  { id: "provider", label: "Paid directly to my provider", note: "e.g. hospital, school, pharmacy" },
  { id: "cash_pickup", label: "Cash pickup", note: "Pick up cash at a partner location" },
  { id: "assisted_account", label: "Assisted account access", note: "Someone you trust helps you receive it" },
  { id: "verified_proxy", label: "Verified proxy", note: "Last resort, extra checks apply" },
] as const;

function PayoutMethodContent() {
  const [selected, setSelected] = useState<(typeof METHODS)[number]["id"] | null>(null);

  return (
    <div className="max-w-md space-y-8">
      <div>
        <Link href="/recipient/unbanked" className="text-base text-teal hover:text-teal-dark">
          ← Back
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">How would you like to get your money?</h1>
      </div>

      <div className="space-y-3">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m.id)}
            className={`block w-full border px-5 py-4 text-left ${
              selected === m.id ? "border-teal bg-teal/10" : "border-line hover:border-teal"
            }`}
          >
            <p className="text-lg text-ink">{m.label}</p>
            <p className="mt-1 text-sm text-muted">{m.note}</p>
          </button>
        ))}
      </div>

      {selected && (
        <p className="border border-gold px-5 py-4 text-base text-ink">
          A support person will confirm this with you before it&apos;s final.
        </p>
      )}

      <div className="border-t-2 border-gold pt-6">
        <a
          href="tel:+18001234567"
          className="block border border-line px-5 py-4 text-center text-lg text-ink hover:border-teal hover:text-teal"
        >
          Not sure? Call Support
        </a>
      </div>
    </div>
  );
}

export default function PayoutMethodPage() {
  return (
    <ProtectedRoute>
      <PayoutMethodContent />
    </ProtectedRoute>
  );
}