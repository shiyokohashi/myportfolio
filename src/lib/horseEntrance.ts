import {
  CAROUSEL_ENTRANCE_HOLD_MS,
  CAROUSEL_ENTRANCE_ROLL_MS,
  GALLOP_CYCLE_MS,
  getCarouselPaddingLeftPx,
  HORSE_ANIMATION_RATE,
  HORSE_SPRITE,
} from "@/config/animation";
import { getPageLoadOriginMs } from "@/lib/pageLoadOrigin";

export type CarouselEntrancePhase = "hidden" | "rolling" | "released";

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function getHorseEntranceStartX(displayWidth: number): number {
  return -(window.innerWidth * 0.55 + displayWidth);
}

/** Offset where cards sit fully off-screen to the right. */
export function getCarouselEntranceStartOffset(): number {
  return getCarouselPaddingLeftPx() - window.innerWidth;
}

function getElapsedMs(elapsedMs?: number): number {
  return elapsedMs ?? performance.now() - getPageLoadOriginMs();
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getCarouselEntrancePhase(
  elapsedMs?: number,
): CarouselEntrancePhase {
  if (prefersReducedMotion()) return "released";

  const elapsed = getElapsedMs(elapsedMs);

  if (elapsed < CAROUSEL_ENTRANCE_HOLD_MS) return "hidden";
  if (elapsed < CAROUSEL_ENTRANCE_HOLD_MS + CAROUSEL_ENTRANCE_ROLL_MS) {
    return "rolling";
  }

  return "released";
}

export function isCarouselEntranceVisible(elapsedMs?: number): boolean {
  return getCarouselEntrancePhase(elapsedMs) !== "hidden";
}

/** Carousel offset during the hold + roll-in sequence. */
export function getCarouselEntranceOffset(elapsedMs?: number): number {
  if (prefersReducedMotion()) return 0;

  const elapsed = getElapsedMs(elapsedMs);
  const startOffset = getCarouselEntranceStartOffset();
  const phase = getCarouselEntrancePhase(elapsed);

  if (phase === "hidden") return startOffset;

  if (phase === "rolling") {
    const rollElapsed = elapsed - CAROUSEL_ENTRANCE_HOLD_MS;
    const t = Math.min(1, rollElapsed / CAROUSEL_ENTRANCE_ROLL_MS);
    return startOffset * (1 - easeOutCubic(t));
  }

  return 0;
}

/** Elapsed time for continuous carousel scroll after the roll-in finishes. */
export function getCarouselScrollElapsedMs(elapsedMs?: number): number {
  if (prefersReducedMotion()) return getElapsedMs(elapsedMs);

  const elapsed = getElapsedMs(elapsedMs);
  const releaseAt = CAROUSEL_ENTRANCE_HOLD_MS + CAROUSEL_ENTRANCE_ROLL_MS;

  if (elapsed <= releaseAt) return 0;

  return elapsed - releaseAt;
}

export function isCarouselScrollReleased(elapsedMs?: number): boolean {
  return getCarouselEntrancePhase(elapsedMs) === "released";
}

export function getHorseEntranceTranslateX(): number | null {
  return null;
}

export function getHorseFrameIndexAtTime(elapsedMs?: number): number {
  const elapsed = getElapsedMs(elapsedMs);
  const progress = (elapsed / GALLOP_CYCLE_MS) * HORSE_ANIMATION_RATE;
  const wrapped = progress - Math.floor(progress);
  return Math.floor(wrapped * HORSE_SPRITE.frameCount) % HORSE_SPRITE.frameCount;
}

export function getInitialHorseRenderState() {
  return {
    transform: undefined as string | undefined,
    frameIndex: 0,
  };
}
