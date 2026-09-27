// ambagan-web/components/legal-page-shell.tsx
//
// Shared shell for the three /legal/* pages. Renders a clear "this is a
// structural placeholder, not real legal text" banner plus the section
// headings a real Terms/Privacy/Community Guidelines document would have
// — but the body under each heading is explicitly marked placeholder.
// I (Claude) did not draft real legal/contractual language here, and
// shouldn't — that needs actual counsel review before this ships. See the
// chat note to carry into the project summary's "open decisions" section.

import type { ReactNode } from "react";

export function LegalPageShell({
  title,
  sections,
  children,
}: {
  title: string;
  sections: string[];
  children?: ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted">
          Draft v0 · Not yet reviewed by counsel · Not in effect
        </p>
      </div>

      <div className="border border-gold px-5 py-4 text-sm text-ink">
        <p className="font-medium">This page is a structural placeholder only.</p>
        <p className="mt-1 text-muted">
          The section headings below hold the real content&apos;s shape —
          none of the body text is actual legal language. Get
          counsel-reviewed copy in before this ships.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((s) => (
          <section key={s}>
            <h2 className="font-serif text-lg text-ink">{s}</h2>
            <p className="mt-2 text-sm text-muted">[Placeholder — pending legal review]</p>
          </section>
        ))}
      </div>

      {children}
    </div>
  );
}