"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  CARD_GAP_MAX_PX,
  CARD_GAP_MIN_PX,
  GALLOP_CYCLE_MS,
  HORSE_SPRITE,
  HORSE_USER_SPEED_MAX,
  HORSE_USER_SPEED_MIN,
} from "@/config/animation";
import type { PlaceholderCard } from "@/data/cards";
import { useHorseSpeed } from "@/contexts/HorseSpeedContext";
import { buildRandomCardGaps } from "@/lib/cardGaps";
import {
  createSyncedAnimationController,
  measureCarouselLoopWidth,
} from "@/lib/syncedAnimation";

export function useSyncedAnimation(cards: PlaceholderCard[]) {
  const { speed, setSpeed: setContextSpeed } = useHorseSpeed();
  const horseRef = useRef<HTMLDivElement>(null);
  const carouselStripRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ReturnType<
    typeof createSyncedAnimationController
  > | null>(null);
  const pageLoadSyncedRef = useRef(false);

  const [cardGaps, setCardGaps] = useState(() =>
    buildRandomCardGaps(cards, CARD_GAP_MIN_PX, CARD_GAP_MAX_PX),
  );
  const [frameIndex, setFrameIndex] = useState(0);

  const regenerateGaps = useCallback(() => {
    setCardGaps(buildRandomCardGaps(cards, CARD_GAP_MIN_PX, CARD_GAP_MAX_PX));
  }, [cards]);

  useEffect(() => {
    setCardGaps(buildRandomCardGaps(cards, CARD_GAP_MIN_PX, CARD_GAP_MAX_PX));
  }, [cards]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    pageLoadSyncedRef.current = false;

    const controller = createSyncedAnimationController(
      {
        getHorseSprite: () => horseRef.current,
        getCarouselStrip: () => carouselStripRef.current,
      },
      {
        loopDurationMs: GALLOP_CYCLE_MS,
        onCarouselLoop: regenerateGaps,
      },
    );

    controllerRef.current = controller;
    controller.setUserSpeed(speed);

    const strip = carouselStripRef.current;

    const measureAndSync = () => {
      if (!strip) return;
      const width = measureCarouselLoopWidth(strip);
      if (width <= 0) return;

      controller.setLoopWidth(width);

      if (!pageLoadSyncedRef.current) {
        controller.syncToPageLoadTime();
        pageLoadSyncedRef.current = true;
      }
    };

    const resizeObserver =
      strip &&
      new ResizeObserver(() => {
        measureAndSync();
      });

    if (strip && resizeObserver) {
      resizeObserver.observe(strip);
    }

    measureAndSync();
    controller.start();

    const handleVisibility = () => {
      if (document.hidden) {
        controller.stop();
      } else {
        controller.start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      controller.stop();
      controllerRef.current = null;
    };
  }, [regenerateGaps]);

  useEffect(() => {
    controllerRef.current?.setUserSpeed(speed);
  }, [speed]);

  useEffect(() => {
    let rafId = 0;
    let lastFrame = -1;

    const tick = () => {
      const frame = controllerRef.current?.getFrameIndex() ?? 0;

      if (frame !== lastFrame) {
        lastFrame = frame;
        setFrameIndex(frame);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const setSpeed = useCallback(
    (multiplier: number) => {
      const next = Math.max(
        HORSE_USER_SPEED_MIN,
        Math.min(HORSE_USER_SPEED_MAX, multiplier),
      );
      setContextSpeed(next);
      controllerRef.current?.setUserSpeed(next);
    },
    [setContextSpeed],
  );

  const onCardHoverChange = useCallback((hovered: boolean) => {
    controllerRef.current?.setHoverSlow(hovered);
  }, []);

  const onCardClick = useCallback(() => {
    controllerRef.current?.boost();
  }, []);

  const pauseCarousel = useCallback(() => {
    controllerRef.current?.setCarouselPaused(true);
    controllerRef.current?.setHoverSlow(false);
  }, []);

  const resumeCarousel = useCallback(() => {
    controllerRef.current?.setCarouselPaused(false);
  }, []);

  return {
    horseRef,
    carouselStripRef,
    cardGaps,
    speed,
    setSpeed,
    frameIndex,
    frameCount: HORSE_SPRITE.frameCount,
    onCardHoverChange,
    onCardClick,
    pauseCarousel,
    resumeCarousel,
  };
}
