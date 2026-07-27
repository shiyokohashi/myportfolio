import type { PlaceholderCard } from "@/data/cards";

/** Fresh random gaps each call — used when a card set re-enters the carousel. */
export function buildRandomCardGaps(
  cards: PlaceholderCard[],
  minPx: number,
  maxPx: number,
): number[] {
  return cards.map(
    () => Math.round(minPx + Math.random() * (maxPx - minPx)),
  );
}
