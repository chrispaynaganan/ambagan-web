"use client";

// ambagan-web/app/recipient/unbanked/confirm/page.tsx
//
// Receipt Confirmation — unbanked recipient (spec §12.2). Same underlying
// idea as the banked dashboard's "Confirm receipt," but as one big
// decision instead of a data table — REC-003's simplicity requirement
// again. REC-004: if they can't do this themselves, a support call is the
// explicit fallback, not a dead end.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";

function ConfirmContent() {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);

  return (
    <div className="max-w-md space-y-8">
      <div>
        <Link href="/recipient/unbanked" className="text-base text-teal hover:text-teal-dark">
          ← Back
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Did you get your money?</h1>
      </div>

      {answer === null && (
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setAnswer("yes")}
            className="border border-teal bg-teal px-6 py-6 text-xl text-paper hover:bg-teal-dark"
          >
            Yes, I got it
          </button>
          <button
            onClick={() => setAnswer("no")}
            className="border border-danger px-6 py-6 text-xl text-danger hover:bg-danger hover:text-paper"
          >
            No, not yet
          </button>
        </div>
      )}

      {answer === "yes" && (
        <p className="border border-teal px-5 py-6 text-lg text-ink">
          Thank you for confirming. This has been recorded.
        </p>
      )}

      {answer === "no" && (
        <div className="space-y-4">
          <p className="border border-gold px-5 py-4 text-lg text-ink">
            We&apos;ve noted this. A support person will follow up with you.
          </p>
          <a
            href="tel:+18001234567"
            className="block border border-line px-5 py-4 text-center text-lg text-ink hover:border-teal hover:text-teal"
          >
            Call Support now
          </a>
        </div>
      )}
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <ProtectedRoute>
      <ConfirmContent />
    </ProtectedRoute>
  );
}