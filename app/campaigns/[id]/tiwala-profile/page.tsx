"use client";

// ambagan-web/app/tiwala-profile/page.tsx
//
// Tiwala profile — Katiwala dashboard area (spec §4.3), NOT campaign-
// scoped: this is the Katiwala's own reputation, not one campaign's. Uses
// the real logged-in user (useAuth()) for identity, but the level/Tiwala
// count/completed-campaigns numbers are an honest zero-state
// ("Bagong Katiwala", the real starting tier per §14.1) rather than
// borrowed from campaign-detail-data.ts's fictional Katiwalas (Ana Dela
// Cruz, etc.) — those belong to mock campaigns, not to whoever is actually
// logged in. trust.service.ts's read path is confirmed live-HTTP-verified
// per the project summary, but its exact route wasn't given to me, so
// wiring this to the real number needs that route confirmed first.

import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth/auth-context";
import { KATIWALA_LEVELS, KATIWALA_LEVEL_DETAILS } from "@/lib/katiwala-levels";

function TiwalaProfileContent() {
  const { user } = useAuth();

  // Honest zero-state — not derived from any real trust-module read yet.
  const currentLevel = KATIWALA_LEVELS[0];
  const tiwalaCount = 0;
  const completedCampaigns = 0;

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Your Tiwala profile</h1>
        <p className="mt-2 text-muted">{user?.email}</p>
      </div>

      <div className="border border-line px-6 py-6">
        <p className="font-serif text-xl text-ink">{currentLevel}</p>
        <p className="mt-1 text-sm text-muted">
          {tiwalaCount} Tiwala · {completedCampaigns} completed Ambagans
        </p>
        <p className="mt-3 text-sm text-ink">
          {KATIWALA_LEVEL_DETAILS[currentLevel].benefits}
        </p>
      </div>

      <section>
        <h2 className="font-serif text-lg text-ink">All levels</h2>
        <div className="mt-3 space-y-3">
          {KATIWALA_LEVELS.map((level) => {
            const d = KATIWALA_LEVEL_DETAILS[level];
            const isCurrent = level === currentLevel;
            return (
              <div
                key={level}
                className={`border px-5 py-4 ${isCurrent ? "border-teal" : "border-line"}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-ink">
                    {level}
                    {isCurrent && <span className="ml-2 text-xs text-teal">(you are here)</span>}
                  </h3>
                  <span className="font-mono text-xs text-muted">{d.tiwalaRange} Tiwala</span>
                </div>
                <p className="mt-1 text-sm text-muted">{d.gates}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function TiwalaProfilePage() {
  return (
    <ProtectedRoute>
      <TiwalaProfileContent />
    </ProtectedRoute>
  );
}