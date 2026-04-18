import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { buildAuthUrl } from "@/lib/google/oauth";
import { env } from "@/lib/env";

/**
 * Kicks off the Google Business Profile OAuth flow.
 * The user is redirected to Google, then back to /api/google/callback.
 */
export async function GET() {
  if (!env.googleClientId || !env.googleClientSecret) {
    return NextResponse.json(
      {
        error:
          "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to use this route. Mock mode does not require Google OAuth.",
      },
      { status: 501 },
    );
  }

  const state = randomBytes(16).toString("hex");
  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  return NextResponse.redirect(buildAuthUrl(state));
}
