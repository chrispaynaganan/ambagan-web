"use client";

// ambagan-web/app/account/notifications/page.tsx
//
// Notification preferences — spec §4.2: "Channel and event-level
// controls." Distinct from /notifications, which is the activity feed
// itself. Local state only — no preferences endpoint exists yet.

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";

const EVENTS = [
  "Contribution confirmations",
  "Campaign updates",
  "Tiwala eligibility",
  "Claim status changes",
];
const CHANNELS = ["Email", "SMS", "In-app"] as const;

function NotificationPreferencesContent() {
  const [prefs, setPrefs] = useState<Record<string, Record<(typeof CHANNELS)[number], boolean>>>(
    () => {
      const initial: Record<string, Record<(typeof CHANNELS)[number], boolean>> = {};
      for (const event of EVENTS) {
        initial[event] = { Email: true, SMS: false, "In-app": true };
      }
      return initial;
    }
  );

  function toggle(event: string, channel: (typeof CHANNELS)[number]) {
    setPrefs((prev) => {
      const current: Record<(typeof CHANNELS)[number], boolean> =
        prev[event] ?? { Email: true, SMS: false, "In-app": true };
      const updated: Record<(typeof CHANNELS)[number], boolean> = {
        ...current,
        [channel]: !current[channel],
      };
      return { ...prev, [event]: updated };
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Notification preferences</h1>
        <p className="mt-2 max-w-xl text-muted">
          Choose how you hear about each kind of update.
        </p>
      </div>

      <div className="border border-line">
        <div className="grid grid-cols-4 gap-2 border-b border-line px-5 py-3 text-xs font-mono uppercase tracking-wide text-muted">
          <span className="col-span-1">Event</span>
          {CHANNELS.map((c) => (
            <span key={c} className="text-center">
              {c}
            </span>
          ))}
        </div>
        {EVENTS.map((event) => (
          <div
            key={event}
            className="grid grid-cols-4 items-center gap-2 border-b border-line px-5 py-3 text-sm last:border-b-0"
          >
            <span className="col-span-1 text-ink">{event}</span>
            {CHANNELS.map((channel) => (
              <span key={channel} className="flex justify-center">
                <input
                  type="checkbox"
                  checked={prefs[event]?.[channel] ?? false}
                  onChange={() => toggle(event, channel)}
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationPreferencesPage() {
  return (
    <ProtectedRoute>
      <NotificationPreferencesContent />
    </ProtectedRoute>
  );
}