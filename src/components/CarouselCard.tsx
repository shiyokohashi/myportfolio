"use client";

import Image from "next/image";

import { CARD_MAX_VW, CARD_WIDTH_PX } from "@/config/animation";
import type { PlaceholderCard } from "@/data/cards";
import { cn } from "@/lib/utils";

export type CarouselCardSlideProps = {
  card: PlaceholderCard;
  className?: string;
};

/** Slide-mount card visuals — shared by strip and focused overlay. */
export function CarouselCardSlide({ card, className }: CarouselCardSlideProps) {
  const isRemote = card.thumbnail?.startsWith("http");
  const isLocal = card.thumbnail?.startsWith("/");

  return (
    <div className={cn("carousel-slide-mount", className)}>
      <p className="carousel-slide-mount-title">{card.title}</p>

      <div
        className={cn(
          "carousel-slide-mount-aperture",
          card.secret && "bg-[#f3efe6]",
        )}
      >
        {card.thumbnail ? (
          <Image
            src={card.thumbnail}
            alt=""
            fill
            className={cn(card.secret ? "object-contain p-1" : "object-cover")}
            sizes="(max-width: 640px) 80vw, 460px"
            unoptimized={isRemote || isLocal || card.secret}
          />
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
  onHoverStart?: () => void;
  onActivate?: (card: PlaceholderCard) => void;
  trailingGapPx?: number;
  className?: string;
};

/** Single carousel card in the scrolling strip. */
export function CarouselCard({
  card,
  interactive = true,
  onHoverStart,
  onActivate,
  trailingGapPx = 0,
  className,
}: CarouselCardProps) {
  const style = {
    width: `min(${CARD_WIDTH_PX}px, ${CARD_MAX_VW}vw)`,
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
        className="transition-[transform,box-shadow] duration-200 group-hover:shadow-[0_6px_24px_rgb(42_34_28/0.14)]"
      />
    </button>
  );
}
