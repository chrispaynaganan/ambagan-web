"use client";

// ambagan-web/app/staff/cms/page.tsx
//
// CMS — spec §19.2: "Home blocks, categories, help center, safety/
// compliance pages, notices, legal content versioning, email/SMS
// templates." Fully illustrative — CMS & Configuration is explicitly on
// the "not yet built" backend list.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";

const BLOCKS = [
  { id: "home-hero", label: "Home hero copy" },
  { id: "help-faq", label: "Help Center FAQ entries" },
  { id: "safety-copy", label: "Trust & Safety Center copy" },
  { id: "legal-terms", label: "Terms (version history)" },
];

function CmsContent() {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-ink">CMS</h1>
      <div className="border border-line">
        {BLOCKS.map((b) => (
          <div key={b.id} className="border-b border-line px-4 py-3 last:border-b-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink">{b.label}</span>
              <button
                onClick={() => {
                  setEditing(b.id);
                  setDraft("");
                }}
                className="text-xs text-teal hover:text-teal-dark"
              >
                Edit
              </button>
            </div>
            {editing === b.id && (
              <div className="mt-2 space-y-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="block w-full border border-line px-2 py-1 text-sm text-ink"
                />
                <button
                  onClick={() => setEditing(null)}
                  className="border border-teal px-3 py-1 text-xs text-teal hover:bg-teal hover:text-paper"
                >
                  Save (local only — no CMS backend exists yet)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CmsPage() {
  return (
    <StaffModuleGate permission="cms:edit" title="CMS">
      <CmsContent />
    </StaffModuleGate>
  );
}