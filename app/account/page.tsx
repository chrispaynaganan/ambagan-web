"use client";

// ambagan-web/app/account/page.tsx
//
// Account overview — spec §4.2: "Role cards, verification banner, security
// alerts, connected campaigns." Uses the real useAuth() session for
// email/displayName, but role and verification status are mocked —
// AuthUser doesn't carry roles/permissions yet (project summary §5.2 item
// 3), and there's no live identity-verification status to read either
// (the identity-access DTO shapes haven't been confirmed against real
// code — see the note on /account/verification).

import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth/auth-context";

const ACCOUNT_LINKS = [
  { href: "/account/verification", label: "Identity verification", note: "Not started" },
  { href: "/account/security", label: "Security", note: "Password, 2FA, sessions" },
  { href: "/account/privacy", label: "Privacy controls", note: "Data export, visibility" },
  { href: "/account/notifications", label: "Notification preferences", note: "Channels, events" },
  { href: "/account/payment-methods", label: "Payment methods", note: "Saved tokens" },
];

function AccountOverviewContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="text-muted">Loading…</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl text-ink">Account</h1>
        <p className="mt-2 text-muted">{user?.email ?? "Not signed in"}</p>
      </div>

      <div className="border border-line px-5 py-4">
        <p className="font-serif text-ink">Kaambag</p>
        <p className="mt-1 text-sm text-muted">
          Standard account. Verify your identity to unlock higher
          contribution limits and give Tiwala.
        </p>
      </div>

      <div className="border border-gold px-5 py-4 text-sm text-ink">
        <p className="font-medium">Verification: Not started</p>
        <p className="mt-1 text-muted">
          Privileged actions — publishing a campaign, giving Tiwala, higher
          contribution limits — stay locked until you&apos;re verified.
        </p>
        <Link href="/account/verification" className="mt-2 inline-block text-teal hover:text-teal-dark">
          Start verification →
        </Link>
      </div>

      <div className="space-y-3">
        {ACCOUNT_LINKS.map((link) => (
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
  );
}

export default function AccountOverviewPage() {
  return (
    <ProtectedRoute>
      <AccountOverviewContent />
    </ProtectedRoute>
  );
}