// ambagan-web/lib/collaborator-mock-data.ts
//
// Placeholder data for the Campaign collaborator persona (spec §3: "may
// edit story, post updates, or view campaign metrics as assigned. Cannot
// receive/request funds unless separately authorized"). No real backend
// route confirms collaborator access — the real CampaignMember entity
// exists in your tree, but no DTO/route for it was in the confirmed
// contract (same gap already flagged on the Team page). This simulates
// "campaigns I've been added to as a collaborator, with these specific
// permissions," assuming the invite was already accepted — it doesn't
// model the invite-acceptance flow itself, since Team's invite form has
// no real token/link generation to accept in the first place.

export interface CollaboratorAccess {
  campaignSlug: string;
  role: "editor" | "viewer";
  permissions: {
    canEditStory: boolean;
    canPostUpdates: boolean;
    canViewMetrics: boolean;
  };
}

export const MOCK_COLLABORATOR_ACCESS: CollaboratorAccess[] = [
  {
    campaignSlug: "help-rebuild-our-school",
    role: "editor",
    permissions: { canEditStory: true, canPostUpdates: true, canViewMetrics: true },
  },
];