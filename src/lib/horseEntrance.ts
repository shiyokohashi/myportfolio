import {
  CAROUSEL_ENTRANCE_RELEASE_PROGRESS,
  GALLOP_CYCLE_MS,
  getCarouselPaddingLeftPx,
  HORSE_ANIMATION_RATE,
  HORSE_ENTRANCE_DURATION_MS,
  HORSE_SPRITE,
} from "@/config/animation";

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function getHorseEntranceStartX(displayWidth: number): number {
  return -(window.innerWidth * 0.55 + displayWidth);
}

/** Offset where the first card's left edge sits at the viewport's right edge. */
export function getCarouselEntranceStartOffset(): number {
  return getCarouselPaddingLeftPx() - window.innerWidth;
}

export function getHorseEntranceProgress(elapsedMs = performance.now()): number {
  return Math.min(1, elapsedMs / HORSE_ENTRANCE_DURATION_MS);
}

export function isHorseEntranceComplete(elapsedMs = performance.now()): boolean {
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return true;
  }

  return getHorseEntranceProgress(elapsedMs) >= 1;
}

export function getCarouselScrollStartMs(): number {
  return HORSE_ENTRANCE_DURATION_MS * CAROUSEL_ENTRANCE_RELEASE_PROGRESS;
}

export function isCarouselScrollReleased(elapsedMs = performance.now()): boolean {
  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return true;
  }

  return getHorseEntranceProgress(elapsedMs) >= CAROUSEL_ENTRANCE_RELEASE_PROGRESS;
}

/** Elapsed time for carousel scroll — zero until halfway through the horse run-in. */
export function getCarouselScrollElapsedMs(elapsedMs = performance.now()): number {
  if (!isCarouselScrollReleased(elapsedMs)) return 0;

  if (typeof window !== "undefined") {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return elapsedMs;
  }

  return Math.max(0, elapsedMs - getCarouselScrollStartMs());
}

export function getHorseEntranceTranslateX(): number | null {
  return null;
}

export function getHorseFrameIndexAtTime(elapsedMs = performance.now()): number {
  const progress = (elapsedMs / GALLOP_CYCLE_MS) * HORSE_ANIMATION_RATE;
  const wrapped = progress - Math.floor(progress);
  return Math.floor(wrapped * HORSE_SPRITE.frameCount) % HORSE_SPRITE.frameCount;
}

export function getInitialHorseRenderState() {
  return {
    transform: undefined as string | undefined,
    frameIndex: 0,
  };
}
