/**
 * Minimal, hand-written Supabase types that mirror the schema in
 * supabase/migrations/20260418000000_init.sql. Replace with generated
 * types (`supabase gen types typescript`) once a project is linked.
 */

export type Cuisine =
  | "indian"
  | "chinese"
  | "mediterranean"
  | "deli"
  | "italian"
  | "mexican"
  | "thai"
  | "vietnamese"
  | "korean"
  | "japanese"
  | "middle_eastern"
  | "latin_american"
  | "american"
  | "other";

export type TonePreference = "warm" | "formal" | "short";

export type DraftStatus =
  | "pending"
  | "sent"
  | "approved"
  | "edited"
  | "skipped"
  | "posted"
  | "failed";

export interface Restaurant {
  id: string;
  owner_user_id: string | null;
  owner_email: string;
  owner_phone: string | null;
  restaurant_name: string;
  cuisine: Cuisine;
  google_location_id: string | null;
  google_account_id: string | null;
  google_refresh_token: string | null;
  tone_preference: TonePreference;
  context_notes: string | null;
  phone_verified_at: string | null;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  google_review_id: string | null;
  reviewer_name: string | null;
  star_rating: number;
  review_text: string | null;
  review_posted_at: string | null;
  fetched_at: string;
  created_at: string;
}

export interface ReplyDraft {
  id: string;
  review_id: string;
  restaurant_id: string;
  draft_text: string;
  status: DraftStatus;
  sent_to_owner_at: string | null;
  approved_at: string | null;
  final_text: string | null;
  posted_to_google_at: string | null;
  error_message: string | null;
  model_used: string | null;
  created_at: string;
  updated_at: string;
}

export interface SmsLog {
  id: string;
  restaurant_id: string | null;
  direction: "outbound" | "inbound";
  from_number: string | null;
  to_number: string | null;
  body: string;
  twilio_sid: string | null;
  related_draft_id: string | null;
  created_at: string;
}
