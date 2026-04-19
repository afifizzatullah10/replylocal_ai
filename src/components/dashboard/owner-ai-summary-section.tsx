"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MockOwnerAiSummary } from "@/lib/mock/owner-ai-summary";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { OwnerAiSummaryCard } from "./owner-ai-summary-card";

type OwnerAiSummarySectionProps = {
  summary: MockOwnerAiSummary;
  reviewCount: number;
};

export function OwnerAiSummarySection({
  summary,
  reviewCount,
}: OwnerAiSummarySectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button
          type="button"
          variant="outline"
          className="w-fit border-violet-500/30 bg-violet-500/[0.04] hover:bg-violet-500/10"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="owner-ai-summary-panel"
        >
          <Sparkles
            className="mr-2 h-4 w-4 text-violet-600 dark:text-violet-400"
            aria-hidden
          />
          {open ? "Hide AI summary" : "Show AI summary"}
          {open ? (
            <ChevronUp className="ml-2 h-4 w-4 opacity-60" aria-hidden />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 opacity-60" aria-hidden />
          )}
        </Button>
        {!open && (
          <p className="text-sm text-muted-foreground">
            Themes and suggestions from all reviews (mock preview).
          </p>
        )}
      </div>
      {open && (
        <div id="owner-ai-summary-panel">
          <OwnerAiSummaryCard summary={summary} reviewCount={reviewCount} />
        </div>
      )}
    </div>
  );
}
