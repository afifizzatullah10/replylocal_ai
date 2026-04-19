import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/lib/env";
import { fetchReviewsForRestaurant } from "@/lib/google/reviews";
import { OwnerAiSummarySection } from "@/components/dashboard/owner-ai-summary-section";
import { getMockRestaurant, getMockDrafts } from "@/lib/mock/data";
import { getMockOwnerAiSummary } from "@/lib/mock/owner-ai-summary";
import type { Review, ReplyDraft } from "@/lib/supabase/types";
import { Star, MessageCircle, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const restaurant = getMockRestaurant();
  const reviews = await fetchReviewsForRestaurant({
    restaurantId: restaurant.id,
  });
  const drafts = getMockDrafts();
  const draftByReviewId = new Map(drafts.map((d) => [d.review_id, d]));

  const stats = {
    total: reviews.length,
    unanswered: reviews.filter((r) => !draftByReviewId.get(r.id)?.posted_to_google_at).length,
    pending: drafts.filter((d) => d.status === "pending").length,
    avgRating:
      reviews.reduce((sum, r) => sum + r.star_rating, 0) /
      Math.max(reviews.length, 1),
  };

  return (
    <main className="flex-1">
      <div className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-3 text-center text-sm text-amber-950 dark:text-amber-100">
        <strong className="font-semibold">Owner demo:</strong> send people to{" "}
        <Link href="/demo" className="underline underline-offset-2 font-medium">
          /demo
        </Link>{" "}
        first — this dashboard is a Phase&nbsp;1 preview with mock data.
      </div>
      <div className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
              Dashboard
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {restaurant.restaurant_name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {env.mockMode ? (
              <Badge variant="secondary">Mock mode</Badge>
            ) : (
              <Badge>Live</Badge>
            )}
            <Link
              href="/api/google/connect"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Connect Google
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <section className="grid gap-4 sm:grid-cols-4">
          <Stat label="Total reviews (30d)" value={stats.total.toString()} />
          <Stat
            label="Avg rating"
            value={stats.avgRating.toFixed(1)}
            suffix={<Star className="h-4 w-4 fill-current" />}
          />
          <Stat label="Unanswered" value={stats.unanswered.toString()} />
          <Stat label="Pending approval" value={stats.pending.toString()} />
        </section>

        <OwnerAiSummarySection
          summary={getMockOwnerAiSummary()}
          reviewCount={reviews.length}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Recent reviews
            </CardTitle>
            <CardDescription>
              {env.mockMode
                ? "Showing mock data. Connect Google to pull real reviews."
                : "Pulled from your Google Business Profile."}
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {reviews.map((review) => (
              <ReviewRow
                key={review.id}
                review={review}
                draft={draftByReviewId.get(review.id)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold flex items-center gap-1.5">
        {value}
        {suffix}
      </p>
    </div>
  );
}

function ReviewRow({
  review,
  draft,
}: {
  review: Review;
  draft: ReplyDraft | undefined;
}) {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {review.reviewer_name ?? "Anonymous"}
            </span>
            <span className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: review.star_rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </span>
            <span className="text-xs text-muted-foreground">
              {review.review_posted_at
                ? new Date(review.review_posted_at).toLocaleDateString()
                : ""}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed">
            {review.review_text}
          </p>
        </div>
        {draft && <DraftBadge status={draft.status} />}
      </div>

      {draft && (
        <div className="mt-3 rounded-md border bg-muted/30 p-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono mb-1.5">
            Draft reply
          </p>
          <p className="text-sm leading-relaxed">{draft.draft_text}</p>
        </div>
      )}

      {!draft && (
        <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          No draft yet — will be generated on the next cron run.
        </p>
      )}
    </div>
  );
}

function DraftBadge({ status }: { status: ReplyDraft["status"] }) {
  const variant: "default" | "secondary" | "outline" | "destructive" =
    status === "posted"
      ? "default"
      : status === "failed"
        ? "destructive"
        : status === "skipped"
          ? "outline"
          : "secondary";
  return <Badge variant={variant}>{status}</Badge>;
}
