// ambagan-web/lib/recipient-mock-data.ts
//
// Placeholder data for the Recipient persona (banked and unbanked). None
// of this is real — there's no confirmed backend link between a Recipient
// record and an actual logged-in User account (the real Recipient
// entity's confirmed fields don't include a userId), so this simulates
// "campaigns where the current person is the named recipient" rather than
// querying anything real. Reuses existing campaign slugs from
// mock-data.ts/campaign-detail-data.ts for continuity: Maria's dialysis
// campaign as the banked example (verified, already received a payout),
// the post-typhoon housing campaign as the unbanked example (still
// pending consent/verification).

export type RecipientRoleType = "banked" | "unbanked";
export type RecipientConsentStatus = "pending" | "granted" | "revoked";
export type RecipientVerificationStatus = "UNVERIFIED" | "VERIFIED" | "REJECTED";

export interface RecipientPayout {
  date: string;
  amountMinorUnits: string;
  reference: string;
}

export interface RecipientCampaignLink {
  campaignSlug: string;
  recipientType: RecipientRoleType;
  consentStatus: RecipientConsentStatus;
  verificationStatus: RecipientVerificationStatus;
  incomingMinorUnits: string; // eligible/pending, not yet paid out
  receivedPayouts: RecipientPayout[];
}

export const MOCK_RECIPIENT_LINKS: RecipientCampaignLink[] = [
  {
    campaignSlug: "patuloy-na-dialysis-para-kay-maria",
    recipientType: "banked",
    consentStatus: "granted",
    verificationStatus: "VERIFIED",
    incomingMinorUnits: "320000",
    receivedPayouts: [{ date: "2026-09-08", amountMinorUnits: "520000", reference: "PYT-88213" }],
  },
  {
    campaignSlug: "muling-pagtayo-pagkatapos-ng-bagyo",
    recipientType: "unbanked",
    consentStatus: "pending",
    verificationStatus: "UNVERIFIED",
    incomingMinorUnits: "0",
    receivedPayouts: [],
  },
];

export interface RecipientDispute {
  id: string;
  campaignSlug: string;
  type: "non_receipt" | "unauthorized_campaign" | "misrepresentation" | "misuse";
  description: string;
  status: "submitted" | "under_review" | "resolved";
  filedDate: string;
}

export const MOCK_RECIPIENT_DISPUTES: RecipientDispute[] = [];