// ambagan-web/app/staff/page.tsx
//
// Executive Overview — spec §19.2. No permission gate (generally
// staff-visible). Figures derived from real mock data where possible
// (total raised, campaign/contribution counts); the rest (fraud trends,
// reserve, processor costs) is illustrative — there's no analytics
// backend behind any of it.

import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CONTRIBUTIONS } from "@/lib/kaambag-mock-data";
import { formatPeso } from "@/lib/money";

export default function ExecutiveOverviewPage() {
  const grossContributions = MOCK_CONTRIBUTIONS.reduce(
    (sum, c) => sum + Number(c.amountMinorUnits),
    0
  );
  const activeCampaigns = MOCK_CAMPAIGNS.length;

  const stats = [
    { label: "Gross contributions", value: formatPeso(String(grossContributions)) },
    { label: "Active campaigns", value: String(activeCampaigns) },
    { label: "Verification queue", value: "3 pending" },
    { label: "Payout balances held", value: formatPeso("580000") },
    { label: "Open claims", value: "1" },
    { label: "Fee revenue (period)", value: formatPeso("12400") },
    { label: "Processor costs (period)", value: "[illustrative]" },
    { label: "Protektadong Ambag reserve", value: "Not yet funded" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-ink">Executive Overview</h1>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className="border border-line px-4 py-3">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-mono text-lg text-ink">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}