import { getSelectedWorksGroups } from "@/data/selected-works";
import type { SelectedWorksItem } from "@/data/selected-works";
import { SECRET_FRAME } from "@/lib/secretFrame";
import { shuffleArray } from "@/lib/utils";

export type PlaceholderCard = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  href: string;
  thumbnail?: string;
  featured?: boolean;
  /** Non-navigating easter-egg card (e.g. Frame 36). */
  secret?: boolean;
};

/** Hidden wireframe — injected into carousel at min/max speed. */
export const FRAME_36_CARD: PlaceholderCard = {
  id: "frame-36",
  title: SECRET_FRAME.title,
  subtitle: SECRET_FRAME.subtitle,
  color: "#433f3a",
  href: "",
  thumbnail: SECRET_FRAME.imageSrc,
  secret: true,
};

function toCarouselCard(
  basePath: string,
  work: SelectedWorksItem,
): PlaceholderCard {
  return {
    id: `${basePath}-${work.slug}`,
    title: work.title,
    subtitle: work.summary,
    color: work.color ?? "#6366f1",
    href: `${basePath}/${work.slug}`,
    thumbnail: work.thumbnail,
    featured: work.layout === "featured",
  };
}

/** Selected works for the home carousel — featured pieces first, then the rest. */
export function buildCarouselDeck(): PlaceholderCard[] {
  const featured: PlaceholderCard[] = [];
  const standard: PlaceholderCard[] = [];

  for (const group of getSelectedWorksGroups()) {
    for (const work of group.items) {
      const card = toCarouselCard(group.href, work);
      if (work.layout === "featured") featured.push(card);
      else standard.push(card);
    }
  }

  return [...featured, ...standard];
}

/** Featured cards stay at the front; the rest shuffle on each page load. */
export function getShuffledCarouselCards(): PlaceholderCard[] {
  const deck = buildCarouselDeck();
  const featured = deck.filter((card) => card.featured);
  const standard = shuffleArray(deck.filter((card) => !card.featured));
  return [...featured, ...standard];
}

/** @deprecated Use getShuffledCarouselCards() — kept for tests and prop typing. */
export const PLACEHOLDER_CARDS: PlaceholderCard[] = buildCarouselDeck();
