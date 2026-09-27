export type CampaignLifecycleState =
  | "draft"
  | "verification_required"
  | "compliance_required"
  | "under_review"
  | "approved"
  | "live"
  | "paused"
  | "completed"
  | "suspended"
  | "rejected"
  | "closed"
  | "archived";

export type CampaignReviewState =
  | "not_applicable"
  | "pending"
  | "changes_requested"
  | "approved"
  | "rejected";

interface StateInfo {
  label: string;
  description: string;
  tone: "neutral" | "warning" | "info" | "success" | "danger";
}

/**
 * Mirrors ambagan-api's shared/enums/index.ts CampaignLifecycleState and
 * campaigns.service.ts's ALLOWED_TRANSITIONS. Keep these in sync by hand
 * until there's a shared schema package between the two repos.
 */
export const CAMPAIGN_STATE_INFO: Record<CampaignLifecycleState, StateInfo> = {
  draft: {
    label: "Draft",
    description: "Only you can see this. Edit anything, then submit when ready.",
    tone: "neutral",
  },
  verification_required: {
    label: "Verification Required",
    description:
      "Your identity verification isn't complete yet. Once it is, come back and submit again.",
    tone: "warning",
  },
  compliance_required: {
    label: "Compliance Required",
    description: "DSWD or other compliance review is needed before this can launch.",
    tone: "warning",
  },
  under_review: {
    label: "Under Review",
    description: "Ambagan staff are reviewing this campaign. No edits while this is in progress.",
    tone: "info",
  },
  approved: {
    label: "Approved",
    description: "Approved, but not yet published. It will go live shortly.",
    tone: "success",
  },
  live: {
    label: "Live",
    description: "Public and accepting contributions.",
    tone: "success",
  },
  paused: {
    label: "Paused",
    description: "Temporarily not accepting new contributions.",
    tone: "warning",
  },
  completed: {
    label: "Completed",
    description: "Marked complete. Any remaining proof obligations still apply.",
    tone: "neutral",
  },
  suspended: {
    label: "Suspended",
    description: "On hold for trust, safety, or compliance reasons.",
    tone: "danger",
  },
  rejected: {
    label: "Rejected",
    description: "Not approved for launch. Edit and resubmit.",
    tone: "danger",
  },
  closed: {
    label: "Closed",
    description: "All financial and proof obligations completed.",
    tone: "neutral",
  },
  archived: {
    label: "Archived",
    description: "Historical read-only record.",
    tone: "neutral",
  },
};

/** Matches CampaignsService.EDITABLE_STATES exactly. */
export function isEditableState(state: CampaignLifecycleState): boolean {
  return state === "draft" || state === "rejected";
}

/**
 * States from which calling submit-for-review is meaningful. Deliberately
 * includes VERIFICATION_REQUIRED and COMPLIANCE_REQUIRED — re-calling
 * submit-for-review is the only mechanism that advances a campaign once
 * verification/compliance completes elsewhere (see campaigns.service.ts
 * submitForReview()). Calling it while still unverified and already in
 * VERIFICATION_REQUIRED throws server-side (a self-transition
 * ALLOWED_TRANSITIONS doesn't list) — the manage page catches that specific
 * case and shows a friendly message instead of the raw error. Found while
 * building this, not fixed server-side, since making it a silent no-op
 * instead is a product decision, not just a bug fix.
 */
export function canAttemptSubmitForReview(state: CampaignLifecycleState): boolean {
  return (
    state === "draft" ||
    state === "rejected" ||
    state === "verification_required" ||
    state === "compliance_required"
  );
}

export function toneClasses(tone: StateInfo["tone"]): string {
  switch (tone) {
    case "success":
      return "bg-teal-50 text-teal-900 border-teal-300";
    case "warning":
      return "bg-amber-50 text-amber-900 border-amber-300";
    case "danger":
      return "bg-red-50 text-red-900 border-red-300";
    case "info":
      return "bg-sky-50 text-sky-900 border-sky-300";
    default:
      return "bg-stone-100 text-stone-700 border-stone-300";
  }
}