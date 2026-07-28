"use client";

import { useCallback, useEffect, useState } from "react";

import { CardCarousel } from "@/components/CardCarousel";
import { FocusedCardOverlay } from "@/components/FocusedCardOverlay";
import { HorseSpeedBar } from "@/components/HorseSpeedBar";
import { HorseSprite } from "@/components/HorseSprite";
import { getShuffledCarouselCards, type PlaceholderCard } from "@/data/cards";
import { useCarouselCards } from "@/hooks/useCarouselCards";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSyncedAnimation } from "@/hooks/useSyncedAnimation";
import { useHorseSpeed } from "@/contexts/HorseSpeedContext";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

export type BottomSceneProps = {
  cards?: PlaceholderCard[];
  className?: string;
};

/**
 * Carousel centered in the viewport; horse anchored at bottom center.
 * Both share one requestAnimationFrame animation controller.
 */
export function BottomScene({
  cards: cardsProp,
  className,
}: BottomSceneProps) {
  const [shuffledCards] = useState(() => getShuffledCarouselCards());
  const [focusedCard, setFocusedCard] = useState<PlaceholderCard | null>(null);
  const baseCards = cardsProp ?? shuffledCards;
  const { speed: contextSpeed } = useHorseSpeed();
  const { bottomSceneOpacity } = useScrollReveal();
  const sceneOpacity = bottomSceneOpacity;
  const sceneHidden = bottomSceneOpacity <= 0.02;
  const carouselCards = useCarouselCards(baseCards, contextSpeed, !sceneHidden);
  const {
    horseRef,
    carouselStripRef,
    cardGaps,
    speed,
    setSpeed,
    frameIndex,
    frameCount,
    onCardHoverChange,
    pauseCarousel,
    resumeCarousel,
  } = useSyncedAnimation(carouselCards);

  useEffect(() => {
    if (
      focusedCard &&
      !carouselCards.some((card) => card.id === focusedCard.id)
    ) {
      setFocusedCard(null);
      resumeCarousel();
    }
  }, [carouselCards, focusedCard, resumeCarousel]);

  useEffect(() => {
    if (sceneHidden && focusedCard) {
      setFocusedCard(null);
      resumeCarousel();
    }
  }, [sceneHidden, focusedCard, resumeCarousel]);

  const handleDismiss = useCallback(() => {
    setFocusedCard(null);
    resumeCarousel();
    onCardHoverChange(false);
  }, [resumeCarousel, onCardHoverChange]);

  const handleCardActivate = useCallback(
    (card: PlaceholderCard) => {
      onCardHoverChange(false);
      setFocusedCard(card);
      pauseCarousel();
    },
    [onCardHoverChange, pauseCarousel],
  );

  const handleFocusedOpen = useCallback(
    (card: PlaceholderCard) => {
      if (!card.secret && card.href) {
        window.open(card.href, "_blank", "noopener,noreferrer");
      }

      handleDismiss();
    },
    [handleDismiss],
  );

  return (
    <>
      {focusedCard ? (
        <FocusedCardOverlay
          card={focusedCard}
          onClose={handleDismiss}
          onOpen={handleFocusedOpen}
        />
      ) : null}

      <section
        aria-label="Project carousel"
        aria-hidden={sceneHidden}
        className={cn(
          "fixed inset-x-0 top-[46%] z-40",
          "-translate-y-1/2 overflow-x-clip transition-opacity duration-200",
          sceneHidden && "pointer-events-none",
          focusedCard && "pointer-events-none",
          className,
        )}
        style={{ opacity: sceneOpacity }}
      >
        <CardCarousel
          cards={carouselCards}
          cardGaps={cardGaps}
          stripRef={carouselStripRef}
          onCardHoverChange={onCardHoverChange}
          onCardActivate={handleCardActivate}
          className={PAGE_GUTTER}
        />
      </section>

      <div
        className={cn(
          "fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-4 transition-opacity duration-200",
          sceneHidden && "pointer-events-none",
        )}
        style={{ opacity: sceneOpacity }}
      >
        <section
          aria-label="Galloping horse"
          aria-hidden={sceneHidden}
          className="pointer-events-none flex w-full justify-center"
        >
          <HorseSprite ref={horseRef} />
        </section>

        <HorseSpeedBar
          speed={speed}
          onSpeedChange={setSpeed}
          frameIndex={frameIndex}
          frameCount={frameCount}
          hidden={sceneHidden}
        />
      </div>
    </>
  );
}
