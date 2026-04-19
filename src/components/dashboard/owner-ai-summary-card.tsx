import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MockOwnerAiSummary } from "@/lib/mock/owner-ai-summary";
import { Lightbulb, Sparkles } from "lucide-react";

type OwnerAiSummaryCardProps = {
  summary: MockOwnerAiSummary;
  reviewCount: number;
};

const priorityLabel: Record<
  MockOwnerAiSummary["suggestions"][number]["priority"],
  string
> = {
  high: "High impact",
  medium: "Medium impact",
  low: "Nice to have",
};

export function OwnerAiSummaryCard({
  summary,
  reviewCount,
}: OwnerAiSummaryCardProps) {
  return (
    <Card className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] via-card to-card dark:from-violet-500/10">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-700 dark:text-violet-300">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              Summarized by AI
            </CardTitle>
            <CardDescription>
              Mock owner briefing — reads every review on this page and surfaces
              themes plus concrete next steps. No backend call; for dashboard
              preview only.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0 font-normal">
            {reviewCount} review{reviewCount === 1 ? "" : "s"} analyzed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-foreground">{summary.headline}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {summary.overview}
          </p>
        </div>

        <Separator />

        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
            Themes from reviews
          </p>
          <ul className="mt-3 space-y-3">
            {summary.themes.map((t) => (
              <li key={t.title} className="text-sm leading-relaxed">
                <span className="font-medium text-foreground">{t.title}.</span>{" "}
                <span className="text-muted-foreground">{t.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-mono">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Suggestions for you
          </p>
          <ol className="mt-3 space-y-4">
            {summary.suggestions.map((s, i) => (
              <li
                key={s.title}
                className="rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">
                    {i + 1}. {s.title}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {priorityLabel[s.priority]}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
