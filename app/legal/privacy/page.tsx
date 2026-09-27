// ambagan-web/app/legal/privacy/page.tsx
//
// Privacy — spec §4.1: "Privacy notice and data-rights instructions."
// Data-rights instructions are a real requirement (and a Philippine Data
// Privacy Act concern, §25/§33.3) — this page points to /account/privacy
// as where the actual mechanism should live, rather than duplicating a
// data-request flow here.

import Link from "next/link";
import { LegalPageShell } from "@/components/legal-page-shell";

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy"
      sections={[
        "What We Collect",
        "How We Use Your Data",
        "Identity Verification Data",
        "Data Sharing with Payment and Compliance Partners",
        "Retention and Deletion",
      ]}
    >
      <section className="border border-line px-5 py-4">
        <h2 className="font-serif text-lg text-ink">Exercising your data rights</h2>
        <p className="mt-2 text-sm text-muted">
          The real mechanism for data export/deletion requests and
          visibility preferences lives at{" "}
          <Link href="/account/privacy" className="text-teal hover:text-teal-dark">
            /account/privacy
          </Link>{" "}
          once that page is built (spec §4.2) — this page should link
          there rather than duplicate the flow.
        </p>
      </section>
    </LegalPageShell>
  );
}