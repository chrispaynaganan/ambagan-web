import { apiFetch } from "./client";
import type { CampaignLifecycleState, CampaignReviewState } from "../campaign-state";

/**
 * Confirmed against the real campaigns.controller.ts / campaigns.service.ts /
 * campaign.entity.ts / create-campaign.dto.ts / update-campaign.dto.ts /
 * submit-for-review.dto.ts. Notable, non-obvious things baked in here:
 *
 *   - goalAmountMinorUnits is a numeric STRING in centavos, never a number —
 *     always build it with lib/money.ts's pesosToMinorUnits(), never
 *     `String(pesos * 100)`.
 *   - GET /campaigns and GET /campaigns/:id require no token — open reads.
 *   - GET /campaigns has NO ownership/visibility filtering server-side yet —
 *     ?katiwalaUserId=<id> returns that user's campaigns regardless of who's
 *     asking, drafts included. Fine here since the UI only ever passes the
 *     logged-in user's own id, but this is not real access control.
 *   - update() only succeeds server-side while the campaign is DRAFT or
 *     REJECTED — the API throws a 400 otherwise, surfaced as a normal
 *     ApiError. See lib/campaign-state.ts isEditableState().
 */

export interface Campaign {
  id: string;
  slug: string;
  katiwalaUserId: string;
  title: string;
  purposeCategory: string;
  story: Array<{ version: number; content: string; updatedAt: string }>;
  goalAmountMinorUnits: string;
  currency: string;
  location: Record<string, unknown>;
  lifecycleState: CampaignLifecycleState;
  reviewState: CampaignReviewState;
  visibility: "private" | "unlisted" | "public";
  dswdScreeningResult: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface CampaignListResult {
  items: Campaign[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCampaignInput {
  title: string;
  purposeCategory: string;
  goalAmountMinorUnits: string;
  currency?: string;
  location?: Record<string, unknown>;
}

export interface UpdateCampaignInput {
  title?: string;
  purposeCategory?: string;
  storyContent?: string;
  goalAmountMinorUnits?: string;
  location?: Record<string, unknown>;
}

export function createCampaign(token: string, input: CreateCampaignInput): Promise<Campaign> {
  return apiFetch<Campaign>("/campaigns", { method: "POST", token, body: input });
}

export function listCampaigns(
  params: {
    lifecycleState?: CampaignLifecycleState;
    katiwalaUserId?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<CampaignListResult> {
  const search = new URLSearchParams();
  if (params.lifecycleState) search.set("lifecycleState", params.lifecycleState);
  if (params.katiwalaUserId) search.set("katiwalaUserId", params.katiwalaUserId);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiFetch<CampaignListResult>(`/campaigns${qs ? `?${qs}` : ""}`);
}

export function getCampaign(id: string): Promise<Campaign> {
  return apiFetch<Campaign>(`/campaigns/${id}`);
}

export function updateCampaign(
  token: string,
  id: string,
  input: UpdateCampaignInput,
): Promise<Campaign> {
  return apiFetch<Campaign>(`/campaigns/${id}`, { method: "PATCH", token, body: input });
}

export function submitCampaignForReview(
  token: string,
  id: string,
  reason?: string,
): Promise<Campaign> {
  return apiFetch<Campaign>(`/campaigns/${id}/submit-for-review`, {
    method: "POST",
    token,
    body: reason ? { reason } : {},
  });
}