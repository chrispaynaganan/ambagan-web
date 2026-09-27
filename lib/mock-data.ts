// ambagan-web/lib/mock-data.ts
//
// Placeholder data for pure-frontend screens (Home, Discover, Campaign
// Detail) built before ambagan-api integration is back in scope. None of
// this is real — swap for real listCampaigns()/getCampaign() calls later;
// kept in one file so that swap is a single place to look.
//
// One canonical list (MOCK_CAMPAIGNS) rather than a separate "featured"
// array — Home derives its featured set from the `featured` flag via
// getFeaturedCampaigns() so the two screens can't show contradictory data.

export interface MockCampaign {
  slug: string;
  title: string;
  // "Para kay..." / "Para sa..." per the canonical naming rules (§1.1) —
  // never render a generic "Recipient:" label instead of this.
  recipientLine: string;
  category: string;
  // Numeric strings, in centavos — matches the real Campaign entity's
  // goalAmountMinorUnits wire format (§4.7: always a bigint transmitted as
  // a numeric string, never a JS number, to avoid precision loss). Confirmed
  // 27 Sept: lib/money.ts's real formatPeso() takes a string, not a number.
  goalMinorUnits: string;
  raisedMinorUnits: string;
  katiwalaVerified: boolean;
  location: string;
  // Editorial curation for Home's "Featured Ambagans" — independent of
  // katiwalaVerified, since not every verified campaign should be featured.
  featured: boolean;
  // Mock-only field so Discover's "Newest" sort has something real to sort
  // on. A real campaign would use createdAt/publishedAt instead.
  postedDaysAgo: number;
}

export const MOCK_CAMPAIGNS: MockCampaign[] = [
  {
    slug: "patuloy-na-dialysis-para-kay-maria",
    title: "Patuloy na Dialysis para kay Maria",
    recipientLine: "Para kay Maria",
    category: "Medical",
    goalMinorUnits: "15000000", // PHP 150,000.00
    raisedMinorUnits: "8720000",
    katiwalaVerified: true,
    location: "Quezon City",
    featured: true,
    postedDaysAgo: 4,
  },
  {
    slug: "help-rebuild-our-school",
    title: "Help Rebuild Our School",
    recipientLine: "Para sa Barangay San Roque",
    category: "Disaster relief",
    goalMinorUnits: "30000000",
    raisedMinorUnits: "12500000",
    katiwalaVerified: true,
    location: "Tacloban City",
    featured: true,
    postedDaysAgo: 12,
  },
  {
    slug: "pay-for-my-tuition",
    title: "Pay for My Tuition",
    recipientLine: "Para kay Juan",
    category: "Education",
    goalMinorUnits: "5000000",
    raisedMinorUnits: "0",
    // Corrected 27 Sept: was false. A campaign only reaches `live` after
    // `approved`, which requires the Katiwala to already be identity-
    // verified (AUTH-003) — a public, discoverable campaign with an
    // unverified Katiwala isn't a state that can really exist.
    katiwalaVerified: true,
    location: "Cebu City",
    featured: true,
    postedDaysAgo: 1,
  },
  {
    slug: "burol-at-libing-para-kay-tatay",
    title: "Burol at Libing para kay Tatay",
    recipientLine: "Para sa pamilya nina Tatay",
    category: "Funeral",
    goalMinorUnits: "8000000",
    raisedMinorUnits: "6100000",
    katiwalaVerified: true,
    location: "Davao City",
    featured: false,
    postedDaysAgo: 20,
  },
  {
    slug: "muling-pagtayo-pagkatapos-ng-bagyo",
    title: "Muling Pagtayo Pagkatapos ng Bagyo",
    recipientLine: "Para sa mga pamilyang apektado",
    category: "Housing",
    goalMinorUnits: "40000000",
    raisedMinorUnits: "5200000",
    // Corrected 27 Sept — see the note on "pay-for-my-tuition" above. This
    // campaign's real trust gaps (recipient verification, DSWD permit,
    // Patunay) are still pending — that's the honest "partial trust" story
    // for a live campaign, not an unverified Katiwala.
    katiwalaVerified: true,
    location: "Legazpi City",
    featured: false,
    postedDaysAgo: 45,
  },
  {
    slug: "barangay-health-center-supplies",
    title: "Barangay Health Center Supplies",
    recipientLine: "Para sa Barangay Health Center",
    category: "Community",
    goalMinorUnits: "10000000",
    raisedMinorUnits: "4400000",
    katiwalaVerified: true,
    location: "Iloilo City",
    featured: false,
    postedDaysAgo: 7,
  },
  {
    slug: "para-sa-gamot-ni-lola",
    title: "Para sa Gamot ni Lola",
    recipientLine: "Para kay Lola Nena",
    category: "Personal hardship",
    goalMinorUnits: "3500000",
    raisedMinorUnits: "900000",
    katiwalaVerified: true, // corrected 27 Sept — see note above
    location: "Baguio City",
    featured: false,
    postedDaysAgo: 30,
  },
];

export const CAMPAIGN_CATEGORIES = [
  "Medical",
  "Education",
  "Disaster relief",
  "Funeral",
  "Housing",
  "Community",
  "Personal hardship",
] as const;

export function getFeaturedCampaigns(): MockCampaign[] {
  return MOCK_CAMPAIGNS.filter((c) => c.featured);
}

// Shared slug format for /category/{slug} — kept here so Home's category
// links and the category page itself can't disagree on how a category
// name turns into a URL slug.
export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function categoryFromSlug(slug: string): string | undefined {
  return CAMPAIGN_CATEGORIES.find((c) => categorySlug(c) === slug);
}