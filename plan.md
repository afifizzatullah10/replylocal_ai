# ReplyLocal (working name) — Project Plan

> **One-line pitch:** A done-for-you Google review reply and Google Business Profile posting tool for independent restaurants, approved by SMS so owners never have to open a dashboard.

> **North Star for this build:** Ship something a real restaurant owner uses within 2 weekends. Everything else is secondary.

---

## 1. Context & Goals

### Primary goal
Build a working MVP that (a) I can show 3-5 local restaurant owners to validate, and (b) functions as a portfolio piece for PM / BizOps / fintech-adjacent job applications.

### Secondary goal
If validation succeeds (3+ owners say they'd pay), convert it into a real $5-15K MRR business by the time I graduate in May 2026.

### What "success" looks like for the portfolio
- Deployed, publicly accessible app with a live demo URL
- 1-2 real restaurants using it (even unpaid) as case studies
- A concise README that tells the product story the way a PM would: problem → user → solution → metrics
- Clean code organization that a technical interviewer could skim in 5 minutes

### Explicit non-goals for v1
- No multi-tenant billing infrastructure
- No admin dashboard beyond a basic ops view
- No mobile app
- No analytics beyond what Google already provides
- No support for anything other than Google Business Profile (no Yelp, TripAdvisor, Facebook yet)

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

### Core loop (the MVP must nail this)
1. System detects new Google review on a connected Business Profile
2. AI drafts a reply in the owner's voice, appropriate to the review's sentiment
3. Owner receives the draft via SMS (primary) or email (fallback)
4. Owner replies "OK" to approve, "EDIT: [new text]" to change, or ignores it to skip
5. System posts the approved reply to Google Business Profile
6. Owner sees a weekly summary: X reviews answered, average response time, ranking trend

### v1 features (must-have for MVP)
- Google OAuth connection to Google Business Profile
- Polling on new reviews (Google doesn't offer true review webhooks)
- LLM-generated reply drafts with restaurant-specific context (cuisine, vibe, owner's name, signature dishes)
- SMS approval flow via Twilio
- Automatic posting of approved replies back to Google
- Simple admin page listing pending replies, approved replies, and connection status

### v1.1 features (nice-to-have, build only if v1 works)
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

### Stack (optimized for Cursor + speed of shipping)
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

### Data model (Supabase tables)
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

### Key flows

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

### Prompt strategy for reply generation
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

## 5. Build Plan — Week by Week

### Weekend 1 (8-12 focused hours) — Skeleton + Google connection
- [ ] **Apply for Google Business Profile API access on Day 1 — this is the critical path item; approval can take weeks**
- [ ] Scaffold Next.js app, deploy to Vercel the same day (empty app with a landing page)
- [ ] Set up Supabase project, create schema above, enable RLS
- [ ] Implement Google OAuth flow for Business Profile scopes
- [ ] Build "connect your restaurant" onboarding screen
- [ ] Hardcode a test call to fetch last 10 reviews from a connected location and display them in a simple list
- [ ] Build a mock-data mode so development continues if API access is still pending
- [ ] **Acceptance test:** I can sign in with Google, connect a test GBP, and see my reviews in the app (or mock reviews if API access isn't granted yet)
- [ ] Contingency: If Google API access is pending, build a "Manual Mode" toggle. Use SerpApi to fetch reviews and allow me to manually copy-paste the approved drafts back to Google.

### Weekend 2 — AI drafts + SMS loop
- [ ] Integrate Anthropic API, build the reply-drafting function with the prompt above
- [ ] For each new review without a draft, generate and save a draft
- [ ] Integrate Twilio, set up phone verification in onboarding
- [ ] Build outbound SMS: for each pending draft, send to owner
- [ ] Build inbound SMS webhook: parse OK / EDIT / SKIP, update draft status
- [ ] If approved, post reply to Google Business Profile via API
- [ ] **Acceptance test:** End-to-end — a review appears, I get an SMS, I reply OK, the reply appears on Google within 60 seconds

### Weekend 3 — Polish + first real user
- [ ] Build admin page (list of pending drafts, status indicators, manual retry button)
- [ ] Add initial 30-day backfill on connect (fetch + draft replies for old unanswered reviews)
- [ ] Error handling: Google token expiry, Twilio failures, Claude API errors
- [ ] Set up Vercel Cron for the 30-min polling job
- [ ] Write a clean README (see Section 8)
- [ ] Walk into the deli, do the onboarding live with the owner, get them using it
- [ ] **Acceptance test:** One real restaurant uses the tool for a full week without me fixing anything

### Weekend 4 (optional, only if v1 is stable) — Weekly GBP posts
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

### For PM interviews specifically, prepare to answer
- "Why this problem?" → lived experience + network access + measurable ROI
- "How did you prioritize scope?" → point to the v1.1 / out-of-scope lists in this plan
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
| Google Business Profile API approval takes weeks | High | Apply Day 1; build with mock mode until access arrives |
| Twilio A2P 10DLC business SMS registration is slow in US | High | Start with personal number for beta; register a campaign before scaling past 5 users |
| LLM costs spike with volume | Low at MVP scale | Cap at 500 replies/month/restaurant; use Claude Haiku for drafts, Sonnet only for negative reviews |
| Owners don't actually use SMS approval | Medium | The deli owner is user #1 — if he doesn't use it, redesign before building more |
| This eats time from the job search | High | Hard cap of 30 hrs over 3 weekends; if not validated by end of Weekend 3, archive it as a portfolio piece only |
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

- **No free tier.** If someone won't pay $49/month, they're not a customer; they're a distraction.
- **SMS-first, not email, not app.** The user persona demands it. Do not build a mobile app.
- **Google only.** Yelp and Facebook are feature creep.
- **No AI-generated reviews, ever.** Non-negotiable.
- **Culture-neutral product, relationship-driven GTM.** The first 10 customers come from my personal network across several owner communities; the product itself treats every independent restaurant the same.
- **Portfolio piece first, business second.** If this becomes a real business, great. If it stays a portfolio piece that helps land a PM role, also great.

---

## 10. Cursor-Specific Instructions (keep this section for when building)

When prompting Cursor:
- Reference this plan.md in context for every non-trivial change
- Ask Cursor to generate full files rather than diffs when scaffolding
- For the Supabase schema, paste the SQL from Section 4 directly into Cursor's context
- For API integrations (Google Business Profile, Twilio), paste the relevant API docs into context before asking for implementation
- Use Cursor's "Ask" mode for architecture questions, "Agent" mode for file generation
- Keep each prompt scoped to one file or one feature — don't ask for the whole app at once

Suggested first prompt to Cursor after reading this plan:
> "Scaffold a Next.js 15 App Router project with Supabase auth, Tailwind, and shadcn/ui. Set up the database schema from Section 4 of plan.md as a Supabase migration. Create a landing page, a /dashboard route behind auth, and a /api/google/callback route stub. Deploy config for Vercel. Don't implement business logic yet — just the skeleton."
