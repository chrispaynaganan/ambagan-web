"use client";

// ambagan-web/app/account/payment-methods/page.tsx
//
// Payment methods — spec §4.2: "Stored tokens only where provider
// permits. Never store raw card data." There's no real PayMongo
// tokenization wired up yet (no sandbox credentials configured, per the
// project summary), so "Add payment method" is disabled rather than
// pretending to collect and store a real card number here — doing that
// for real would need PayMongo's own tokenization flow, not a plain form.

import { ProtectedRoute } from "@/components/protected-route";

const MOCK_SAVED_METHODS = [
  { id: "pm1", label: "GCash", detail: "•••• 4821" },
  { id: "pm2", label: "Visa", detail: "•••• 1188" },
];

function PaymentMethodsContent() {
  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Payment methods</h1>
        <p className="mt-2 text-muted">
          Saved as tokens through our payment partner — never as raw card
          numbers.
        </p>
      </div>

      <div className="border border-line">
        {MOCK_SAVED_METHODS.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between border-b border-line px-5 py-4 text-sm last:border-b-0"
          >
            <span className="text-ink">{m.label}</span>
            <span className="font-mono text-muted">{m.detail}</span>
          </div>
        ))}
      </div>

      <button
        disabled
        title="Adding a payment method needs PayMongo's own tokenization flow — not wired up in this frontend pass"
        className="border border-line px-4 py-2 text-sm text-muted opacity-50"
      >
        Add payment method
      </button>
    </div>
  );
}

export default function PaymentMethodsPage() {
  return (
    <ProtectedRoute>
      <PaymentMethodsContent />
    </ProtectedRoute>
  );
}