/**
 * Centralized env access. Keeps the rest of the codebase from
 * sprinkling `process.env.X || ""` everywhere.
 */

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  mockMode:
    (process.env.NEXT_PUBLIC_MOCK_MODE ?? "true").toLowerCase() === "true",

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI ??
    "http://localhost:3000/api/google/callback",

  anthropicKey: process.env.ANTHROPIC_API_KEY ?? "",
  anthropicModelDraft:
    process.env.ANTHROPIC_MODEL_DRAFT ?? "claude-haiku-4-5",
  anthropicModelNegative:
    process.env.ANTHROPIC_MODEL_NEGATIVE ?? "claude-sonnet-4-5",

  twilioSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioFrom: process.env.TWILIO_FROM_NUMBER ?? "",

  cronSecret: process.env.CRON_SECRET ?? "",
  tokenEncryptionKey: process.env.TOKEN_ENCRYPTION_KEY ?? "",
};

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
