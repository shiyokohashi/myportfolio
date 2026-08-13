"use client";

import { useEffect } from "react";

import { CarouselCardSlide, cardWidthStyle } from "@/components/CarouselCard";
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
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const canOpen = !card.secret && Boolean(card.href);

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/35 px-6 py-16 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${card.title} preview`}
    >
      <button
        type="button"
        aria-label={
          canOpen
            ? `Open ${card.title} in a new tab`
            : `Close ${card.title} preview`
        }
        onClick={(event) => {
          event.stopPropagation();
          onOpen(card);
        }}
        className={cn(
          "origin-center scale-[1.5] cursor-pointer border-0 bg-transparent p-0 text-left outline-none",
          "transition-transform duration-300 ease-out hover:-translate-y-1",
          "focus-visible:outline-none",
        )}
        style={cardWidthStyle()}
      >
        <CarouselCardSlide
          card={card}
          className="[&_.carousel-card-media]:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)]"
        />
      </button>
    </div>
  );
}
