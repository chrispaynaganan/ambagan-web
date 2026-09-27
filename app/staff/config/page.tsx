"use client";

// ambagan-web/app/staff/config/page.tsx
//
// Configuration — spec §19.2/§19.3: fees, limits, category requirements,
// risk thresholds, review SLA, Tiwala levels, rewards, payout routes,
// feature flags — "anything likely to change must live in versioned
// configuration." Fully illustrative — no config backend exists.

import { useState } from "react";
import { StaffModuleGate } from "@/components/staff-module-gate";

const INITIAL_CONFIG = [
  { key: "Max sustainability fee", value: "1.00%" },
  { key: "Guest contribution ceiling", value: "₱10,000/transaction" },
  { key: "Registered contribution limit", value: "₱50,000/day" },
  { key: "Identity review SLA", value: "1–3 business days" },
  { key: "Patunay due window", value: "Configurable per obligation" },
  { key: "National ID eVerify integration", value: "Off (feature flag)" },
];

function ConfigContent() {
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-ink">Configuration</h1>
      <p className="text-xs text-muted">
        Every change here would need a versioned record, an effective
        date, and an audit entry per §19.3 — not modeled in this mock.
      </p>
      <div className="border border-line">
        {config.map((item) => (
          <div
            key={item.key}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm last:border-b-0"
          >
            <span className="text-ink">{item.key}</span>
            {editingKey === item.key ? (
              <div className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="border border-line px-2 py-1 text-xs text-ink"
                />
                <button
                  onClick={() => {
                    setConfig((prev) =>
                      prev.map((c) => (c.key === item.key ? { ...c, value: draft } : c))
                    );
                    setEditingKey(null);
                  }}
                  className="border border-teal px-2 py-1 text-xs text-teal hover:bg-teal hover:text-paper"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="font-mono text-ink">{item.value}</span>
                <button
                  onClick={() => {
                    setEditingKey(item.key);
                    setDraft(item.value);
                  }}
                  className="text-xs text-teal hover:text-teal-dark"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <StaffModuleGate permission="config:edit" title="Configuration">
      <ConfigContent />
    </StaffModuleGate>
  );
}