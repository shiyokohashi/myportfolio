"use client";

import Image from "next/image";

import { MediaCover } from "@/components/MediaCover";
import { CARD_MAX_VW, CARD_WIDTH_PX } from "@/config/animation";
import type { PlaceholderCard } from "@/data/cards";
import {
  getVideoPoster,
  isVideoSrc,
  shouldUseUnoptimized,
} from "@/lib/media";
import { cn } from "@/lib/utils";

export type CarouselCardSlideProps = {
  card: PlaceholderCard;
  className?: string;
  /** When false, skip loading media (loop duplicates / deferred entrance). */
  loadMedia?: boolean;
  priority?: boolean;
};

function cardWidthStyle() {
  return {
    width: `min(${CARD_WIDTH_PX}px, ${CARD_MAX_VW}vw)`,
  } as const;
}

export { cardWidthStyle };

/** Flat media card — shared by strip and focused overlay. */
export function CarouselCardSlide({
  card,
  className,
  loadMedia = true,
  priority = false,
}: CarouselCardSlideProps) {
  const thumbnail = card.thumbnail;
  const isVideo = isVideoSrc(thumbnail);
  const objectFit =
    card.secret || card.thumbnailFit === "contain" ? "contain" : "cover";

  return (
    <div className={cn("carousel-card", className)}>
      <div
        className={cn(
          "carousel-card-media",
          card.secret && "bg-zinc-100",
        )}
      >
        {thumbnail && loadMedia && isVideo ? (
          <MediaCover
            src={thumbnail}
            poster={getVideoPoster(card.id)}
            sizes="(max-width: 640px) 72vw, 400px"
            priority={priority}
            lazy={!priority}
            objectFit={objectFit}
          />
        ) : thumbnail && loadMedia ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 640px) 72vw, 400px"
            unoptimized={shouldUseUnoptimized(thumbnail)}
            aria-hidden
            className={cn(
              objectFit === "contain" ? "object-contain" : "object-cover",
              card.secret && "p-3",
            )}
          />
        ) : thumbnail ? (
          <div className="h-full w-full bg-zinc-100" aria-hidden />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${card.color}55 0%, ${card.color}22 100%)`,
            }}
          />
        )}
      </div>

      <p className="carousel-card-title">{card.title}</p>
      <p className="carousel-card-subtitle">{card.subtitle}</p>
    </div>
  );
}

export type CarouselCardProps = {
  card: PlaceholderCard;
  /** Enables hover slow and click on the primary carousel copy. */
  interactive?: boolean;
  loadMedia?: boolean;
  priority?: boolean;
  onHoverStart?: () => void;
  onActivate?: (card: PlaceholderCard) => void;
  trailingGapPx?: number;
  className?: string;
};

/** Single carousel card in the scrolling strip. */
export function CarouselCard({
  card,
  interactive = true,
  loadMedia = true,
  priority = false,
  onHoverStart,
  onActivate,
  trailingGapPx = 0,
  className,
}: CarouselCardProps) {
  const style = {
    ...cardWidthStyle(),
    marginRight: trailingGapPx,
  };

  if (!interactive) {
    return (
      <article
        data-carousel-card=""
        aria-hidden
        className={cn("group shrink-0", className)}
        style={style}
      >
        <CarouselCardSlide card={card} loadMedia={false} />
      </article>
    );
  }

  return (
    <button
      type="button"
      data-carousel-card=""
      aria-label={`${card.title} — ${card.subtitle}`}
      onPointerEnter={() => onHoverStart?.()}
      onClick={() => onActivate?.(card)}
      className={cn(
        "group shrink-0 cursor-pointer border-0 bg-transparent p-0 text-left",
        className,
      )}
      style={style}
    >
      <CarouselCardSlide
        card={card}
        loadMedia={loadMedia}
        priority={priority}
        className="transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-18px_rgba(24,24,27,0.35)]"
      />
    </button>
  );
}
