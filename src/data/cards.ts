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
  /** Prefer contain when on-image text must stay fully visible. */
  thumbnailFit?: "cover" | "contain";
  thumbnailCrop?: boolean;
  videoCropScale?: number;
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
    thumbnailFit: work.thumbnailFit,
    thumbnailCrop: work.thumbnailCrop,
    videoCropScale: work.videoCropScale,
  };
}

/** Selected works for the home carousel — category order before shuffling. */
export function buildCarouselDeck(): PlaceholderCard[] {
  const deck: PlaceholderCard[] = [];

  for (const group of getSelectedWorksGroups()) {
    for (const work of group.items) {
      deck.push(toCarouselCard(group.href, work));
    }
  }

  return deck;
}

/** Fully randomized card order — call on the client after mount. */
export function getShuffledCarouselCards(): PlaceholderCard[] {
  return shuffleArray(buildCarouselDeck());
}

/** @deprecated Use getShuffledCarouselCards() — kept for tests and prop typing. */
export const PLACEHOLDER_CARDS: PlaceholderCard[] = buildCarouselDeck();
