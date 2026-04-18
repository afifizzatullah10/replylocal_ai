import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { ArrowRight, MessageSquare, Sparkles, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-200/60 via-transparent to-transparent dark:from-neutral-800/40" />
        <div className="relative mx-auto max-w-5xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <Badge variant="secondary" className="mb-6">
            Built for independent restaurants
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
            Google reviews, answered.
            <br />
            <span className="text-muted-foreground">Approved by text.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            ReplyLocal watches your Google Business Profile, drafts replies in
            your voice, and texts them to you. Reply{" "}
            <span className="font-mono text-foreground">OK</span> to post. Reply{" "}
            <span className="font-mono text-foreground">EDIT</span> to change.
            No dashboard. No learning curve.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/demo" className={buttonVariants({ size: "lg" })}>
              Try the demo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className={buttonVariants({ size: "lg", variant: "ghost" })}
            >
              How it works
            </Link>
            <Link
              href="#waitlist"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Join waitlist
            </Link>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Piloting with independent restaurants in Pittsburgh · Carnegie Mellon
            student project.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Three steps. That&apos;s it.
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Step
              icon={<Sparkles className="h-5 w-5" />}
              step="1"
              title="We watch your reviews"
              body="Connect your Google Business Profile once. We check for new reviews every 30 minutes."
            />
            <Step
              icon={<MessageSquare className="h-5 w-5" />}
              step="2"
              title="You get a text"
              body="An AI draft in your voice, tailored to the reviewer and the star rating. Takes 10 seconds to read."
            />
            <Step
              icon={<ShieldCheck className="h-5 w-5" />}
              step="3"
              title="You approve, we post"
              body="Reply OK to post it. Reply EDIT to change it. Ignore to skip. You&apos;re always in control."
            />
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Why this exists
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">
            Independent restaurant owners run the floor. They don&apos;t log into
            dashboards. But Google reviews affect where their restaurant shows
            up on Maps, and every unanswered 1-star review costs them
            customers. ReplyLocal fixes that without asking them to learn new
            software.
          </p>
        </div>
      </section>

      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <WaitlistForm />
        </div>
      </section>
    </main>
  );
}

function Step({
  icon,
  step,
  title,
  body,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          {icon}
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Step {step}
        </span>
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {body}
      </p>
    </div>
  );
}
