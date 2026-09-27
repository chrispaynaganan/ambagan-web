"use client";

// ambagan-web/app/notifications/page.tsx
//
// Notifications — Kaambag dashboard area (spec §4.3), the activity feed
// (distinct from /account/notifications, which is channel/event
// preferences, not the feed itself). Read/unread state is local only —
// no notifications endpoint exists yet.

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { MOCK_NOTIFICATIONS, type MockNotification } from "@/lib/kaambag-mock-data";

function NotificationsContent() {
  const [items, setItems] = useState<MockNotification[]>(MOCK_NOTIFICATIONS);

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Notifications</h1>
        <p className="mt-2 text-muted">
          {unreadCount === 0 ? "You're all caught up." : `${unreadCount} unread.`}
        </p>
      </div>

      <div className="border border-line">
        {items.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className="flex w-full items-start justify-between gap-4 border-b border-line px-5 py-4 text-left last:border-b-0 hover:bg-line/20"
          >
            <div>
              <div className="flex items-center gap-2">
                {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-teal" />}
                <h3 className="font-serif text-ink">{n.title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted">{n.body}</p>
            </div>
            <span className="font-mono text-xs text-muted">{n.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <NotificationsContent />
    </ProtectedRoute>
  );
}