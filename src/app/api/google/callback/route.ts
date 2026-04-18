import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createOAuthClient } from "@/lib/google/oauth";
import { env } from "@/lib/env";

/**
 * OAuth callback for Google Business Profile.
 *
 * Currently a stub: it validates state, exchanges the code for tokens,
 * and redirects back to /dashboard. Once Google Business Profile API
 * access is approved, add:
 *   1. Encrypt + persist the refresh token to `restaurants.google_refresh_token`
 *   2. Fetch the list of accounts/locations and ask the user to pick one
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (error) {
    return redirectWithError(`google_error:${error}`);
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectWithError("invalid_state");
  }
  if (!env.googleClientId || !env.googleClientSecret) {
    return redirectWithError("google_not_configured");
  }

  try {
    const client = createOAuthClient();
    const { tokens } = await client.getToken(code);

    // TODO: persist tokens.refresh_token (encrypted) onto the authenticated
    // user's restaurant row, then fetch GBP accounts/locations.
    console.log("[google/callback] received tokens", {
      hasAccess: Boolean(tokens.access_token),
      hasRefresh: Boolean(tokens.refresh_token),
      scope: tokens.scope,
    });

    return NextResponse.redirect(new URL("/dashboard?connected=1", url));
  } catch (e) {
    console.error("[google/callback] token exchange failed", e);
    return redirectWithError("token_exchange_failed");
  }
}

function redirectWithError(code: string) {
  const redirect = new URL("/dashboard", env.appUrl);
  redirect.searchParams.set("error", code);
  return NextResponse.redirect(redirect);
}
