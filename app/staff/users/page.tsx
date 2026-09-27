"use client";

// ambagan-web/app/staff/users/page.tsx
//
// User Search — spec §19.2: "Users, roles, verification, account
// history, trust record, cases, linked campaigns." Mock user list — no
// confirmed "search all users" endpoint exists.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";

const MOCK_USERS = [
  { email: "test@ambagan.dev", role: "Kaambag / Katiwala", verification: "Unverified" },
  { email: "chris@example.com", role: "Platform Staff", verification: "Verified" },
];

export default function UserSearchPage() {
  const [query, setQuery] = useState("");
  const results = MOCK_USERS.filter((u) => u.email.toLowerCase().includes(query.toLowerCase()));

  return (
    <StaffModuleGate permission="support:manage" title="User Search">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">User Search</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email"
          className="block w-full max-w-sm border border-line px-3 py-2 text-sm text-ink"
        />
        <div className="border border-line">
          {results.map((u) => (
            <div
              key={u.email}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm last:border-b-0"
            >
              <span className="text-ink">{u.email}</span>
              <span className="text-muted">{u.role}</span>
              <span className="font-mono text-xs text-muted">{u.verification}</span>
            </div>
          ))}
        </div>
      </div>
    </StaffModuleGate>
  );
}