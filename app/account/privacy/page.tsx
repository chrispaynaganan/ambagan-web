"use client";

// ambagan-web/app/account/privacy/page.tsx
//
// Privacy controls — spec §4.2: "Data export/request, visibility
// preferences, consent settings where applicable." This is the real
// mechanism /legal/privacy points to. UI-only — no backend endpoint for
// data export/deletion requests exists yet.

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";

function PrivacyControlsContent() {
  const [exportRequested, setExportRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const [anonymousDefault, setAnonymousDefault] = useState(false);

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Privacy controls</h1>
        <p className="mt-2 text-muted">
          Export or delete your data, and set how you appear by default.
        </p>
      </div>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Your data</h2>
        <div className="mt-3 space-y-3">
          <div>
            <button
              onClick={() => setExportRequested(true)}
              disabled={exportRequested}
              className="border border-line px-4 py-2 text-sm text-ink/80 hover:border-teal hover:text-teal disabled:opacity-50"
            >
              {exportRequested ? "Export requested" : "Request data export"}
            </button>
          </div>
          <div>
            <button
              onClick={() => setDeletionRequested(true)}
              disabled={deletionRequested}
              className="border border-danger px-4 py-2 text-sm text-danger disabled:opacity-50"
            >
              {deletionRequested ? "Deletion requested" : "Request account deletion"}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Both buttons only set local state — there&apos;s no real data-rights
          endpoint yet to send the request to.
        </p>
      </section>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Visibility</h2>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={anonymousDefault}
            onChange={(e) => setAnonymousDefault(e.target.checked)}
          />
          Give anonymously by default
        </label>
      </section>
    </div>
  );
}

export default function PrivacyControlsPage() {
  return (
    <ProtectedRoute>
      <PrivacyControlsContent />
    </ProtectedRoute>
  );
}