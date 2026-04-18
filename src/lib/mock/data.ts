/**
 * Realistic mock data used while the Google Business Profile API
 * application is pending. Gated by NEXT_PUBLIC_MOCK_MODE.
 *
 * Once real credentials are wired up, swap `getReviewsForRestaurant`
 * from `src/lib/google/reviews.ts` — it's a one-file change.
 */

import type { Restaurant, Review, ReplyDraft } from "@/lib/supabase/types";

const MOCK_RESTAURANT: Restaurant = {
  id: "00000000-0000-0000-0000-000000000001",
  owner_user_id: null,
  owner_email: "owner@example.com",
  owner_phone: "+14125550123",
  restaurant_name: "Sami's Deli",
  cuisine: "deli",
  google_location_id: "locations/mock-1",
  google_account_id: "accounts/mock-1",
  google_refresh_token: null,
  tone_preference: "warm",
  context_notes:
    "Family-run Pittsburgh deli since 2008. Signature items: brisket sandwich, hummus plate, house-made pita. Owner's name is Sami. Warm, casual tone — 'thanks friend' is on-brand.",
  phone_verified_at: null,
  onboarding_completed_at: new Date(
    Date.now() - 14 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    restaurant_id: MOCK_RESTAURANT.id,
    google_review_id: "gmock-1",
    reviewer_name: "Sarah K.",
    star_rating: 5,
    review_text:
      "Best brisket sandwich in Pittsburgh, hands down. Sami remembered my order from last time. This place has so much heart.",
    review_posted_at: daysAgo(1),
    fetched_at: daysAgo(1),
    created_at: daysAgo(1),
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    restaurant_id: MOCK_RESTAURANT.id,
    google_review_id: "gmock-2",
    reviewer_name: "David L.",
    star_rating: 2,
    review_text:
      "Waited 45 minutes for a sandwich on a Tuesday lunch. Food was fine but the wait was way too long, and no one acknowledged us.",
    review_posted_at: daysAgo(2),
    fetched_at: daysAgo(2),
    created_at: daysAgo(2),
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    restaurant_id: MOCK_RESTAURANT.id,
    google_review_id: "gmock-3",
    reviewer_name: "Priya R.",
    star_rating: 4,
    review_text:
      "Great hummus plate, loved the house pita. Took one star off because the seating area was a bit loud. Will be back!",
    review_posted_at: daysAgo(3),
    fetched_at: daysAgo(3),
    created_at: daysAgo(3),
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    restaurant_id: MOCK_RESTAURANT.id,
    google_review_id: "gmock-4",
    reviewer_name: "Mike T.",
    star_rating: 5,
    review_text:
      "Been coming here for years. Consistent, kind, and the brisket is unreal. Tell Sami I said hi.",
    review_posted_at: daysAgo(5),
    fetched_at: daysAgo(5),
    created_at: daysAgo(5),
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    restaurant_id: MOCK_RESTAURANT.id,
    google_review_id: "gmock-5",
    reviewer_name: "Anonymous",
    star_rating: 1,
    review_text:
      "Charged me for extra pickles without telling me. Felt dishonest.",
    review_posted_at: daysAgo(7),
    fetched_at: daysAgo(7),
    created_at: daysAgo(7),
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    restaurant_id: MOCK_RESTAURANT.id,
    google_review_id: "gmock-6",
    reviewer_name: "Jenna P.",
    star_rating: 3,
    review_text:
      "Decent sandwich, small portion for the price. Nice staff though.",
    review_posted_at: daysAgo(10),
    fetched_at: daysAgo(10),
    created_at: daysAgo(10),
  },
];

const MOCK_DRAFTS: ReplyDraft[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    review_id: MOCK_REVIEWS[0].id,
    restaurant_id: MOCK_RESTAURANT.id,
    draft_text:
      "Sarah, you just made our day. Hearing that about the brisket means a lot — see you next time, friend. — Sami",
    status: "pending",
    sent_to_owner_at: null,
    approved_at: null,
    final_text: null,
    posted_to_google_at: null,
    error_message: null,
    model_used: "claude-haiku-4-5",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    review_id: MOCK_REVIEWS[1].id,
    restaurant_id: MOCK_RESTAURANT.id,
    draft_text:
      "David, 45 minutes is not the experience we want you to have. I'd love to make this right — please email sami@samisdeli.com and I'll personally take care of your next visit. Thank you for the honest feedback. — Sami",
    status: "pending",
    sent_to_owner_at: null,
    approved_at: null,
    final_text: null,
    posted_to_google_at: null,
    error_message: null,
    model_used: "claude-sonnet-4-5",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
];

export function getMockRestaurant(): Restaurant {
  return MOCK_RESTAURANT;
}

export function getMockReviews(): Review[] {
  return MOCK_REVIEWS;
}

export function getMockDrafts(): ReplyDraft[] {
  return MOCK_DRAFTS;
}

export function getMockReviewWithDraft(reviewId: string) {
  const review = MOCK_REVIEWS.find((r) => r.id === reviewId);
  const draft = MOCK_DRAFTS.find((d) => d.review_id === reviewId);
  return { review, draft };
}
