# ReplyLocal (working name) — Project Plan

> **One-line pitch:** A done-for-you Google review reply and Google Business Profile posting tool for independent restaurants, approved by SMS so owners never have to open a dashboard.

> **North Star (two phases):**  
> **Phase 0 — Validation:** Ship a **frontend-only clickable prototype** and show it to 3–5 independent restaurant owners. Goal: learn whether they would use SMS approval *before* building backend (Google, Twilio, DB).  
> **Phase 1 — Product MVP:** Only after validation signals demand — working integrations (Supabase, GBP API, Claude, Twilio, cron).

---

## 1. Context & Goals

### Primary goal (Phase 0 — now)
1. **Validate demand** — Show owners a realistic demo (landing + simulated phone/SMS approval flow + sample reviews/drafts). Ask whether they would use it and at what price band. **No backend required** for this phase.
2. **Portfolio** — A deployed URL + screen recording or GIF of the demo is enough for applications while Phase 1 is deferred.

### Primary goal (Phase 1 — after validation)
Build a working MVP that (a) real restaurant owners can connect to Google and use via SMS, and (b) functions as a deeper portfolio / business story for PM / BizOps / fintech-adjacent roles.

### Secondary goal
If validation succeeds (3+ owners say they'd pay), convert it into a real $5-15K MRR business by the time I graduate in May 2026.

### What "success" looks like for the portfolio
- Deployed, publicly accessible app with a live demo URL
- 1-2 real restaurants using it (even unpaid) as case studies
- A concise README that tells the product story the way a PM would: problem → user → solution → metrics
- Clean code organization that a technical interviewer could skim in 5 minutes

### Explicit non-goals for Phase 0 (validation prototype)
- **No backend:** No Supabase writes, no Google OAuth in production demo, no Twilio webhooks, no API keys required for someone to click through the demo.
- **No “fake product” claims:** The demo is clearly a **prototype / simulation** (sample restaurant, sample reviews). Do not imply live Google connection until Phase 1.
- **No scope creep:** One polished path — landing → interactive demo → optional reflection — not a full dashboard build.

### Explicit non-goals for Phase 1 (product MVP / old “v1”)
- No multi-tenant billing infrastructure
- No admin dashboard beyond a basic ops view
- No mobile app
- No analytics beyond what Google already provides
- No support for anything other than Google Business Profile (no Yelp, TripAdvisor, Facebook yet)

### Success criteria for Phase 0 (validation)
- [ ] **3–5 owner conversations** with the prototype (in person or shared link).
- [ ] **Artifact:** Record a short walkthrough (or GIF) of the demo for portfolio and follow-ups.
- [ ] **Decision:** After conversations, written note: “build Phase 1” vs “portfolio-only” vs “pause.” **Do not start Supabase/Google/Twilio until this decision.**

---

## 2. The User & The Problem

### Primary user persona: "The independent restaurant owner"
- Owns 1-2 independent restaurants in Pittsburgh — cuisines range across South Asian, East Asian, Middle Eastern, Mediterranean, Latin American, American delis, etc.
- Age 35-55, often first-generation immigrant, runs the floor daily
- Phone is their primary device; email is checked rarely
- Has a Google Business Profile but hasn't logged in for months
- Has 40-200 Google reviews, maybe 20% answered, mostly only the 5-star ones
- Vaguely knows "Google reviews matter for showing up on Maps" but doesn't have time
- Willing to spend $50-100/month on things that clearly bring in customers
- Trusts word-of-mouth from other owners far more than ads or cold outreach

### Go-to-market wedge (not the brand)
My distribution advantage is being plugged into several tight-knit local owner communities in Pittsburgh — I work part-time at a deli owned by one owner, I'm in a local professional network, and I have warm intros to Indian restaurant owners through a friend. The product is culture-neutral; the *first 10 customers* come from these relationships because trust travels fast inside them. The brand, UI copy, and marketing stay neutral so the same product sells to a Chinese-owned Sichuan place, a family Italian trattoria, or any independent later.

### The jobs-to-be-done
1. **"Help me not look bad when customers complain online"** — respond to negative reviews quickly and professionally
2. **"Help me look active on Google"** — consistent replies and weekly posts improve Maps ranking
3. **"Do it in a way I can approve in 10 seconds on my phone"** — no desktop dashboards, no complex flows

### What the user explicitly doesn't want
- To learn new software
- To read long emails
- To give up control over what gets posted — tone and voice need to match their restaurant's identity

---

## 3. Product Scope

### Phase 0 demo (what owners see — must nail this first)
1. Clear **problem** on the landing page (reviews pile up; owners live on the phone).
2. **Interactive prototype** — simulated text thread: new review → AI-written draft arrives as a message → owner taps **OK / EDIT / SKIP** (client-side only).
3. **Trust** — Copy explains drafts match their tone later via onboarding; prototype uses fixed sample copy.
4. **Closing the loop** — End screen asks whether they’d use something like this (conversation starter for you; optional on-screen buttons are fine but **not** persisted without backend).

### Core loop (Phase 1 — the real MVP must nail this)
1. System detects new Google review on a connected Business Profile
2. AI drafts a reply in the owner's voice, appropriate to the review's sentiment
3. Owner receives the draft via SMS (primary) or email (fallback)
4. Owner replies "OK" to approve, "EDIT: [new text]" to change, or ignores it to skip
5. System posts the approved reply to Google Business Profile
6. Owner sees a weekly summary: X reviews answered, average response time, ranking trend

### Phase 1 features (must-have for MVP — build only after validation)
- Google OAuth connection to Google Business Profile
- Polling on new reviews (Google doesn't offer true review webhooks)
- LLM-generated reply drafts with restaurant-specific context (cuisine, vibe, owner's name, signature dishes)
- SMS approval flow via Twilio
- Automatic posting of approved replies back to Google
- Simple admin page listing pending replies, approved replies, and connection status

### Phase 1.1 features (nice-to-have, build only if Phase 1 works)
- Weekly Google Business Profile posts (AI-drafted from a content calendar: specials, hours, holidays the restaurant cares about)
- Tone customization ("formal" vs "warm" vs "short and direct")
- Bulk-approval for backlogs of old unanswered reviews
- Optional per-restaurant phrase/language preferences (e.g. mirror a reviewer's greeting back in their language if they used it first)

### Out of scope entirely
- Review *generation* or fake reviews (against Google ToS and ethically wrong — do not build)
- Responding to reviews on platforms other than Google
- SEO audits, keyword tools, competitor analysis
- Social media beyond Google Business Profile
- Multi-location enterprise features

---

## 4. Technical Architecture

### Phase 0 stack (validation — current)
- **Framework:** Next.js (App Router) — static/SSR pages + **client-side state only** for the demo.
- **Styling:** Tailwind + shadcn/ui — one polished route (e.g. `/demo`) plus landing.
- **Data:** Fixtures in-repo (sample restaurant, reviews, draft replies). No database.
- **Hosting:** Vercel (free tier) — deploy the prototype URL for owners and portfolio.

### Phase 1 stack (product MVP — after validation)
- **Framework:** Next.js 15 (App Router) — Cursor has deep training data on this
- **Database + Auth:** Supabase — Postgres, auth, row-level security, easy schema sharing with Cursor
- **Hosting:** Vercel — one-click deploy from GitHub
- **LLM:** Anthropic Claude API (Haiku 4.5 for initial drafts to control costs; Sonnet 4.5 for negative reviews where quality matters more)
- **SMS:** Twilio (Programmable Messaging)
- **Google integration:** Google Business Profile API
- **Background jobs:** Vercel Cron for review polling
- **Styling:** Tailwind + shadcn/ui

Note on Twilio: For v1, we are using an unverified/testing number to send texts only to the verified owner's phone number. Skip A2P 10DLC compliance logic in the codebase for now.

### Why this stack specifically
- Every piece has good docs, is in Cursor's training data, and doesn't require DevOps
- Supabase handles auth + DB + storage in one, so there's no glue code to write
- Next.js API routes cover both the Google OAuth callback and the Twilio webhook
- All services have generous free tiers — estimated infra cost for MVP is $0-20/month

### Data model (Supabase tables — Phase 1 only)
```
restaurants
  id (uuid, pk)
  owner_email (text)
  owner_phone (text)                  -- for SMS approvals
  restaurant_name (text)
  cuisine (text)                      -- 'indian' | 'chinese' | 'mediterranean' | 'deli' | 'italian' | 'other'
  google_location_id (text)           -- from GBP API
  google_refresh_token (text, encrypted)
  tone_preference (text)              -- 'warm' | 'formal' | 'short'
  context_notes (text)                -- freeform: signature dishes, vibe, owner name, etc.
  created_at (timestamptz)

reviews
  id (uuid, pk)
  restaurant_id (fk)
  google_review_id (text, unique)
  reviewer_name (text)
  star_rating (int)
  review_text (text)
  review_posted_at (timestamptz)
  fetched_at (timestamptz)

reply_drafts
  id (uuid, pk)
  review_id (fk)
  draft_text (text)
  status (text)                       -- 'pending' | 'approved' | 'edited' | 'skipped' | 'posted'
  sent_to_owner_at (timestamptz)
  approved_at (timestamptz)
  final_text (text)                   -- what actually got posted
  posted_to_google_at (timestamptz)

sms_logs
  id (uuid, pk)
  restaurant_id (fk)
  direction (text)                    -- 'outbound' | 'inbound'
  body (text)
  created_at (timestamptz)
```

### Key flows (Phase 1)

**Onboarding flow**
1. Owner (or I, doing it for them) visits the app
2. Signs in with Google, grants Business Profile scopes
3. Selects which location(s) to connect
4. Enters phone number, confirms via SMS code
5. Answers 3 questions: cuisine, tone preference, "anything a reply should never say?"
6. System does an initial fetch of last 30 days of reviews, drafts replies, and sends them as a batch for approval

**New review flow**
1. Cron job runs every 30 min, calls Google Business Profile API per connected restaurant
2. New reviews detected → inserted into `reviews` table
3. For each new review, call Claude with the context + review → save draft to `reply_drafts`
4. Send SMS to owner with: "New 4★ review from Sarah. Draft reply: [text]. Reply OK to post, EDIT to revise, SKIP to ignore."
5. Twilio webhook hits `/api/sms/inbound`
6. Parse intent (OK / EDIT: ... / SKIP)
7. If approved, post to Google Business Profile API
8. Log result, update draft status

### Prompt strategy for reply generation (Phase 1 — Claude)
The system prompt needs to be carefully engineered. Key constraints:
- Never apologize for things the business didn't do
- Thank the reviewer by first name if available
- For 1-2★ reviews: acknowledge the specific issue, offer a way to make it right offline (don't debate publicly)
- For 4-5★ reviews: warm but not effusive, mention a specific detail from the review
- For 3★: thank them, acknowledge feedback briefly, invite them back
- Max 50 words for positive, max 75 for negative
- Match the restaurant's voice using `context_notes` and `cuisine`
- Cultural/linguistic phrases only mirror what the reviewer used (don't impose them)

Example of the kind of prompt to iterate on:
```
You are drafting a Google review reply on behalf of {restaurant_name},
a {cuisine} restaurant in Pittsburgh.
Restaurant context: {context_notes}
Desired tone: {tone_preference}

A customer left a {star_rating}-star review:
"{review_text}"

Write a {word_limit}-word reply that:
- Thanks the reviewer by name ({reviewer_name}) if the name is given
- References a specific detail from their review
- Sounds like a busy restaurant owner wrote it personally, not a corporate chain
- Never promises compensation or specific actions the owner hasn't agreed to
- Ends without a signature (Google shows the business name automatically)

Return ONLY the reply text, no quotes or preamble.
```

---

## 5. Build Plan — Phased

### Phase 0 — Validation prototype (frontend only) — **current focus**
- [x] Landing page sells the problem + SMS-first promise (already started; keep iterating copy).
- [x] **`/demo` route:** Interactive simulation — phone-style UI, sample reviews + drafts from fixtures, OK / EDIT / SKIP with **client-side state only** (no API calls).
- [x] Label the demo honestly: **“Prototype — sample data.”**
- [ ] Deploy to Vercel; grab a shareable URL for owner conversations.
- [ ] Record a **60–90s screen recording or GIF** for portfolio + async sharing.
- [ ] **Acceptance test:** An owner can complete the demo on their phone in under 3 minutes without signing in or installing anything.

### Phase 1 — Weekend A — Skeleton + Google connection *(after Phase 0 go decision)*
- [ ] **Apply for Google Business Profile API access — critical path; approval can take weeks** (can parallel-track once you commit to Phase 1).
- [ ] Supabase project, schema (Section 4), RLS
- [ ] Google OAuth for Business Profile scopes
- [ ] Onboarding screen + mock-data mode until API access is live
- [ ] **Acceptance test:** Sign in, connect test GBP (or mock mode), see reviews

### Phase 1 — Weekend B — AI drafts + SMS loop
- [ ] Anthropic integration + drafting function (prompt in Section 4)
- [ ] Twilio outbound + inbound webhook (OK / EDIT / SKIP)
- [ ] Post approved reply via GBP API
- [ ] **Acceptance test:** Review → SMS → OK → reply on Google within ~60 seconds

### Phase 1 — Weekend C — Polish + first real user
- [ ] Admin-style page: pending drafts, statuses, retry
- [ ] 30-day backfill on connect
- [ ] Error handling + Vercel Cron (30-min poll)
- [ ] README update for Phase 1 story
- [ ] **Acceptance test:** One restaurant uses it for a week without emergency fixes

### Phase 1 — Optional weekend — Weekly GBP posts
- [ ] Add `scheduled_posts` table
- [ ] Build Claude prompt for weekly post drafts (specials, hours, holidays)
- [ ] Send a weekly SMS with the drafted post for approval
- [ ] Post approved content to GBP via API

---

## 6. Portfolio Framing (This is the Part That Helps the Job Search)

When this goes on the portfolio site, it needs to read like a PM case study, not a hobby project.

### Portfolio page sections
1. **Problem** — "Independent restaurant owners lose Google Maps ranking because they can't keep up with reviews. I saw this firsthand at a Pittsburgh deli where I work part-time during my MBA."
2. **Research** — "I talked to 8 local restaurant owners across cuisines in my network. 6 out of 8 had over 30 unanswered reviews. Average time to respond: 14 days. The owners I spoke to consistently said two things: (1) they know it matters, (2) they need it to happen on their phone in 10 seconds."
3. **Solution** — Short video or GIF of the SMS approval flow (this is the magic moment, lead with it)
4. **What I built** — One-sentence tech stack, one-sentence architecture, link to GitHub
5. **Results** — Real numbers: "X reviews answered across Y restaurants, average response time dropped from 14 days to Z hours." Only include what's actually true.
6. **What I'd do differently** — Honest reflection. Shows maturity.

**Phase 0 note:** Until Phase 1 ships, swap “results” for **validation learnings** (quotes or themes from owners, willingness to pay signals) — still credible for PM interviews.

### For PM interviews specifically, prepare to answer
- "Why this problem?" → lived experience + network access + measurable ROI
- "How did you prioritize scope?" → Phase 0 prototype first → Phase 1 only after validation; point to Phase 1.1 / out-of-scope lists for later
- "What's the biggest risk?" → Google API policy changes, competition from Birdeye/Podium moving downmarket, LLM costs scaling with volume
- "How would you grow this?" → land-and-expand geographically (Pittsburgh independents → other mid-size US metros), pricing tiers by review volume, agency/white-label for consultants

### For BizOps interviews specifically, prepare
- A simple unit economics model (LTV, CAC, gross margin per customer)
- A TAM/SAM/SOM breakdown: ~650K independent US restaurants × ~40% with active GBPs × $79/month = meaningful market
- A churn analysis framework — what events would cause a restaurant to cancel?

---

## 7. Risk Register (be honest about these)

| Risk | Likelihood | Mitigation |
|---|---|---|
| Building backend before validating | High | **Phase 0 rule:** ship `/demo` + owner conversations **before** Supabase/Google/Twilio |
| Google Business Profile API approval takes weeks | High | Defer API application until Phase 1 go decision; Phase 0 needs no GBP access |
| Twilio A2P 10DLC business SMS registration is slow in US | High | Start with personal number for beta; register a campaign before scaling past 5 users |
| LLM costs spike with volume | Low at MVP scale | Cap at 500 replies/month/restaurant; use Claude Haiku for drafts, Sonnet only for negative reviews |
| Owners don't actually use SMS approval | Medium | The deli owner is user #1 — if he doesn't use it, redesign before building more |
| This eats time from the job search | High | Phase 0: hard cap (~1–2 weekends prototype + conversations). If validation is weak, stop at portfolio GIF + archive Phase 1 |
| Visa / business ownership questions | Unknown | Portfolio-first framing avoids this. If it becomes a business, talk to an immigration attorney before taking real payments |

---

## 8. The README.md (for the repo itself)

The README should open with:
```
# ReplyLocal

Automated Google review replies for independent restaurants,
approved by SMS so owners can manage their online reputation
without ever opening a dashboard.

Built in 3 weekends as an MBA project, piloted with
[N] independent restaurants in Pittsburgh.

[Screenshot/GIF of SMS flow]

[Live demo] [Case study]
```

Then: Problem, How it works (one diagram), Stack, Local setup, Roadmap, What I learned.

Keep it under 200 lines. Recruiters skim.

---

## 9. Decisions I'm Making Upfront (so I don't re-debate them)

- **Validate before backend.** Phase 0 is frontend-only demos + conversations. Phase 1 starts only after a deliberate go/no-go.
- **No free tier (when charging).** If someone won't pay $49/month at launch, they're not a customer; they're a distraction. *(Unpaid pilots during validation are fine — they're research.)*
- **SMS-first, not email, not app.** The user persona demands it. Do not build a mobile app.
- **Google only.** Yelp and Facebook are feature creep.
- **No AI-generated reviews, ever.** Non-negotiable.
- **Culture-neutral product, relationship-driven GTM.** The first 10 customers come from my personal network across several owner communities; the product itself treats every independent restaurant the same.
- **Portfolio piece first, business second.** If this becomes a real business, great. If it stays a portfolio piece that helps land a PM role, also great.

---

## 10. Cursor-Specific Instructions (keep this section for when building)

When prompting Cursor:
- Reference this plan.md in context for every non-trivial change.
- **Phase 0:** Prioritize `/demo` + landing polish; avoid new backend routes unless Phase 1 has started.
- **Phase 1:** For Supabase schema, paste the SQL from Section 4 into context. For Google/Twilio, paste API docs before implementation.
- Use Cursor's "Ask" mode for architecture questions, "Agent" mode for file generation.
- Keep each prompt scoped to one file or one feature.

Suggested prompt for **Phase 0:**
> "Using plan.md Phase 0, build `/demo`: phone-style UI, fixture reviews/drafts only, OK / EDIT / SKIP with client-side state. Label clearly as a prototype. Wire the landing page CTA to `/demo`. No API calls."

Suggested prompt for **Phase 1:**
> "Scaffold Supabase migration from Section 4, auth middleware, `/api/google/callback`, and swap fixture review fetch for Google API when mock mode is off."
