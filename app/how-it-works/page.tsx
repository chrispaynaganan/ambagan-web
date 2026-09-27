"use client";

// ambagan-web/app/how-it-works/page.tsx
//
// How Ambagan works — Visitor persona (spec §4.1: "Separate paths for
// Katiwala, Kaambag, and recipient."). Static content, no mock-data
// dependency — the step copy is adapted directly from the core system
// loop in §2 and each actor's primary capabilities in §3, not invented.

import { useState } from "react";

type Audience = "katiwala" | "kaambag" | "recipient";

const PATHS: Record<Audience, { label: string; steps: { title: string; body: string }[] }> = {
  katiwala: {
    label: "Para sa Katiwala",
    steps: [
      {
        title: "Mag-verify",
        body: "Submit your ID before you can publish a campaign — the normal review window is 1 to 3 business days.",
      },
      {
        title: "Gumawa ng Ambagan",
        body: "Set your goal, tell your story, and lay out purpose milestones.",
      },
      {
        title: "Dumaan sa review",
        body: "Your campaign is checked before it goes live.",
      },
      {
        title: "Tumanggap ng ambag",
        body: "Kaambags give through regulated payment methods — funds don't sit with you directly by default.",
      },
      {
        title: "Ipadala ang tulong",
        body: "Funds get released to the recipient, a provider, or a safer route, whichever fits best.",
      },
      {
        title: "Magsumite ng Patunay",
        body: "Show proof of how the funds were used.",
      },
      {
        title: "Kumita ng Tiwala",
        body: "Verified Kaambags can give Tiwala, building your public track record over time.",
      },
    ],
  },
  kaambag: {
    label: "Para sa Kaambag",
    steps: [
      { title: "Tumingin", body: "Discover verified campaigns by category or search." },
      {
        title: "Suriin",
        body: "Every campaign shows its verification status, milestones, and past Patunay.",
      },
      {
        title: "Mag-ambag",
        body: "Give as a guest or a registered user — the exact fee breakdown is shown before you confirm.",
      },
      {
        title: "Tumanggap ng resibo",
        body: "Every contribution generates a reference you can track.",
      },
      { title: "Makita ang Patunay", body: "Follow updates and verified proof of delivery." },
      {
        title: "Magbigay ng Tiwala",
        body: "Once verified, you can give one Tiwala per campaign.",
      },
    ],
  },
  recipient: {
    label: "Para sa Recipient",
    steps: [
      {
        title: "Kumpirmahin",
        body: "Consent to being named as the recipient, and verify your identity where possible.",
      },
      {
        title: "I-verify ang paraan ng pagtanggap",
        body: "Bank account, provider, or cash pickup — whichever fits your situation.",
      },
      { title: "Tumanggap", body: "Funds are released through the route you verified." },
      {
        title: "Kumpirmahin ang pagkatanggap",
        body: "Confirm that funds or goods actually reached you.",
      },
      {
        title: "Makilahok sa Patunay",
        body: "Help verify how the help was used, closing the loop.",
      },
    ],
  },
};

export default function HowItWorksPage() {
  const [audience, setAudience] = useState<Audience>("katiwala");
  const path = PATHS[audience];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">How Ambagan works</h1>
        <p className="mt-2 max-w-xl text-muted">
          The same accountability loop runs underneath every campaign —
          verified stewardship, regulated fund movement, mandatory proof of
          delivery, and earned trust. Here&apos;s what it looks like from
          each side.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(PATHS) as Audience[]).map((key) => (
          <button
            key={key}
            onClick={() => setAudience(key)}
            className={`border px-4 py-2 text-sm ${
              audience === key
                ? "border-teal bg-teal text-paper"
                : "border-line text-ink/80 hover:border-teal hover:text-teal"
            }`}
          >
            {PATHS[key].label}
          </button>
        ))}
      </div>

      <ol className="space-y-4">
        {path.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4 border border-line px-5 py-4">
            <span className="font-mono text-sm text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-serif text-ink">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}