"use client";

import { useState } from "react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const eTrim = email.trim();
    const pTrim = phone.trim();
    if (!eTrim && !pTrim) {
      toast.error("Add an email or a phone number so we can reach you.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: eTrim || undefined, phone: pTrim || undefined }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }
      toast.success("You’re on the list — we’ll be in touch.");
      setEmail("");
      setPhone("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card id="waitlist" className="border shadow-md scroll-mt-24">
      <CardHeader>
        <CardTitle>Interested?</CardTitle>
        <CardDescription>
          Join the waitlist for early access. Leave your email, phone, or both.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="waitlist-email">Email</Label>
              <Input
                id="waitlist-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waitlist-phone">Phone</Label>
              <Input
                id="waitlist-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (412) 555-0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={pending}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            At least one field is required. No spam — just a note when we open
            pilots.
          </p>
          <button
            type="submit"
            disabled={pending}
            className={buttonVariants({ className: "w-full sm:w-auto" })}
          >
            {pending ? "Sending…" : "Join waitlist"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
