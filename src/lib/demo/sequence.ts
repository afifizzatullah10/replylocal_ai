/**
 * Phase 0 validation — static conversation turns for `/demo`.
 * Bundled client-side only; no API calls.
 */

export type DemoSmsTurn = {
  id: string;
  reviewerName: string | null;
  starRating: number;
  reviewPreview: string;
  draftReply: string;
};

/** Ordered queue: each turn = one inbound “text” with a draft reply. */
export const DEMO_SMS_SEQUENCE: DemoSmsTurn[] = [
  {
    id: "demo-1",
    reviewerName: "Sarah K.",
    starRating: 5,
    reviewPreview:
      "Best brisket sandwich in Pittsburgh, hands down. Sami remembered my order…",
    draftReply:
      "Sarah, you just made our day. Hearing that about the brisket means a lot — see you next time, friend.",
  },
  {
    id: "demo-2",
    reviewerName: "David L.",
    starRating: 2,
    reviewPreview:
      "Waited 45 minutes for a sandwich… no one acknowledged us.",
    draftReply:
      "David, 45 minutes is not the experience we want you to have. I'd love to make this right — please reach out at the number on our profile and I'll personally take care of your next visit. Thank you for the honest feedback.",
  },
  {
    id: "demo-3",
    reviewerName: "Priya R.",
    starRating: 4,
    reviewPreview:
      "Great hummus plate… seating was a bit loud. Will be back!",
    draftReply:
      "Priya, glad you enjoyed the hummus and house pita — we'll keep working on seating comfort. We'd love to see you again.",
  },
];
