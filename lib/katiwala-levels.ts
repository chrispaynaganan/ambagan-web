// ambagan-web/lib/katiwala-levels.ts
//
// Single source of truth for Katiwala level data — the canonical level
// names (full grammatical forms per §14.1's actual table, NOT LOCK-012's
// shorthand "Bagong/Subok/Maaasahan/Uliran"), Tiwala thresholds, gates, and
// the suggested per-level fee reward from §10.1. Used by the /tiwala and
// /fees explainer pages, and by campaign-detail-data.ts's katiwalaProfile
// type, so all three can't drift out of sync on level naming.

export const KATIWALA_LEVELS = [
  "Bagong Katiwala",
  "Subok na Katiwala",
  "Maaasahang Katiwala",
  "Ulirang Katiwala",
] as const;

export type KatiwalaLevel = (typeof KATIWALA_LEVELS)[number];

export const KATIWALA_LEVEL_DETAILS: Record<
  KatiwalaLevel,
  {
    tiwalaRange: string;
    gates: string;
    benefits: string;
    suggestedMaxFeePct: number;
  }
> = {
  "Bagong Katiwala": {
    tiwalaRange: "0–24",
    gates: "Verified identity.",
    benefits: "Standard access.",
    suggestedMaxFeePct: 1.0,
  },
  "Subok na Katiwala": {
    tiwalaRange: "25–99",
    gates: "At least 1 completed Ambagan with accepted Patunay.",
    benefits:
      "Discovery eligibility, modest fee reward, standard-priority review improvements.",
    suggestedMaxFeePct: 0.9,
  },
  "Maaasahang Katiwala": {
    tiwalaRange: "100–299",
    gates:
      "At least 2 completed Ambagans, accepted Patunay, no unresolved serious trust issue.",
    benefits: "Higher configurable limits, priority review/support, larger fee reward.",
    suggestedMaxFeePct: 0.75,
  },
  "Ulirang Katiwala": {
    tiwalaRange: "300+",
    gates:
      "At least 3 completed Ambagans, sustained Patunay history, no unresolved serious trust violation.",
    benefits: "Best configured fee reward, matching/featured eligibility, priority support.",
    suggestedMaxFeePct: 0.5,
  },
};