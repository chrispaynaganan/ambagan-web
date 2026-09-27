"use client";

// ambagan-web/app/provider/[token]/page.tsx
//
// Provider/institution portal — spec §3 ("Verified destination or
// one-time secure portal") and §4.3 ("Secure payment request/invoice
// confirmation, payout details, payment status, receipt confirmation.
// Full account optional; one-time signed portal links allowed").
//
// Deliberately NOT wrapped in <ProtectedRoute> — that's the whole point
// of this persona. A provider (hospital, school, pharmacy, landlord,
// shelter, funeral home) shouldn't need to create an Ambagan account just
// to confirm one invoice. Access is entirely by possessing the link.
//
// No real backend generates these tokens yet (see the note in
// lib/provider-mock-data.ts) — this is the frontend flow only, not a
// security design. A real version needs signed, expiring, single-use
// tokens issued server-side.

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_PROVIDER_REQUESTS, type ProviderRequestStatus } from "@/lib/provider-mock-data";

export default function ProviderPortalPage() {
  const params = useParams();
  const rawToken = params.token;
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const initial = typeof token === "string" ? MOCK_PROVIDER_REQUESTS[token] : undefined;
  const [status, setStatus] = useState<ProviderRequestStatus | undefined>(initial?.status);

  if (!initial) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="font-serif text-2xl text-ink">Link not found</h1>
        <p className="text-muted">
          This link may have expired, already been used, or been typed
          incorrectly. Contact the Katiwala who sent it for a new one.
        </p>
      </div>
    );
  }

  const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === initial.campaignSlug);

  return (
    <div className="mx-auto max-w-md space-y-8">
      <div>
        <div className="h-px w-16 bg-gold" />
        <h1 className="mt-4 font-serif text-2xl text-ink">{initial.providerName}</h1>
        <p className="mt-1 text-sm text-muted">
          Payment request for{" "}
          {campaign ? (
            <Link href={`/ambagan/${campaign.slug}`} className="text-teal hover:text-teal-dark">
              {campaign.title}
            </Link>
          ) : (
            initial.campaignSlug
          )}
        </p>
      </div>

      <div className="border border-line px-6 py-6">
        <p className="text-sm text-muted">Invoice</p>
        <p className="mt-1 text-ink">{initial.invoiceDescription}</p>
        <p className="mt-3 font-mono text-2xl text-ink">
          {formatPeso(initial.invoiceAmountMinorUnits)}
        </p>
      </div>

      {status === "pending_confirmation" && (
        <div className="space-y-3">
          <p className="text-sm text-ink">Is this invoice correct?</p>
          <button
            onClick={() => setStatus("invoice_confirmed")}
            className="w-full rounded bg-teal px-5 py-3 text-paper hover:bg-teal-dark"
          >
            Confirm invoice
          </button>
        </div>
      )}

      {status === "invoice_confirmed" && (
        <p className="border border-line px-5 py-4 text-sm text-muted">
          Invoice confirmed. Waiting for payment to be sent.
        </p>
      )}

      {status === "payment_sent" && (
        <div className="space-y-3">
          <p className="text-sm text-ink">Payment has been sent to you. Did you receive it?</p>
          <button
            onClick={() => setStatus("receipt_confirmed")}
            className="w-full rounded bg-teal px-5 py-3 text-paper hover:bg-teal-dark"
          >
            Confirm receipt
          </button>
        </div>
      )}

      {status === "receipt_confirmed" && (
        <p className="border border-teal px-5 py-4 text-sm text-ink">
          Thank you — this request is complete.
        </p>
      )}
    </div>
  );
}