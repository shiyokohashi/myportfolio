"use client";

import { CarouselCardSlide } from "@/components/CarouselCard";
import { CARD_MAX_VW, CARD_WIDTH_PX } from "@/config/animation";
import type { PlaceholderCard } from "@/data/cards";
import { cn } from "@/lib/utils";

export type FocusedCardOverlayProps = {
  card: PlaceholderCard;
  onClose: () => void;
  onOpen: (card: PlaceholderCard) => void;
};

export function FocusedCardOverlay({
  card,
  onClose,
  onOpen,
}: FocusedCardOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/35 px-6 py-16 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <button
        type="button"
        aria-label={
          card.secret
            ? `Close ${card.title}`
            : `Open ${card.title} in a new tab`
        }
        onClick={(event) => {
          event.stopPropagation();
          onOpen(card);
        }}
        className={cn(
          "origin-center scale-[1.5] cursor-pointer border-0 bg-transparent p-0 text-left",
          "transition-transform duration-300 ease-out hover:-translate-y-1",
        )}
        style={{ width: `min(${CARD_WIDTH_PX}px, ${CARD_MAX_VW}vw)` }}
      >
        <CarouselCardSlide
          card={card}
          className="shadow-[0_12px_48px_rgb(0_0_0/0.28)] ring-1 ring-white/20"
        />
      </button>
    </div>
  );
}
