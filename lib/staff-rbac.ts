// ambagan-web/lib/staff-rbac.ts
//
// RBAC model for the Operations Console (spec §19.1, RBAC-001–004).
// RBAC-001: "Permissions must be granular capabilities, not only
// hard-coded role names. Roles are bundles of permissions." — modeled
// exactly that way here: Permission is the real unit, StaffRole is just a
// named bundle of them.
//
// Seven of these permission strings are real, confirmed from your test
// data (the "Platform Staff" role seeded on chris@example.com):
// identity:review_verification, payouts:verify_destination,
// payouts:approve, payouts:hold, payouts:process, patunay:review,
// trust:invalidate_grant. Everything else follows the same
// resource:action convention but is invented for modules with no backend
// behind them yet (CMS, Configuration, Analytics, System Health, etc.).
//
// "Platform Staff" itself is kept as an explicit 11th role below,
// alongside the spec's 10 idealized roles from §19.1's table — it's the
// real seeded bundle, and it doesn't map cleanly onto any single one of
// the 10 (it spans what the spec eventually splits into KYC Reviewer +
// Finance & Payout Ops + Trust & Safety Reviewer). Worth resolving for
// real once RBAC-001's granular model actually gets built server-side.

export type Permission =
  | "identity:review_verification"
  | "payouts:verify_destination"
  | "payouts:approve"
  | "payouts:hold"
  | "payouts:process"
  | "patunay:review"
  | "trust:invalidate_grant"
  | "campaigns:review"
  | "dswd:review"
  | "claims:manage"
  | "finance:reconcile"
  | "support:manage"
  | "content:moderate"
  | "cms:edit"
  | "config:edit"
  | "staff:manage"
  | "analytics:read"
  | "audit:read"
  | "system:read";

export type StaffRole =
  | "Creator / Super Admin"
  | "Trust & Safety Reviewer"
  | "KYC Reviewer"
  | "Compliance / DSWD Reviewer"
  | "Finance & Payout Ops"
  | "Customer Support"
  | "Content Moderator"
  | "CMS Editor"
  | "Analyst / Read-only"
  | "Auditor / Compliance Read-only"
  | "Platform Staff (current real seed)";

const ALL_PERMISSIONS: Permission[] = [
  "identity:review_verification",
  "payouts:verify_destination",
  "payouts:approve",
  "payouts:hold",
  "payouts:process",
  "patunay:review",
  "trust:invalidate_grant",
  "campaigns:review",
  "dswd:review",
  "claims:manage",
  "finance:reconcile",
  "support:manage",
  "content:moderate",
  "cms:edit",
  "config:edit",
  "staff:manage",
  "analytics:read",
  "audit:read",
  "system:read",
];

export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  "Creator / Super Admin": ALL_PERMISSIONS,
  "Trust & Safety Reviewer": [
    "campaigns:review",
    "trust:invalidate_grant",
    "patunay:review",
    "claims:manage",
    "payouts:hold",
  ],
  "KYC Reviewer": ["identity:review_verification"],
  "Compliance / DSWD Reviewer": ["dswd:review"],
  "Finance & Payout Ops": [
    "payouts:verify_destination",
    "payouts:approve",
    "payouts:hold",
    "payouts:process",
    "finance:reconcile",
  ],
  "Customer Support": ["support:manage"],
  "Content Moderator": ["content:moderate"],
  "CMS Editor": ["cms:edit"],
  "Analyst / Read-only": ["analytics:read"],
  "Auditor / Compliance Read-only": ["audit:read"],
  // The real seeded bundle — exact match to chris@example.com's test data.
  "Platform Staff (current real seed)": [
    "trust:invalidate_grant",
    "patunay:review",
    "payouts:verify_destination",
    "payouts:approve",
    "payouts:hold",
    "payouts:process",
    "identity:review_verification",
  ],
};

export const STAFF_ROLES = Object.keys(ROLE_PERMISSIONS) as StaffRole[];