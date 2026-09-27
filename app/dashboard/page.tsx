"use client";

// ambagan-web/app/dashboard/page.tsx
//
// Overview — spec §4.3. Covers both Kaambag and Katiwala dashboard areas
// in one page, since §3 is explicit that "a single person may hold
// multiple user roles" — the same real test account already does both
// (test@ambagan.dev created "Pay for my tuition" while also being the one
// logged in here). Kept the existing ProtectedRoute/DashboardContent
// split exactly as it already was — only the content inside changed.

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth/auth-context";
import { formatPeso } from "@/lib/money";
import { MOCK_CONTRIBUTIONS, MOCK_FOLLOWED_SLUGS, MOCK_NOTIFICATIONS } from "@/lib/kaambag-mock-data";

const KAAMBAG_LINKS = [
  { href: "/my-ambag", label: "My Ambag", note: "Campaigns you've supported" },
  { href: "/followed", label: "Followed Ambagans", note: "Keeping an eye on" },
  { href: "/receipts", label: "Receipts", note: "Itemized contributions" },
  { href: "/tiwala-history", label: "Tiwala eligibility & history", note: "Give trust, see history" },
  { href: "/claims", label: "Claims", note: "Protektadong Ambag" },
  { href: "/notifications", label: "Notifications", note: "Activity feed" },
  { href: "/account", label: "Account", note: "Verification, security, settings" },
];

const KATIWALA_LINKS = [
  { href: "/campaigns/mine", label: "My Ambagans", note: "Campaigns you steward" },
  { href: "/campaigns/new", label: "Create Ambagan", note: "Start a new campaign" },
  { href: "/tiwala-profile", label: "Tiwala profile", note: "Your reputation as a Katiwala" },
];

function DashboardContent() {
  const { user } = useAuth();

  const totalContributedMinorUnits = MOCK_CONTRIBUTIONS.reduce(
    (sum, c) => sum + Number(c.amountMinorUnits),
    0
  );
  const unreadNotifications = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl text-ink">Welcome back</h1>
        <p className="mt-2 text-muted">
          Signed in as <span className="font-mono text-sm text-ink">{user?.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-line px-4 py-3">
          <p className="text-sm text-muted">Total contributed</p>
          <p className="mt-1 font-mono text-lg text-ink">
            {formatPeso(String(totalContributedMinorUnits))}
          </p>
        </div>
        <div className="border border-line px-4 py-3">
          <p className="text-sm text-muted">Campaigns supported</p>
          <p className="mt-1 font-mono text-lg text-ink">
            {new Set(MOCK_CONTRIBUTIONS.map((c) => c.campaignSlug)).size}
          </p>
        </div>
        <div className="border border-line px-4 py-3">
          <p className="text-sm text-muted">Following</p>
          <p className="mt-1 font-mono text-lg text-ink">{MOCK_FOLLOWED_SLUGS.length}</p>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-sm uppercase tracking-wide text-muted">As a Kaambag</h2>
        <div className="mt-3 space-y-3">
          {KAAMBAG_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between border border-line px-5 py-4 hover:border-teal"
            >
              <span className="text-ink">
                {link.label}
                {link.href === "/notifications" && unreadNotifications > 0 && (
                  <span className="ml-2 border border-teal px-1.5 py-0.5 text-xs text-teal">
                    {unreadNotifications} new
                  </span>
                )}
              </span>
              <span className="text-sm text-muted">{link.note}</span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-sm uppercase tracking-wide text-muted">As a Katiwala</h2>
        <div className="mt-3 space-y-3">
          {KATIWALA_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between border border-line px-5 py-4 hover:border-teal"
            >
              <span className="text-ink">{link.label}</span>
              <span className="text-sm text-muted">{link.note}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}