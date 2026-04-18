/**
 * Review fetcher abstraction.
 *
 * While `NEXT_PUBLIC_MOCK_MODE=true`, returns fixtures from `@/lib/mock/data`.
 * Once Google Business Profile API access is granted, implement the
 * `fetchReviewsFromGoogle` path and it will take over automatically.
 */

import { env } from "@/lib/env";
import { getMockReviews } from "@/lib/mock/data";
import type { Review } from "@/lib/supabase/types";

export interface FetchReviewsOptions {
  restaurantId: string;
  googleAccountId?: string | null;
  googleLocationId?: string | null;
  googleRefreshToken?: string | null;
}

export async function fetchReviewsForRestaurant(
  opts: FetchReviewsOptions,
): Promise<Review[]> {
  if (env.mockMode) {
    return getMockReviews().map((r) => ({
      ...r,
      restaurant_id: opts.restaurantId,
    }));
  }

  return fetchReviewsFromGoogle(opts);
}

async function fetchReviewsFromGoogle(
  _opts: FetchReviewsOptions,
): Promise<Review[]> {
  // TODO: implement once Google Business Profile API access is approved.
  // Endpoint: GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews
  // Use an OAuth2 client with the stored refresh token.
  throw new Error(
    "Live Google reviews not implemented yet. Keep NEXT_PUBLIC_MOCK_MODE=true until API access is granted.",
  );
}
