// ambagan-web/app/legal/community-guidelines/page.tsx
//
// Community guidelines — spec §4.1: "Campaign and content rules."

import { LegalPageShell } from "@/components/legal-page-shell";

export default function CommunityGuidelinesPage() {
  return (
    <LegalPageShell
      title="Community guidelines"
      sections={[
        "Who Can Create a Campaign",
        "What Campaigns Must Disclose",
        "Prohibited Content and Conduct",
        "Media and Evidence Standards",
        "Recipient Dignity and Privacy",
        "Enforcement and Appeals",
      ]}
    />
  );
}