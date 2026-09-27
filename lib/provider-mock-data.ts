// ambagan-web/lib/provider-mock-data.ts
//
// Placeholder data for the Provider/institution persona's one-time
// portal link (spec §4.3: "Full account optional; one-time signed portal
// links allowed"). No real backend route generates these tokens or
// stores payment-request state yet — this simulates what a provider
// would see after clicking a link like /provider/{token}, keyed by a
// fake token rather than anything cryptographically real. A real
// implementation needs a signed, expiring, single-use token scheme —
// this is layout/flow only, not a security design.

export type ProviderRequestStatus =
  | "pending_confirmation"
  | "invoice_confirmed"
  | "payment_sent"
  | "receipt_confirmed";

export interface ProviderPaymentRequest {
  token: string;
  campaignSlug: string;
  providerName: string;
  invoiceDescription: string;
  invoiceAmountMinorUnits: string;
  status: ProviderRequestStatus;
}

export const MOCK_PROVIDER_REQUESTS: Record<string, ProviderPaymentRequest> = {
  "demo-token-dialysis-center": {
    token: "demo-token-dialysis-center",
    campaignSlug: "patuloy-na-dialysis-para-kay-maria",
    providerName: "Quezon City Dialysis Center",
    invoiceDescription: "Month 2 dialysis sessions (8 sessions)",
    invoiceAmountMinorUnits: "3200000",
    status: "invoice_confirmed",
  },
};