// ambagan-web/app/help/page.tsx
//
// Help Center — spec §4.1: "Dynamic CMS knowledge base." The real version
// of this page is CMS-driven (DOC-002, §19.3) — content should come from
// wherever the CMS module ends up living, not be hardcoded like this. The
// FAQ entries below are illustrative placeholders, not finalized copy.

const FAQS = [
  {
    q: "How long does identity verification take?",
    a: "Usually 1 to 3 business days — a guideline, not a guarantee.",
  },
  {
    q: "Can I donate without creating an account?",
    a: "Yes, as a guest, up to a configured limit per transaction. Guest contributions can't give Tiwala.",
  },
  {
    q: "What happens if a campaign doesn't reach its goal?",
    a: "Purpose milestones inform, they don't punish — funds already collected stay usable for the represented purpose.",
  },
  {
    q: "How do I report a campaign I think is fake?",
    a: 'Use the persistent "Report concern" action on any campaign page, or go to /report directly.',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Help Center</h1>
        <p className="mt-2 max-w-xl text-muted">
          A few common questions below — the real Help Center will be a
          searchable, CMS-managed knowledge base rather than a hardcoded
          list like this one.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item) => (
          <div key={item.q} className="border border-line px-5 py-4">
            <h3 className="font-serif text-ink">{item.q}</h3>
            <p className="mt-1 text-sm text-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}