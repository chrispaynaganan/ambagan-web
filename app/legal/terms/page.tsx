// ambagan-web/app/legal/terms/page.tsx
//
// Terms — spec §4.1: "Current terms with version history." Version
// history is a real structural requirement, not optional — kept here as
// a working (if single-row, draft-only) table so the mechanism exists
// once real terms are written, rather than bolting it on later.

import { LegalPageShell } from "@/components/legal-page-shell";

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms"
      sections={[
        "Acceptance of Terms",
        "Eligibility and Accounts",
        "Katiwala Responsibilities",
        "Kaambag Responsibilities",
        "Fees and Payments",
        "Prohibited Conduct",
        "Termination and Suspension",
        "Disclaimers and Limitation of Liability",
        "Governing Law and Disputes",
      ]}
    >
      <section>
        <h2 className="font-serif text-lg text-ink">Version history</h2>
        <div className="mt-3 border border-line">
          <div className="grid grid-cols-3 gap-4 border-b border-line px-4 py-2 font-mono text-xs text-muted">
            <span>Version</span>
            <span>Date</span>
            <span>Summary</span>
          </div>
          <div className="grid grid-cols-3 gap-4 px-4 py-2 text-sm text-ink">
            <span>v0 (draft)</span>
            <span>Not yet effective</span>
            <span>Placeholder only — pending legal review</span>
          </div>
        </div>
      </section>
    </LegalPageShell>
  );
}