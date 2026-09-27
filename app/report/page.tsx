"use client";

// ambagan-web/app/report/page.tsx
//
// Report a concern — spec §4.1: "Report campaign, media, user, payout,
// impersonation, or fraud." Pure frontend: the form collects input and
// shows a local "submitted" state — there's no backend endpoint yet to
// actually send it to (Compliance/DSWD, Protection & Cases, and Risk
// modules are all still on the backend's "not yet built" list). Swap
// handleSubmit for a real POST once one exists.

import { useState } from "react";

const REPORT_CATEGORIES = [
  "Campaign",
  "Media",
  "User",
  "Payout",
  "Impersonation",
  "Fraud",
  "Other",
] as const;

export default function ReportPage() {
  const [category, setCategory] = useState<string>(REPORT_CATEGORIES[0]);
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-ink">Report received</h1>
        <p className="text-muted">
          Thank you — our Trust &amp; Safety team reviews every report.
          You&apos;ll hear back if we need more information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Report a concern</h1>
        <p className="mt-2 max-w-xl text-muted">
          Tell us what&apos;s wrong — a campaign, media, a user, a payout,
          impersonation, or fraud. Every report is reviewed by Trust &amp;
          Safety.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 border border-line px-6 py-6"
      >
        <label className="block text-sm text-ink">
          What are you reporting?
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          >
            {REPORT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-ink">
          Campaign link, username, or reference (optional)
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. ambagan.com/ambagan/pay-for-my-tuition"
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>

        <label className="block text-sm text-ink">
          What happened?
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark"
        >
          Submit report
        </button>
      </form>
    </div>
  );
}