import { google } from "googleapis";
import { env } from "@/lib/env";

export const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  // Google Business Profile — owners manage locations, reviews, posts.
  "https://www.googleapis.com/auth/business.manage",
];

export function createOAuthClient() {
  return new google.auth.OAuth2({
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    redirectUri: env.googleRedirectUri,
  });
}

export function buildAuthUrl(state: string): string {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_SCOPES,
    state,
    include_granted_scopes: true,
  });
}
