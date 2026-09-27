"use client";

// ambagan-web/app/account/security/page.tsx
//
// Security — spec §4.2: "Password, 2FA/passkeys, sessions, devices,
// security history." Auth is explicitly MVP-level right now (project
// summary §4.6: no MFA, no password reset flow) — this page's controls
// are UI-only, not wired to real endpoints that don't exist yet.

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";

const MOCK_SESSIONS = [
  { device: "Chrome on macOS", location: "Lipa City, PH", lastActive: "Active now" },
  { device: "Safari on iPhone", location: "Lipa City, PH", lastActive: "2 days ago" },
];

function SecurityContent() {
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="max-w-xl space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Security</h1>
        <p className="mt-2 text-muted">
          Password, two-factor authentication, and where you&apos;re signed
          in.
        </p>
      </div>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Password</h2>
        <p className="mt-1 text-sm text-muted">
          Password reset isn&apos;t built yet — this is a UI placeholder.
        </p>
        <button
          disabled
          className="mt-3 border border-line px-4 py-2 text-sm text-muted opacity-50"
        >
          Change password
        </button>
      </section>

      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Two-factor authentication</h2>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={twoFactor}
            onChange={(e) => setTwoFactor(e.target.checked)}
          />
          Require a code at sign-in
        </label>
        <p className="mt-1 text-xs text-muted">
          Not wired to a real MFA flow yet — this only toggles local state.
        </p>
      </section>

      <section>
        <h2 className="font-serif text-lg text-ink">Where you&apos;re signed in</h2>
        <div className="mt-3 border border-line">
          {MOCK_SESSIONS.map((s) => (
            <div
              key={s.device}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3 text-sm last:border-b-0"
            >
              <div>
                <p className="text-ink">{s.device}</p>
                <p className="text-xs text-muted">{s.location}</p>
              </div>
              <span className="text-xs text-muted">{s.lastActive}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <ProtectedRoute>
      <SecurityContent />
    </ProtectedRoute>
  );
}