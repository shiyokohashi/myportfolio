import type { PlaceholderCard } from "@/data/cards";

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash;
}

/** Stable gaps for server/client initial render. */
export function buildStableCardGaps(
  cards: PlaceholderCard[],
  minPx: number,
  maxPx: number,
): number[] {
  const range = Math.max(0, maxPx - minPx);

  return cards.map((card) => {
    if (range === 0) return minPx;

    const ratio = hashString(card.id) / 0xffffffff;
    return Math.round(minPx + ratio * range);
  });
}

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
