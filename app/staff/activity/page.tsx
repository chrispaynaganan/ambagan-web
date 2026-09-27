// ambagan-web/app/staff/activity/page.tsx
//
// Activity Stream — spec §19.2: "Real-time/near-real-time critical events
// with filters and severity." No real event stream exists — this is a
// static illustrative list, not actually real-time.

const EVENTS = [
  { severity: "info", text: "New campaign submitted for review: Para sa Gamot ni Lola", time: "2m ago" },
  { severity: "warn", text: "Payout destination verification failed (retry 2/3)", time: "14m ago" },
  { severity: "info", text: "Patunay accepted on Barangay Health Center Supplies", time: "1h ago" },
  { severity: "critical", text: "Duplicate campaign flagged by fraud screening", time: "3h ago" },
] as const;

const SEVERITY_COLOR: Record<(typeof EVENTS)[number]["severity"], string> = {
  info: "text-muted",
  warn: "text-gold-dark",
  critical: "text-danger",
};

export default function ActivityStreamPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-2xl text-ink">Activity Stream</h1>
      <div className="border border-line">
        {EVENTS.map((e, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-line px-4 py-3 text-sm last:border-b-0"
          >
            <span className={SEVERITY_COLOR[e.severity]}>{e.text}</span>
            <span className="font-mono text-xs text-muted">{e.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}