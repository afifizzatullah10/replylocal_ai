/**
 * Static mock for an “AI reads all reviews” owner briefing.
 * Replace with a real LLM call when backend support lands.
 */

export type OwnerAiInsightTheme = {
  title: string;
  detail: string;
};

export type OwnerAiSuggestion = {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
};

export type MockOwnerAiSummary = {
  /** One-line headline for the card */
  headline: string;
  /** Short narrative across all reviews */
  overview: string;
  themes: OwnerAiInsightTheme[];
  suggestions: OwnerAiSuggestion[];
};

export function getMockOwnerAiSummary(): MockOwnerAiSummary {
  return {
    headline: "What guests are telling you — at a glance",
    overview:
      "Overall sentiment is strong on food and personal touch: brisket and hummus come up repeatedly, and guests appreciate consistency and Sami’s presence. The main risks are operational — especially lunch rush waits and clarity at the register — plus a few value and ambiance notes that are fixable without changing your concept.",
    themes: [
      {
        title: "Signature dishes land",
        detail:
          "Brisket sandwich and hummus plate are clear strengths; several reviews tie quality to repeat visits.",
      },
      {
        title: "Hospitality shows up in reviews",
        detail:
          "Guests mention being remembered and a warm, family-run feel — lean into that in replies and on-premise touches.",
      },
      {
        title: "Speed and acknowledgment under pressure",
        detail:
          "One detailed complaint cites a long Tuesday lunch wait and feeling unseen — worth treating as a process signal, not a one-off.",
      },
      {
        title: "Trust at checkout",
        detail:
          "A negative review calls out an uncommunicated add-on charge. Even when innocent, that erodes trust fast.",
      },
      {
        title: "Ambiance and value",
        detail:
          "Noise level and portion-for-price surface occasionally; they’re softer than wait-time issues but show up in 3–4★ reviews.",
      },
    ],
    suggestions: [
      {
        title: "Set a Tuesday lunch focus",
        detail:
          "Add a quick staffing or production check for midweek lunch (line-busting script, prep list, or a visible “thanks for waiting” acknowledgment). Pair with a short reply template that owns delays without sounding defensive.",
        priority: "high",
      },
      {
        title: "Make extras explicit before charging",
        detail:
          "Train the counter to confirm paid add-ons out loud and on the ticket display. Post a tiny menu note if pricing for extras isn’t obvious.",
        priority: "high",
      },
      {
        title: "Soften peak-hour noise",
        detail:
          "Low-cost tweaks (rubber feet on chairs, a rug, music level) can quiet the dining pocket guests called out — good for 4★ reviews bumping to 5.",
        priority: "medium",
      },
      {
        title: "Clarify value on portions",
        detail:
          "If portions are fixed, say so on the menu; if upgrades exist, bundle a “full meal” option so price expectations match what guests receive.",
        priority: "medium",
      },
      {
        title: "Highlight heroes in marketing",
        detail:
          "Promote brisket and hummus as anchors — guests already use that language; mirroring it in signage and posts reinforces why to choose you.",
        priority: "low",
      },
    ],
  };
}
