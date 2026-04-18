import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `set` call from a Server Component will throw.
          // Middleware is responsible for refreshing cookies instead.
        }
      },
    },
  });
}

/**
 * Service-role client. ONLY use in trusted server contexts
 * (cron jobs, webhook handlers) where RLS must be bypassed.
 * Never import this from the client bundle.
 */
export function createSupabaseServiceClient() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — cannot create service client.",
    );
  }
  return createServerClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        /* no-op */
      },
    },
  });
}
