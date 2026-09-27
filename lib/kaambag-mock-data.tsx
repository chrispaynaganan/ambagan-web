// ambagan-web/lib/kaambag-mock-data.ts
//
// Placeholder personal-activity data for the Kaambag dashboard pages
// (My Ambag, Receipts, Followed, Tiwala history, Claims, Notifications).
// None of this is real — there's no contributions/follows/notifications
// endpoint confirmed live yet (contributions-payments isn't
// live-HTTP-tested per the project summary). Cross-references
// MOCK_CAMPAIGNS by slug rather than duplicating campaign fields.

export interface MockContribution {
  id: string;
  campaignSlug: string;
  amountMinorUnits: string;
  date: string;
  reference: string;
  anonymous: boolean;
}

export const MOCK_CONTRIBUTIONS: MockContribution[] = [
  {
    id: "c1",
    campaignSlug: "patuloy-na-dialysis-para-kay-maria",
    amountMinorUnits: "150000",
    date: "2026-09-12",
    reference: "MOCK-88213041",
    anonymous: false,
  },
  {
    id: "c2",
    campaignSlug: "help-rebuild-our-school",
    amountMinorUnits: "50000",
    date: "2026-09-02",
    reference: "MOCK-77102284",
    anonymous: true,
  },
];

export const MOCK_FOLLOWED_SLUGS: string[] = [
  "muling-pagtayo-pagkatapos-ng-bagyo",
  "barangay-health-center-supplies",
];

export interface MockNotification {
  id: string;
  date: string;
  title: string;
  body: string;
  read: boolean;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    date: "2026-09-12",
    title: "Contribution received",
    body: "Your ₱1,500.00 contribution to Patuloy na Dialysis para kay Maria was confirmed.",
    read: true,
  },
  {
    id: "n2",
    date: "2026-09-10",
    title: "Update posted",
    body: "Patuloy na Dialysis para kay Maria posted a new update: \"First month done.\"",
    read: false,
  },
  {
    id: "n3",
    date: "2026-09-08",
    title: "Patunay accepted",
    body: "A Patunay was accepted on a campaign you supported — you may now be eligible to give Tiwala.",
    read: false,
  },
];

export interface MockClaim {
  id: string;
  campaignSlug: string;
  reason: string;
  status: "submitted" | "under_review" | "resolved";
  filedDate: string;
  resolutionNote?: string;
}

export const MOCK_CLAIMS: MockClaim[] = [
  {
    id: "cl1",
    campaignSlug: "help-rebuild-our-school",
    reason: "Update timeline seemed inconsistent with the stated milestone.",
    status: "resolved",
    filedDate: "2026-08-20",
    resolutionNote: "Reviewed — timeline discrepancy was a good-faith disclosed change. No issue found.",
  },
];

export interface MockTiwalaGiven {
  campaignSlug: string;
  date: string;
}

export const MOCK_TIWALA_GIVEN: MockTiwalaGiven[] = [
  { campaignSlug: "patuloy-na-dialysis-para-kay-maria", date: "2026-09-09" },
];