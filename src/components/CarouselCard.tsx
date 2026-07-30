"use client";

import Image from "next/image";

import { CARD_MAX_VW, CARD_WIDTH_PX } from "@/config/animation";
import type { PlaceholderCard } from "@/data/cards";
import { getCarouselDisplaySrc, shouldUseUnoptimized } from "@/lib/media";
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

/** Slide-mount card visuals — shared by strip and focused overlay. */
export function CarouselCardSlide({
  card,
  className,
  loadMedia = true,
  priority = false,
}: CarouselCardSlideProps) {
  const displaySrc = getCarouselDisplaySrc(card.thumbnail, card.id);

  return (
    <div className={cn("carousel-slide-mount", className)}>
      <p className="carousel-slide-mount-title">{card.title}</p>

      <div
        className={cn(
          "carousel-slide-mount-aperture",
          card.secret && "bg-[#f3efe6]",
        )}
      >
        {displaySrc && loadMedia ? (
          <div className="relative h-full w-full">
            <Image
              src={displaySrc}
              alt=""
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes="(max-width: 640px) 72vw, 400px"
              unoptimized={shouldUseUnoptimized(displaySrc)}
              aria-hidden
              className={cn(
                card.secret ? "object-contain p-1" : "object-cover",
              )}
            />
          </div>
        ) : card.thumbnail ? (
          <div className="h-full w-full bg-[#f3efe6]" aria-hidden />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${card.color}55 0%, ${card.color}22 100%)`,
            }}
          />
        )}
        <div aria-hidden className="carousel-slide-multiply" />
        <div aria-hidden className="carousel-slide-overlay" />
      </div>

      <p className="carousel-slide-mount-subtitle">{card.subtitle}</p>
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
        <CarouselCardSlide
          card={card}
          loadMedia={false}
          className="transition-[transform,box-shadow] duration-200"
        />
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
        "group shrink-0 cursor-pointer border-0 bg-transparent p-0 text-left transition-transform duration-200",
        "hover:-translate-y-1",
        className,
      )}
      style={style}
    >
      <CarouselCardSlide
        card={card}
        loadMedia={loadMedia}
        priority={priority}
        className="transition-[transform,box-shadow] duration-200 group-hover:shadow-[0_6px_24px_rgb(42_34_28/0.14)]"
      />
    </button>
  );
}
