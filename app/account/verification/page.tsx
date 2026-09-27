"use client";

// ambagan-web/app/account/verification/page.tsx
//
// Identity verification — spec §4.2 + §5.2 (KYC-001–006). This is a UI
// shell only: "Submit for review" sets local state, it does not call
// POST /identity/verification. That's deliberate — the project summary's
// own open item #5 flags that the real request body for that endpoint
// (and /identity/verification/:id/review) hasn't been confirmed against
// identity-access.controller.ts / dto/verification.dto.ts yet. Wire this
// up once those files are shared, rather than guessing the shape the way
// the original GET /auth/me assumption went wrong.

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";

type Status =
  | "Unverified"
  | "Submitted"
  | "Under Review"
  | "Needs Attention"
  | "Verified"
  | "Rejected"
  | "Expired/Reverification Required"
  | "Suspended";

function VerificationContent() {
  const [status, setStatus] = useState<Status>("Unverified");
  const [fileName, setFileName] = useState<string | null>(null);

  function handleSubmit() {
    setStatus("Submitted");
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Identity verification</h1>
        <p className="mt-2 text-muted">
          Required before publishing a campaign, giving Tiwala, or unlocking
          higher contribution limits.
        </p>
      </div>

      <div className="border border-line px-5 py-4">
        <p className="text-sm text-ink">
          Status: <span className="font-medium">{status}</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          Normal review is 1 to 3 business days — a guideline, not a
          guarantee.
        </p>
      </div>

      {status === "Unverified" && (
        <div className="space-y-4 border border-line px-6 py-6">
          <div>
            <p className="text-sm text-ink">Upload a government ID</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              className="mt-2 block w-full text-sm text-muted"
            />
            {fileName && <p className="mt-1 text-xs text-muted">Selected: {fileName}</p>}
          </div>

          <button
            type="button"
            disabled
            title="Camera capture isn't wired up yet in this frontend pass"
            className="border border-line px-4 py-2 text-sm text-muted opacity-50"
          >
            Use camera instead
          </button>

          <button
            onClick={handleSubmit}
            disabled={!fileName}
            className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark disabled:opacity-50"
          >
            Submit for review
          </button>
        </div>
      )}

      {status === "Submitted" && (
        <p className="text-sm text-muted">
          Your ID is in the review queue. This status will update once a
          reviewer looks at it.
        </p>
      )}
    </div>
  );
}

export default function VerificationPage() {
  return (
    <ProtectedRoute>
      <VerificationContent />
    </ProtectedRoute>
  );
}