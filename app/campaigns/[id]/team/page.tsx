"use client";

// ambagan-web/app/campaigns/[id]/team/page.tsx
//
// Team — Katiwala dashboard area (spec §4.3, and the "Campaign
// collaborator" actor in §3: "may edit story, post updates, or view
// campaign metrics as assigned. Cannot receive/request funds unless
// separately authorized"). The real CampaignMember entity exists in your
// tree, but no invite/list DTO was in the confirmed contract — local
// state only.

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useOwnedCampaign } from "@/lib/hooks/use-owned-campaign";

interface LocalMember {
  email: string;
  role: "editor" | "viewer";
}

function TeamContent() {
  const { campaignId, campaign, loading, error, isOwner } = useOwnedCampaign();
  const [members, setMembers] = useState<LocalMember[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<LocalMember["role"]>("editor");

  if (loading) return <p className="text-muted">Loading…</p>;
  if (error) return <p className="border border-danger px-4 py-3 text-danger">{error}</p>;
  if (!campaign) return <p className="text-ink">Campaign not found.</p>;
  if (!isOwner) return <p className="text-ink">You don&apos;t have access to this page.</p>;

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setMembers((prev) => [...prev, { email: email.trim(), role }]);
    setEmail("");
  }

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <Link href={`/campaigns/${campaignId}/manage`} className="text-sm text-teal hover:text-teal-dark">
          ← Back to {campaign.title}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-ink">Team</h1>
        <p className="mt-1 text-sm text-muted">
          Collaborators can edit the story or post updates. They can&apos;t
          receive or request funds unless separately authorized. Once
          added, their workspace is at{" "}
          <Link href={`/campaigns/${campaignId}/collaborate`} className="text-teal hover:text-teal-dark">
            /campaigns/{campaignId}/collaborate
          </Link>{" "}
          — this page doesn&apos;t generate a real invite link yet (see the
          note at the top of this file), so getting them there today means
          telling them the URL directly.
        </p>
      </div>

      {members.length === 0 ? (
        <p className="border border-line px-5 py-6 text-center text-muted">
          No collaborators added yet.
        </p>
      ) : (
        <div className="border border-line">
          {members.map((m) => (
            <div
              key={m.email}
              className="flex items-center justify-between border-b border-line px-5 py-3 text-sm last:border-b-0"
            >
              <span className="text-ink">{m.email}</span>
              <span className="font-mono text-xs text-muted">{m.role}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleInvite} className="space-y-4 border border-line px-6 py-6">
        <h2 className="font-serif text-lg text-ink">Invite a collaborator</h2>
        <label className="block text-sm text-ink">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          />
        </label>
        <label className="block text-sm text-ink">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as LocalMember["role"])}
            className="mt-1 block w-full border border-line px-3 py-2 text-sm text-ink"
          >
            <option value="editor">Editor (story, updates)</option>
            <option value="viewer">Viewer (metrics only)</option>
          </select>
        </label>
        <button type="submit" className="rounded bg-teal px-5 py-2.5 text-paper hover:bg-teal-dark">
          Send invite
        </button>
      </form>
    </div>
  );
}

export default function TeamPage() {
  return (
    <ProtectedRoute>
      <TeamContent />
    </ProtectedRoute>
  );
}