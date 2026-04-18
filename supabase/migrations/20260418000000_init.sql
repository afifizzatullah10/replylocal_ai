-- ReplyLocal initial schema
-- Matches Section 4 of plan.md
-- Run with `supabase db push` or paste into Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ===============================================================
-- restaurants
-- ===============================================================
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete cascade,
  owner_email text not null,
  owner_phone text,
  restaurant_name text not null,
  cuisine text check (
    cuisine in (
      'indian', 'chinese', 'mediterranean', 'deli',
      'italian', 'mexican', 'thai', 'vietnamese',
      'korean', 'japanese', 'middle_eastern',
      'latin_american', 'american', 'other'
    )
  ) default 'other',
  google_location_id text,
  google_account_id text,
  google_refresh_token text,
  tone_preference text check (tone_preference in ('warm', 'formal', 'short')) default 'warm',
  context_notes text,
  phone_verified_at timestamptz,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists restaurants_owner_user_id_idx on public.restaurants(owner_user_id);
create index if not exists restaurants_google_location_id_idx on public.restaurants(google_location_id);

-- ===============================================================
-- reviews
-- ===============================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  google_review_id text unique,
  reviewer_name text,
  star_rating int check (star_rating between 1 and 5),
  review_text text,
  review_posted_at timestamptz,
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists reviews_restaurant_id_idx on public.reviews(restaurant_id);
create index if not exists reviews_review_posted_at_idx on public.reviews(review_posted_at desc);

-- ===============================================================
-- reply_drafts
-- ===============================================================
create table if not exists public.reply_drafts (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  draft_text text not null,
  status text not null check (
    status in ('pending', 'sent', 'approved', 'edited', 'skipped', 'posted', 'failed')
  ) default 'pending',
  sent_to_owner_at timestamptz,
  approved_at timestamptz,
  final_text text,
  posted_to_google_at timestamptz,
  error_message text,
  model_used text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reply_drafts_restaurant_id_idx on public.reply_drafts(restaurant_id);
create index if not exists reply_drafts_review_id_idx on public.reply_drafts(review_id);
create index if not exists reply_drafts_status_idx on public.reply_drafts(status);

-- ===============================================================
-- sms_logs
-- ===============================================================
create table if not exists public.sms_logs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  from_number text,
  to_number text,
  body text not null,
  twilio_sid text,
  related_draft_id uuid references public.reply_drafts(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists sms_logs_restaurant_id_idx on public.sms_logs(restaurant_id);
create index if not exists sms_logs_created_at_idx on public.sms_logs(created_at desc);

-- ===============================================================
-- updated_at trigger helpers
-- ===============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists restaurants_set_updated_at on public.restaurants;
create trigger restaurants_set_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

drop trigger if exists reply_drafts_set_updated_at on public.reply_drafts;
create trigger reply_drafts_set_updated_at
  before update on public.reply_drafts
  for each row execute function public.set_updated_at();

-- ===============================================================
-- Row Level Security
-- Owners can only see/modify their own restaurant data.
-- Service-role bypasses RLS and is used by cron + webhooks.
-- ===============================================================
alter table public.restaurants   enable row level security;
alter table public.reviews       enable row level security;
alter table public.reply_drafts  enable row level security;
alter table public.sms_logs      enable row level security;

-- restaurants
drop policy if exists "restaurants_owner_select" on public.restaurants;
create policy "restaurants_owner_select" on public.restaurants
  for select using (owner_user_id = auth.uid());

drop policy if exists "restaurants_owner_insert" on public.restaurants;
create policy "restaurants_owner_insert" on public.restaurants
  for insert with check (owner_user_id = auth.uid());

drop policy if exists "restaurants_owner_update" on public.restaurants;
create policy "restaurants_owner_update" on public.restaurants
  for update using (owner_user_id = auth.uid());

drop policy if exists "restaurants_owner_delete" on public.restaurants;
create policy "restaurants_owner_delete" on public.restaurants
  for delete using (owner_user_id = auth.uid());

-- reviews (read-only for owners; writes happen via service role)
drop policy if exists "reviews_owner_select" on public.reviews;
create policy "reviews_owner_select" on public.reviews
  for select using (
    restaurant_id in (select id from public.restaurants where owner_user_id = auth.uid())
  );

-- reply_drafts
drop policy if exists "reply_drafts_owner_select" on public.reply_drafts;
create policy "reply_drafts_owner_select" on public.reply_drafts
  for select using (
    restaurant_id in (select id from public.restaurants where owner_user_id = auth.uid())
  );

drop policy if exists "reply_drafts_owner_update" on public.reply_drafts;
create policy "reply_drafts_owner_update" on public.reply_drafts
  for update using (
    restaurant_id in (select id from public.restaurants where owner_user_id = auth.uid())
  );

-- sms_logs (read-only for owners)
drop policy if exists "sms_logs_owner_select" on public.sms_logs;
create policy "sms_logs_owner_select" on public.sms_logs
  for select using (
    restaurant_id in (select id from public.restaurants where owner_user_id = auth.uid())
  );
