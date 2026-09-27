"use client";

// ambagan-web/lib/hooks/use-owned-campaign.ts
//
// Shared data-loading + ownership check for every Katiwala
// campaign-management sub-page (Milestones, Contributions, Payouts,
// Patunay, Compliance, Updates, Team, Claims). Each of those pages is
// fully owner-gated — unlike campaigns/[id]/recipients/page.tsx, which is
// intentionally half-public and keeps its own inline version of this
// logic since its rendering needs differ (show the list to everyone, gate
// only the form).
//
// `getCampaign`'s return shape is still an assumption — lib/api/
// campaigns.ts hasn't been shared directly, only described in prose.

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getCampaign } from "@/lib/api/campaigns";

export interface CampaignSummary {
  id: string;
  slug: string;
  title: string;
  katiwalaUserId: string;
}

export function useOwnedCampaign() {
  const params = useParams();
  const rawId = params.id;
  const campaignId = Array.isArray(rawId) ? rawId[0] : rawId;

  const { user, isLoading: authLoading } = useAuth();
  const [campaign, setCampaign] = useState<CampaignSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof campaignId !== "string") {
      setError("No campaign id in the URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load(id: string) {
      setLoading(true);
      setError(null);
      try {
        const result = await getCampaign(id);
        if (!cancelled) setCampaign(result as CampaignSummary);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load(campaignId);
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  const isOwner = Boolean(user && campaign && user.id === campaign.katiwalaUserId);

  return {
    campaignId,
    campaign,
    loading: loading || authLoading,
    error,
    isOwner,
    user,
  };
}
