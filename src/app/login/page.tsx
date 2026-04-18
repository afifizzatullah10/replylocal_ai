import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env, isSupabaseConfigured } from "@/lib/env";

export default function LoginPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to ReplyLocal</CardTitle>
          <CardDescription>
            Pittsburgh pilot — by invitation for now.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {env.mockMode && (
            <div className="rounded-md border bg-muted/40 p-3 text-sm">
              <p className="font-medium">Demo mode</p>
              <p className="text-muted-foreground mt-1">
                Supabase auth isn&apos;t required for the owner demo. Use{" "}
                <strong>/demo</strong> for validation conversations.
              </p>
            </div>
          )}

          {!supabaseReady && (
            <p className="text-sm text-muted-foreground">
              Supabase isn&apos;t configured yet. Add{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              to <code className="font-mono">.env.local</code> to enable real
              sign-in.
            </p>
          )}

          <Link
            href="/demo"
            className={buttonVariants({ size: "lg", className: "w-full" })}
          >
            Try the interactive demo
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full",
            })}
          >
            Preview future dashboard (mock data)
          </Link>
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              className: "w-full",
            })}
          >
            Back to home
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
