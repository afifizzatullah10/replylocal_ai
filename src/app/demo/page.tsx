import type { Metadata } from "next";
import Link from "next/link";
import { DemoExperience } from "@/components/demo/demo-experience";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Interactive demo — ReplyLocal",
  description:
    "Prototype: approve Google review replies by text. Sample data only — no backend.",
};

export default function DemoPage() {
  return (
    <main className="flex-1">
      <div className="border-b bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Phase 0 · Validation
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Try the reply flow
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Walk through three sample reviews the way an owner would — quick
              taps instead of logging into Google. Nothing here connects to your
              account.
            </p>
          </div>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
            ← Home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <DemoExperience />
      </div>
    </main>
  );
}
