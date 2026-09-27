// ambagan-web/lib/campaign-detail-data.ts
//
// The extra, detail-only data Campaign Detail needs on top of what's
// already in lib/mock-data.ts's MockCampaign (title, goal, raised,
// location, etc. are NOT repeated here — the detail page reads those from
// mock-data.ts and merges in this file's data by slug, so there's one
// place for the summary fields and one place for the rest).
//
// Only two slugs have full detail data — building all seven to this depth
// isn't worth it for a mock pass. The Campaign Detail page shows a "no
// detail data yet" state for any other real slug.
//
// The two examples are deliberately contrasting: one with every trust
// signal green, one with several still pending — both are legitimately
// "live" (Katiwala verification is a hard gate before publishing at all,
// per AUTH-003), but recipient verification, DSWD permit status, and
// Patunay are the things that genuinely vary over a live campaign's life.

import type { KatiwalaLevel } from "./katiwala-levels";

export interface Milestone {
  title: string;
  description: string;
  progressPct: number; // 0-100, display only
  status: "completed" | "in_progress" | "not_started";
}

export interface TrustStrip {
  katiwalaVerified: boolean;
  recipientVerified: boolean;
  payoutDestinationVerified: boolean;
  dswdPermitStatus: "verified" | "pending" | "not_applicable";
  protektadongAmbagStatus: "covered" | "pending" | "not_covered";
  // "standard_upload" matches the real Evidence.mediaProvenance value from
  // the backend's test data (project summary §8) — reused here rather
  // than inventing a different label for the same concept.
  mediaProvenance: "standard_upload" | "not_applicable";
}

export interface CampaignDetailExtra {
  trustStrip: TrustStrip;
  // Mirrors the real Campaign.story jsonb shape (§4.7: append-only array
  // of {version, content, updatedAt}) rather than a single plain string.
  story: { version: number; content: string; updatedAt: string }[];
  milestones: Milestone[];
  useOfFunds: { category: string; plannedPct: number }[];
  payoutTransparency: {
    // Values drawn from the payout hierarchy in LOCK-014, plus
    // "direct_recipient" which is the exact enum value seen in the
    // backend's real test data.
    destinationType: "direct_recipient" | "provider" | "cash_pickup" | "verified_proxy";
    releasedMinorUnits: string;
    remainingMinorUnits: string;
  };
  updates: { date: string; title: string; body: string }[];
  patunay: { date: string; title: string; summary: string; verified: boolean }[];
  katiwalaProfile: {
    displayName: string;
    // Full canonical form from §14.1's actual table — see
    // lib/katiwala-levels.ts. Was previously the wrong, abbreviated
    // LOCK-012 shorthand ("Maaasahan" instead of "Maaasahang Katiwala").
    level: KatiwalaLevel;
    tiwalaCount: number;
    completedCampaigns: number;
    patunayCompletionRatePct: number;
  };
  // Name + optional message only, deliberately no amounts — spec requires
  // never exposing private donor data on the public donor wall.
  donorWall: { displayName: string; message?: string }[];
}

export const MOCK_CAMPAIGN_DETAILS: Record<string, CampaignDetailExtra> = {
  "patuloy-na-dialysis-para-kay-maria": {
    trustStrip: {
      katiwalaVerified: true,
      recipientVerified: true,
      payoutDestinationVerified: true,
      dswdPermitStatus: "not_applicable", // individual medical case, not an org solicitation
      protektadongAmbagStatus: "covered",
      mediaProvenance: "standard_upload",
    },
    story: [
      {
        version: 1,
        content:
          "Maria was diagnosed with kidney failure in early 2026 and now needs dialysis three times a week at a partner center in Quezon City. Her family is covering what they can, but the ongoing cost of sessions and medication is more than they can sustain alone.",
        updatedAt: "2026-08-02",
      },
      {
        version: 2,
        content:
          "Update: Maria has completed her first month of treatment and is responding well. Thank you to everyone who has given so far — the next phase covers months two and three of continued sessions.",
        updatedAt: "2026-09-10",
      },
    ],
    milestones: [
      {
        title: "Initial dialysis sessions (Month 1)",
        description: "Covers 8 sessions at the partner dialysis center.",
        progressPct: 100,
        status: "completed",
      },
      {
        title: "Months 2–3 continued treatment",
        description: "Ongoing sessions plus required medication.",
        progressPct: 60,
        status: "in_progress",
      },
      {
        title: "Transplant evaluation (if eligible)",
        description: "Consultation and testing for transplant eligibility.",
        progressPct: 0,
        status: "not_started",
      },
    ],
    useOfFunds: [
      { category: "Dialysis sessions", plannedPct: 60 },
      { category: "Medication", plannedPct: 25 },
      { category: "Transportation", plannedPct: 10 },
      { category: "Contingency", plannedPct: 5 },
    ],
    payoutTransparency: {
      destinationType: "provider",
      releasedMinorUnits: "5200000",
      remainingMinorUnits: "3520000",
    },
    updates: [
      {
        date: "2026-09-10",
        title: "First month done",
        body: "Salamat sa lahat ng nag-ambag — we've completed the first month of dialysis sessions and Maria is doing well.",
      },
      {
        date: "2026-08-05",
        title: "Campaign approved and live",
        body: "This Ambagan has passed verification and is now live.",
      },
    ],
    patunay: [
      {
        date: "2026-09-08",
        title: "Dialysis center receipt — Month 1",
        summary: "Provider-submitted proof of 8 completed sessions, reviewed and accepted.",
        verified: true,
      },
    ],
    katiwalaProfile: {
      displayName: "Ana Dela Cruz",
      level: "Maaasahang Katiwala",
      tiwalaCount: 34,
      completedCampaigns: 3,
      patunayCompletionRatePct: 100,
    },
    donorWall: [
      { displayName: "Anonymous", message: "Get well soon!" },
      { displayName: "Mark R.", message: "Padayon!" },
      { displayName: "Anonymous" },
      { displayName: "Liza T.", message: "Praying for Maria." },
    ],
  },

  "muling-pagtayo-pagkatapos-ng-bagyo": {
    trustStrip: {
      katiwalaVerified: true,
      recipientVerified: false,
      payoutDestinationVerified: false,
      dswdPermitStatus: "pending",
      protektadongAmbagStatus: "pending",
      mediaProvenance: "not_applicable",
    },
    story: [
      {
        version: 1,
        content:
          "Typhoon Kristine damaged over 40 homes in this community. This Ambagan is raising funds for emergency shelter materials now, with a second phase for permanent rebuilding once initial needs are met.",
        updatedAt: "2026-09-01",
      },
    ],
    milestones: [
      {
        title: "Emergency shelter materials",
        description: "Tarpaulins and plywood for immediate shelter.",
        progressPct: 40,
        status: "in_progress",
      },
      {
        title: "Permanent rebuild phase",
        description: "Materials and labor for permanent housing repair.",
        progressPct: 0,
        status: "not_started",
      },
    ],
    useOfFunds: [
      { category: "Materials", plannedPct: 70 },
      { category: "Labor", plannedPct: 20 },
      { category: "Contingency", plannedPct: 10 },
    ],
    payoutTransparency: {
      destinationType: "verified_proxy",
      releasedMinorUnits: "0",
      remainingMinorUnits: "5200000",
    },
    updates: [
      {
        date: "2026-09-01",
        title: "Campaign live",
        body: "This Ambagan is now live and accepting contributions.",
      },
    ],
    patunay: [],
    katiwalaProfile: {
      displayName: "Barangay San Roque Relief Committee",
      level: "Subok na Katiwala",
      tiwalaCount: 6,
      completedCampaigns: 1,
      patunayCompletionRatePct: 100,
    },
    donorWall: [
      { displayName: "Anonymous" },
      { displayName: "Paolo G.", message: "Stay strong!" },
    ],
  },
};