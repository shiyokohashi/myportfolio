"use client";

import { useCallback, useEffect, useState } from "react";

import { CardCarousel } from "@/components/CardCarousel";
import { FocusedCardOverlay } from "@/components/FocusedCardOverlay";
import { HorseSpeedBar } from "@/components/HorseSpeedBar";
import { HorseSprite } from "@/components/HorseSprite";
import {
  buildCarouselDeck,
  getShuffledCarouselCards,
  type PlaceholderCard,
} from "@/data/cards";
import { useCarouselCards } from "@/hooks/useCarouselCards";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSyncedAnimation } from "@/hooks/useSyncedAnimation";
import { useHorseSpeed } from "@/contexts/HorseSpeedContext";
import { isCarouselEntranceVisible } from "@/lib/horseEntrance";
import { getPageLoadOriginMs } from "@/lib/pageLoadOrigin";
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
  const [ready, setReady] = useState(false);
  const [entranceVisible, setEntranceVisible] = useState(false);
  const [shuffledCards, setShuffledCards] = useState(() => buildCarouselDeck());

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setShuffledCards(getShuffledCarouselCards());
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);
  const [focusedCard, setFocusedCard] = useState<PlaceholderCard | null>(null);
  const baseCards = cardsProp ?? shuffledCards;
  const { speed: contextSpeed } = useHorseSpeed();
  const { sceneHidden, registerBottomSceneCarousel, registerBottomSceneChrome } =
    useScrollReveal();
  const carouselCards = useCarouselCards(baseCards, contextSpeed, !sceneHidden);

  useEffect(() => {
    getPageLoadOriginMs();
    const frameId = requestAnimationFrame(() => {
      setReady(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    let rafId = 0;
    const originMs = getPageLoadOriginMs();

    const tick = () => {
      const elapsed = performance.now() - originMs;
      const visible = isCarouselEntranceVisible(elapsed);
      setEntranceVisible((prev) => (prev === visible ? prev : visible));

      if (!visible) {
        rafId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [ready]);

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
  } = useSyncedAnimation(carouselCards, ready);

  useEffect(() => {
    if (
      focusedCard &&
      !carouselCards.some((card) => card.id === focusedCard.id)
    ) {
      const frameId = requestAnimationFrame(() => {
        setFocusedCard(null);
        resumeCarousel();
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [carouselCards, focusedCard, resumeCarousel]);

  useEffect(() => {
    if (sceneHidden && focusedCard) {
      const frameId = requestAnimationFrame(() => {
        setFocusedCard(null);
        resumeCarousel();
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
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

  if (!ready) {
    return null;
  }

  const showScene = entranceVisible && !sceneHidden;

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
        ref={registerBottomSceneCarousel}
        aria-label="Project carousel"
        aria-hidden={!showScene || sceneHidden}
        className={cn(
          "fixed inset-x-0 top-[46%] z-40",
          "-translate-y-1/2 overflow-x-clip will-change-[opacity]",
          !showScene && "invisible pointer-events-none",
          sceneHidden && "pointer-events-none",
          focusedCard && "pointer-events-none",
          className,
        )}
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
        ref={registerBottomSceneChrome}
        className={cn(
          "fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-4 will-change-[opacity]",
          sceneHidden && "pointer-events-none",
        )}
      >
        <section
          aria-label="Galloping horse"
          aria-hidden={!showScene || sceneHidden}
          className={cn(
            "pointer-events-none flex w-full justify-center",
            !showScene && "invisible",
          )}
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
