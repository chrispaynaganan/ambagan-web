"use client";

// ambagan-web/app/ambagan/[slug]/page.tsx
//
// Campaign detail — Visitor persona, the spec's "primary trust surface"
// (§7). Implements all 12 required components: header, funding summary,
// purpose milestones, trust strip, story, use of funds, payout
// transparency, updates, Patunay, Katiwala card, Kaambag activity (donor
// wall), report action, and the "Ambag ka?" CTA.
//
// Pure frontend: summary fields (title, goal, raised, location, category)
// come from lib/mock-data.ts; everything else from
// lib/campaign-detail-data.ts, keyed by the same slug. Only two slugs have
// full detail data right now — any other real slug shows a "no detail
// data yet" state rather than a broken page.
//
// The "Ambag ka?" CTA points at /login for now — real checkout is the
// Kaambag persona's screen, not built yet. Swap this once that exists.

import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPeso } from "@/lib/money";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { MOCK_CAMPAIGN_DETAILS } from "@/lib/campaign-detail-data";

export default function CampaignDetailPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const summary =
    typeof slug === "string" ? MOCK_CAMPAIGNS.find((c) => c.slug === slug) : undefined;
  const detail = typeof slug === "string" ? MOCK_CAMPAIGN_DETAILS[slug] : undefined;

  if (!summary || !detail) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-ink">
          {summary ? "Details not available yet" : "Ambagan not found"}
        </h1>
        <p className="text-muted">
          {summary
            ? "This campaign doesn't have full detail data in the mock set yet."
            : "That campaign doesn't exist."}{" "}
          <Link href="/discover" className="text-teal hover:text-teal-dark">
            Browse all Ambagans →
          </Link>
        </p>
      </div>
    );
  }

  const pct = Math.min(
    100,
    Math.round((Number(summary.raisedMinorUnits) / Number(summary.goalMinorUnits)) * 100)
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <section>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-mono uppercase tracking-wide text-muted">
            {summary.category}
          </span>
          <span className="border border-line px-2 py-0.5 text-ink/70">Live</span>
        </div>
        <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">{summary.title}</h1>
        <p className="mt-2 text-muted">
          {summary.recipientLine} · {summary.location}
        </p>

        <div className="mt-5 flex h-48 items-center justify-center border border-line bg-line/30 font-mono text-xs text-muted">
          [Campaign photo/video]
        </div>

        <button className="mt-4 text-sm text-teal hover:text-teal-dark">
          Share this Ambagan
        </button>
      </section>

      {/* Funding summary + CTA */}
      <section className="border border-line px-6 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-serif text-3xl text-ink">{formatPeso(summary.raisedMinorUnits)}</p>
            <p className="mt-1 text-sm text-muted">
              raised of {formatPeso(summary.goalMinorUnits)} goal
            </p>
          </div>
          <Link
            href={`/ambagan/${summary.slug}/ambag`}
            className="rounded bg-teal px-6 py-3 text-paper hover:bg-teal-dark"
          >
            Ambag ka?
          </Link>
        </div>
        <div className="mt-4 h-1.5 w-full bg-line">
          <div className="h-1.5 bg-teal" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted">{detail.donorWall.length}+ Kaambags so far</p>
      </section>

      {/* Trust strip */}
      <section>
        <h2 className="font-serif text-xl text-ink">Trust &amp; verification</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <TrustBadge label="Katiwala verified" ok={detail.trustStrip.katiwalaVerified} />
          <TrustBadge label="Recipient verified" ok={detail.trustStrip.recipientVerified} />
          <TrustBadge
            label="Payout destination verified"
            ok={detail.trustStrip.payoutDestinationVerified}
          />
          <TrustBadge
            label="DSWD permit"
            ok={detail.trustStrip.dswdPermitStatus === "verified"}
            neutral={detail.trustStrip.dswdPermitStatus !== "verified"}
          />
          <TrustBadge
            label="Protektadong Ambag"
            ok={detail.trustStrip.protektadongAmbagStatus === "covered"}
            neutral={detail.trustStrip.protektadongAmbagStatus === "pending"}
          />
          <TrustBadge
            label="Media provenance"
            ok={detail.trustStrip.mediaProvenance === "standard_upload"}
            neutral={detail.trustStrip.mediaProvenance === "not_applicable"}
          />
        </div>
      </section>

      {/* Story */}
      <section>
        <h2 className="font-serif text-xl text-ink">Story</h2>
        <div className="mt-3 space-y-4">
          {detail.story.map((s) => (
            <p key={s.version} className="text-ink">
              {s.content}
            </p>
          ))}
        </div>
      </section>

      {/* Purpose milestones */}
      <section>
        <h2 className="font-serif text-xl text-ink">Purpose milestones</h2>
        <p className="mt-1 text-xs text-muted">
          Missing a milestone doesn&apos;t block funds already collected.
        </p>
        <div className="mt-3 space-y-4">
          {detail.milestones.map((m) => (
            <div key={m.title} className="border border-line px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-ink">{m.title}</h3>
                <span className="font-mono text-xs text-muted">
                  {m.status.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{m.description}</p>
              <div className="mt-2 h-1 w-full bg-line">
                <div className="h-1 bg-teal" style={{ width: `${m.progressPct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use of funds */}
      <section>
        <h2 className="font-serif text-xl text-ink">Use of funds</h2>
        <div className="mt-3 space-y-2">
          {detail.useOfFunds.map((u) => (
            <div
              key={u.category}
              className="flex items-center justify-between border-b border-line py-2 text-sm"
            >
              <span className="text-ink">{u.category}</span>
              <span className="font-mono text-muted">{u.plannedPct}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Payout transparency */}
      <section>
        <h2 className="font-serif text-xl text-ink">Payout transparency</h2>
        <p className="mt-2 text-sm text-ink">
          Destination type:{" "}
          <span className="font-mono">{detail.payoutTransparency.destinationType}</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          Released {formatPeso(detail.payoutTransparency.releasedMinorUnits)}, remaining{" "}
          {formatPeso(detail.payoutTransparency.remainingMinorUnits)}.
        </p>
      </section>

      {/* Updates */}
      <section>
        <h2 className="font-serif text-xl text-ink">Updates</h2>
        <div className="mt-3 space-y-4">
          {detail.updates.map((u) => (
            <div key={u.date}>
              <p className="font-mono text-xs text-muted">{u.date}</p>
              <h3 className="font-serif text-ink">{u.title}</h3>
              <p className="mt-1 text-sm text-muted">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Patunay */}
      <section>
        <h2 className="font-serif text-xl text-ink">Patunay</h2>
        {detail.patunay.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No Patunay submitted yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {detail.patunay.map((p) => (
              <div
                key={p.title}
                className="flex items-start justify-between border border-line px-4 py-3"
              >
                <div>
                  <p className="font-mono text-xs text-muted">{p.date}</p>
                  <h3 className="font-serif text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.summary}</p>
                </div>
                <span className={`text-xs ${p.verified ? "text-teal" : "text-muted"}`}>
                  {p.verified ? "Verified" : "Pending review"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Katiwala card */}
      <section className="border border-line px-6 py-6">
        <h2 className="font-serif text-xl text-ink">Katiwala</h2>
        <p className="mt-2 text-ink">{detail.katiwalaProfile.displayName}</p>
        <p className="text-sm text-muted">
          {detail.katiwalaProfile.level} level · {detail.katiwalaProfile.tiwalaCount} Tiwala ·{" "}
          {detail.katiwalaProfile.completedCampaigns} completed Ambagans ·{" "}
          {detail.katiwalaProfile.patunayCompletionRatePct}% Patunay completion
        </p>
      </section>

      {/* Kaambag activity / donor wall */}
      <section>
        <h2 className="font-serif text-xl text-ink">Kaambag activity</h2>
        <ul className="mt-3 space-y-2">
          {detail.donorWall.map((d, i) => (
            <li key={`${d.displayName}-${i}`} className="border-b border-line py-2 text-sm">
              <span className="text-ink">{d.displayName}</span>
              {d.message && <span className="text-muted"> — {d.message}</span>}
            </li>
          ))}
        </ul>
      </section>

      {/* Report */}
      <div>
        <button className="text-sm text-danger hover:underline">Report a concern</button>
      </div>
    </div>
  );
}

function TrustBadge({
  label,
  ok,
  neutral,
}: {
  label: string;
  ok: boolean;
  neutral?: boolean;
}) {
  return (
    <div
      className={`border px-3 py-2 text-xs ${
        ok ? "border-teal text-teal" : "border-line text-muted"
      }`}
    >
      <span className="mr-1">{ok ? "✓" : neutral ? "–" : "○"}</span>
      {label}
    </div>
  );
}