"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, ChevronLeft, MessageSquare, Pencil, SkipForward, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DemoSmsTurn } from "@/lib/demo/sequence";
import { DEMO_SMS_SEQUENCE } from "@/lib/demo/sequence";

type TurnOutcome = "pending" | "posted" | "edited" | "skipped";

export function DemoExperience() {
  const sequence = useMemo(() => DEMO_SMS_SEQUENCE, []);
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<TurnOutcome[]>(() =>
    sequence.map(() => "pending"),
  );
  const [phase, setPhase] = useState<"sms" | "edit" | "thankyou">("sms");
  const [editText, setEditText] = useState("");

  const current = sequence[index];
  const total = sequence.length;
  const allDone =
    outcomes.length > 0 && outcomes.every((o) => o !== "pending");

  const setOutcomeAt = useCallback((i: number, o: TurnOutcome) => {
    setOutcomes((prev) => {
      const next = [...prev];
      next[i] = o;
      return next;
    });
  }, []);

  const advanceAfterAction = useCallback(() => {
    if (index < total - 1) {
      setIndex((i) => i + 1);
      setPhase("sms");
      setEditText("");
    } else {
      setPhase("thankyou");
    }
  }, [index, total]);

  const handleOk = () => {
    setOutcomeAt(index, "posted");
    toast.success("Posted (prototype — nothing sent to Google)");
    advanceAfterAction();
  };

  const handleSkip = () => {
    setOutcomeAt(index, "skipped");
    toast.message("Skipped this reply");
    advanceAfterAction();
  };

  const openEdit = () => {
    setEditText(current.draftReply);
    setPhase("edit");
  };

  const saveEdit = () => {
    setOutcomeAt(index, "edited");
    toast.success("Saved your edit (prototype only)");
    advanceAfterAction();
  };

  const cancelEdit = () => {
    setPhase("sms");
    setEditText("");
  };

  if (phase === "thankyou" || allDone) {
    return <ThankYouCard />;
  }

  if (phase === "edit") {
    return (
      <Card className="mx-auto max-w-lg border shadow-lg">
        <CardHeader>
          <CardTitle>Edit reply</CardTitle>
          <CardDescription>
            In the real product you&apos;d text back{" "}
            <span className="font-mono text-foreground">EDIT: …</span>. Here you
            can tweak the draft.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="edit-draft">Your reply</Label>
          <Textarea
            id="edit-draft"
            rows={8}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="resize-y min-h-[180px]"
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonVariants({ className: "flex-1" })}
            onClick={saveEdit}
          >
            Use this wording
          </button>
          <button
            type="button"
            className={buttonVariants({ variant: "outline", className: "flex-1" })}
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PrototypeBanner />

      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Review {index + 1} of {total}
        </span>
        <div className="flex gap-1">
          {sequence.map((_, i) => (
            <span
              key={sequence[i].id}
              className={`h-2 w-2 rounded-full ${
                i === index
                  ? "bg-primary"
                  : outcomes[i] !== "pending"
                    ? "bg-primary/40"
                    : "bg-muted-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>

      <PhoneFrame turn={current} />

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          className={buttonVariants({ className: "w-full gap-1.5" })}
          onClick={handleOk}
        >
          <Check className="h-4 w-4" />
          OK — post it
        </button>
        <button
          type="button"
          className={buttonVariants({ variant: "outline", className: "w-full gap-1.5" })}
          onClick={openEdit}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          type="button"
          className={buttonVariants({ variant: "secondary", className: "w-full gap-1.5" })}
          onClick={handleSkip}
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Real flow: you&apos;d reply <span className="font-mono">OK</span>,{" "}
        <span className="font-mono">EDIT: …</span>, or ignore to skip — all by
        SMS.
      </p>

      <div className="flex justify-center">
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}

function PrototypeBanner() {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
      <strong className="font-semibold">Prototype — sample data.</strong> No
      Google account, no texts sent. For owner conversations only.
    </div>
  );
}

function PhoneFrame({ turn }: { turn: DemoSmsTurn }) {
  const stars = Array.from({ length: turn.starRating }, (_, i) => (
    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
  ));

  return (
    <div className="rounded-[2rem] border-4 border-foreground/80 bg-gradient-to-b from-muted/80 to-muted/40 p-3 shadow-2xl ring-1 ring-border">
      <div className="mb-3 flex justify-center">
        <div className="h-6 w-24 rounded-full bg-foreground/10" />
      </div>
      <div className="space-y-3 rounded-2xl bg-background p-4 shadow-inner">
        <div className="flex items-center gap-2 border-b pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">ReplyLocal</p>
            <p className="text-xs text-muted-foreground">Google review draft</p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            Now
          </Badge>
        </div>

        <div className="rounded-xl bg-muted/60 p-3 text-sm leading-relaxed">
          <p className="font-medium text-foreground">
            New {turn.starRating}★ review
            {turn.reviewerName ? ` · ${turn.reviewerName}` : ""}
          </p>
          <div className="my-1 flex gap-0.5">{stars}</div>
          <p className="mt-2 text-muted-foreground italic">
            &ldquo;{turn.reviewPreview}&rdquo;
          </p>
          <div className="mt-4 border-t pt-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-mono mb-1.5">
              Suggested reply
            </p>
            <p>{turn.draftReply}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThankYouCard() {
  const [picked, setPicked] = useState<string | null>(null);

  const pick = (label: string) => {
    setPicked(label);
    toast.message("Thanks — not saved anywhere (prototype). Discuss with me live!");
  };

  return (
    <Card className="mx-auto max-w-lg border shadow-lg">
      <CardHeader>
        <CardTitle>That&apos;s the loop</CardTitle>
        <CardDescription>
          Quick pulse check — helps me prioritize what to build next. Your pick
          isn&apos;t stored; we can talk numbers in person.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium">
          Would you use something like this for your restaurant?
        </p>
        <div className="grid gap-2">
          <button
            type="button"
            className={buttonVariants({
              variant: picked === "yes" ? "default" : "outline",
              className: "w-full justify-center",
            })}
            onClick={() => pick("yes")}
          >
            Yes — I&apos;d want this
          </button>
          <button
            type="button"
            className={buttonVariants({
              variant: picked === "maybe" ? "default" : "outline",
              className: "w-full justify-center",
            })}
            onClick={() => pick("maybe")}
          >
            Maybe — depends on price / trust
          </button>
          <button
            type="button"
            className={buttonVariants({
              variant: picked === "no" ? "secondary" : "outline",
              className: "w-full justify-center",
            })}
            onClick={() => pick("no")}
          >
            Probably not
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ChevronLeft className="h-4 w-4" />
          Home
        </Link>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Preview dashboard (future product)
        </Link>
      </CardFooter>
    </Card>
  );
}
