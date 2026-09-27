"use client";

// ambagan-web/app/recipient/payout-destination/page.tsx
//
// Payout Destination — banked recipient dashboard (spec §12.1). No real
// PayoutDestination-creation route was in the confirmed campaigns
// contract, and there's no PayMongo tokenization configured — this is a
// UI shell, same honesty pattern as /account/payment-methods.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";

function PayoutDestinationContent() {
  const [changing, setChanging] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href="/recipient" className="text-sm text-teal hover:text-teal-dark">
          ← Campaigns for Me
        </Link>
        <h1 className="mt-2 font-serif text-3xl text-ink">Payout destination</h1>
      </div>

      <div className="border border-line px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-ink">GCash •••• 4821</p>
          <span className="border border-teal px-2 py-0.5 text-xs text-teal">
            Ownership verified
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">
          Name on account matches your verified identity.
        </p>
      </div>

      {!changing ? (
        <button
          onClick={() => setChanging(true)}
          className="border border-line px-4 py-2 text-sm text-ink/80 hover:border-teal hover:text-teal"
        >
          Change destination
        </button>
      ) : (
        <div className="space-y-4 border border-line px-6 py-6">
          <p className="text-sm text-muted">
            Changing your payout destination re-triggers ownership
            verification before it&apos;s active — this form doesn&apos;t
            call a real endpoint yet.
          </p>
          <label className="block text-sm text-ink">
            Account name
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
            />
          </label>
          <label className="block text-sm text-ink">
            Account/mobile number
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
            />
          </label>
          <button
            disabled
            title="No confirmed payout-destination route yet"
            className="border border-line px-4 py-2 text-sm text-muted opacity-50"
          >
            Submit for verification
          </button>
        </div>
      )}
    </div>
  );
}

export default function PayoutDestinationPage() {
  return (
    <ProtectedRoute>
      <PayoutDestinationContent />
    </ProtectedRoute>
  );
}