"use client";

import { useMemo, useRef } from "react";

import { CarouselCard } from "@/components/CarouselCard";
import {
  CAROUSEL_LOOP_COPIES,
  CARD_GAP_MIN_PX,
  getCarouselPaddingLeftPx,
} from "@/config/animation";
import type { PlaceholderCard } from "@/data/cards";
import { cn } from "@/lib/utils";

export type CardCarouselProps = {
  cards: PlaceholderCard[];
  cardGaps: number[];
  stripRef?: React.RefObject<HTMLDivElement | null>;
  onCardHoverChange?: (hovered: boolean) => void;
  onCardActivate?: (card: PlaceholderCard) => void;
  className?: string;
};

/** Horizontally scrolling card strip — motion driven by shared rAF controller. */
export function CardCarousel({
  cards,
  cardGaps,
  stripRef,
  onCardHoverChange,
  onCardActivate,
  className,
}: CardCarouselProps) {
  const segments = useMemo(
    () =>
      Array.from({ length: CAROUSEL_LOOP_COPIES }, (_, copyIndex) => ({
        copyIndex,
        key: `segment-${copyIndex}`,
      })),
    [],
  );

  const isSlowRef = useRef(false);

  const setSlow = (slow: boolean) => {
    if (isSlowRef.current === slow) return;
    isSlowRef.current = slow;
    onCardHoverChange?.(slow);
  };

  if (cards.length === 0) return null;

  return (
    <div
      className={cn("w-full overflow-hidden py-4", className)}
      aria-label="Project carousel"
      style={{
        paddingLeft: `${getCarouselPaddingLeftPx()}px`,
      }}
      onPointerLeave={() => setSlow(false)}
    >
      <div ref={stripRef} className="flex w-max items-start will-change-transform">
        {segments.map(({ copyIndex, key }) => {
          const isPrimaryCopy = copyIndex === 0;

          return (
            <div
              key={key}
              data-carousel-segment
              aria-hidden={!isPrimaryCopy || undefined}
              className="flex shrink-0 items-stretch"
            >
              {cards.map((card, index) => (
                <CarouselCard
                  key={`${copyIndex}-${card.id}`}
                  card={card}
                  interactive={isPrimaryCopy}
                  onHoverStart={() => setSlow(true)}
                  onActivate={onCardActivate}
                  trailingGapPx={cardGaps[index] ?? CARD_GAP_MIN_PX}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
