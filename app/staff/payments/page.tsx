// ambagan-web/app/staff/payments/page.tsx
//
// Payments — spec §19.2: "Contribution ledger, payment states,
// chargebacks, processor references, reconciliation." Reuses the same
// MOCK_CONTRIBUTIONS records visible on Kaambag's Receipts and Katiwala's
// Contributions pages — one ledger, three viewpoints.

import { StaffModuleGate } from "@/components/staff-module-gate";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CONTRIBUTIONS } from "@/lib/kaambag-mock-data";

export default function PaymentsPage() {
  return (
    <StaffModuleGate permission="finance:reconcile" title="Payments">
      <div className="space-y-4">
        <h1 className="font-serif text-2xl text-ink">Payments</h1>
        <div className="border border-line">
          {MOCK_CONTRIBUTIONS.map((c) => {
            const campaign = MOCK_CAMPAIGNS.find((camp) => camp.slug === c.campaignSlug);
            return (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm last:border-b-0"
              >
                <div>
                  <p className="text-ink">{campaign?.title ?? c.campaignSlug}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {c.reference} · {c.date} · settled
                  </p>
                </div>
                <span className="font-mono text-ink">{formatPeso(c.amountMinorUnits)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </StaffModuleGate>
  );
}