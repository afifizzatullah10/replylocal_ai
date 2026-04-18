# ReplyLocal

Automated Google review replies for independent restaurants, approved by SMS so owners never open a dashboard.

Built in weekends as a Carnegie Mellon student project, piloting with independent restaurants in Pittsburgh.

## Current phase (validation)

**Phase 0 — frontend-only:** The interactive demo lives at **`/demo`** — simulated SMS approval (OK / Edit / Skip), sample reviews, no backend required. Use this URL with restaurant owners before building integrations.

**Phase 1** (after validation): Supabase + Google Business Profile API + Claude + Twilio — see `plan.md`.

---

## The problem

Independent restaurant owners run the floor. They don't log into dashboards. But Google reviews affect where they show up on Google Maps, and every unanswered 1-star review costs them customers. Most owners I spoke with had 30+ unanswered reviews and a 14-day average response time. They know it matters; they just need it to happen on their phone in 10 seconds.

## The product

1. ReplyLocal watches a connected Google Business Profile for new reviews.
2. Claude drafts a reply in the owner's voice, tailored to the review and star rating.
3. The owner receives a text: *"New 4★ review from Sarah. Draft: ... Reply OK to post, EDIT to revise, SKIP to ignore."*
4. On approval, ReplyLocal posts the reply to Google.
5. The owner gets a weekly summary.

## Stack

- **Next.js 16** App Router + TypeScript
- **Tailwind v4** + **shadcn/ui**
- **Supabase** (Postgres + auth + RLS)
- **Anthropic Claude** (Haiku for drafts, Sonnet for negative reviews)
- **Twilio** Programmable Messaging
- **Google Business Profile API**
- **Vercel** hosting + Vercel Cron for polling

## Local setup

```bash
npm install
cp .env.example .env.local    # fill in keys as you get them
npm run dev
```

Visit `http://localhost:3000` — landing page. **`http://localhost:3000/demo`** — owner-facing prototype (no env vars needed).

`/dashboard` shows mock stats for developer preview; owners should use **`/demo`** during validation.

While `NEXT_PUBLIC_MOCK_MODE=true`, the dashboard uses fixture data — useful when testing Phase 1 pieces later.

### Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Paste `supabase/migrations/20260418000000_init.sql` into the SQL editor and run it.
3. Copy the project URL + anon key into `.env.local`.

### Google Business Profile API

Approval can take days to weeks — apply early.

1. Create a project in [Google Cloud Console](https://console.cloud.google.com).
2. Enable the **Google My Business** / **Business Profile** APIs (request access via the form).
3. Configure the OAuth consent screen (external, testing mode is fine to start).
4. Create an OAuth 2.0 client ID; add `http://localhost:3000/api/google/callback` as a redirect URI.
5. Fill in `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`.

## Project structure

```
src/
  app/
    page.tsx                 — landing page
    demo/page.tsx            — Phase 0 interactive prototype (owners)
    login/page.tsx           — optional entry / links
    dashboard/page.tsx       — Phase 1 preview (mock data)
    api/google/connect       — kicks off OAuth
    api/google/callback      — OAuth callback stub
  lib/
    env.ts                   — centralized env access
    google/                  — OAuth + review fetching
    mock/                    — fixture data for dev-without-Google
    supabase/                — client/server/middleware auth helpers
supabase/
  migrations/                — SQL schema
plan.md                      — full product + build plan
```

## Roadmap

- [x] Phase 0: `/demo` interactive prototype + landing
- [x] Scaffold, schema, mock-mode dashboard (Phase 1 preview)
- [ ] Anthropic reply drafting
- [ ] Twilio outbound + inbound webhook
- [ ] Google live review fetcher + reply posting
- [ ] 30-day backfill on connect
- [ ] Vercel Cron polling
- [ ] Weekly GBP posts (v1.1)

## What I'd do differently

See `plan.md` Section 6 — this section gets filled in after the first real pilot.
