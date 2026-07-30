import {
  CAROUSEL_LOOP_COPIES,
  CAROUSEL_SCROLL_RATE,
  GALLOP_CYCLE_MS,
  getHorseFrameMetrics,
  HORSE_ANIMATION_RATE,
  HORSE_BOOST_DECAY_MS,
  HORSE_CLICK_BOOST,
  HORSE_DISPLAY_HEIGHT_PX,
  HORSE_HOVER_SPEED,
  HORSE_SPEED_LERP,
  HORSE_SPRITE,
  HORSE_USER_SPEED_DEFAULT,
} from "@/config/animation";
import {
  getCarouselEntranceOffset,
  getCarouselEntranceStartOffset,
  getCarouselScrollElapsedMs,
  isCarouselScrollReleased,
} from "@/lib/horseEntrance";
import { getPageLoadOriginMs } from "@/lib/pageLoadOrigin";

export type SyncedAnimationTargets = {
  getHorseSprite: () => HTMLDivElement | null;
  getCarouselStrip: () => HTMLDivElement | null;
};

export type SyncedAnimationControllerOptions = {
  loopDurationMs?: number;
  onCarouselLoop?: () => void;
};

export type SyncedAnimationController = {
  start: () => void;
  stop: () => void;
  setLoopWidth: (widthPx: number) => void;
  setHoverSlow: (active: boolean) => void;
  setUserSpeed: (multiplier: number, immediate?: boolean) => void;
  getUserSpeed: () => number;
  setCarouselPaused: (paused: boolean) => void;
  setCarouselOffset: (offsetPx: number) => void;
  syncToPageLoadTime: () => void;
  boost: () => void;
  getProgress: () => number;
  getFrameIndex: () => number;
};

/** Distance between duplicate segments — includes inter-segment gap for seamless wrap. */
export function measureCarouselLoopWidth(strip: HTMLElement): number {
  const segments = strip.querySelectorAll<HTMLElement>("[data-carousel-segment]");

  if (segments.length >= 2) {
    return segments[1].offsetLeft - segments[0].offsetLeft;
  }

  return segments[0]?.offsetWidth ?? 0;
}

export function getHorseFrameInlineStyles(
  frameIndex: number,
  displayHeightPx = HORSE_DISPLAY_HEIGHT_PX,
) {
  const {
    sheetWidth,
    sheetHeight,
    posX,
    posY,
  } = getHorseFrameMetrics(frameIndex, displayHeightPx);

  return {
    backgroundImage: `url(${HORSE_SPRITE.src})`,
    backgroundColor: "transparent",
    backgroundRepeat: "no-repeat",
    backgroundSize: `${sheetWidth}px ${sheetHeight}px`,
    backgroundPosition: `${posX}px ${posY}px`,
    imageRendering: "auto",
    backfaceVisibility: "hidden",
    transform: "translateZ(0)",
  } as const;
}

export function applyHorseFrame(
  horseRoot: HTMLDivElement,
  frameIndex: number,
  displayHeightPx = HORSE_DISPLAY_HEIGHT_PX,
) {
  const frameEl = horseRoot.querySelector<HTMLDivElement>("[data-sprite-frame]");
  if (!frameEl) return;

  const styles = getHorseFrameInlineStyles(frameIndex, displayHeightPx);
  Object.assign(frameEl.style, styles);

  if (horseRoot.dataset.pixelated === "true") {
    frameEl.style.imageRendering = "pixelated";
  }
}

/**
 * Single requestAnimationFrame loop drives horse sprite frames and carousel
 * scroll from one shared speed multiplier. Carousel offset never resets
 * visually — it subtracts one loop width at a time for seamless wrap.
 */
export function createSyncedAnimationController(
  targets: SyncedAnimationTargets,
  options: SyncedAnimationControllerOptions = {},
): SyncedAnimationController {
  const loopDurationMs = options.loopDurationMs ?? GALLOP_CYCLE_MS;

  let rafId: number | null = null;
  let lastTimestamp: number | null = null;
  let horseProgress = 0;
  let carouselOffsetPx = 0;
  let loopWidthPx = 0;
  let carouselPxPerMs = 0;
  let isRunning = false;

  let speedMultiplier = HORSE_USER_SPEED_DEFAULT;
  let targetSpeedMultiplier = HORSE_USER_SPEED_DEFAULT;
  let userSpeedMultiplier = HORSE_USER_SPEED_DEFAULT;
  let hoverSlow = false;
  let boostAmount = 0;
  let carouselPaused = false;
  const entranceOriginMs = getPageLoadOriginMs();

  const getEntranceElapsedMs = () => performance.now() - entranceOriginMs;

  const resolveTargetSpeed = () =>
    hoverSlow ? HORSE_HOVER_SPEED * userSpeedMultiplier : userSpeedMultiplier;

  const applyHorse = () => {
    const wrapped = horseProgress - Math.floor(horseProgress);
    const frameIndex =
      Math.floor(wrapped * HORSE_SPRITE.frameCount) % HORSE_SPRITE.frameCount;

    const horseEl = targets.getHorseSprite();
    if (horseEl) {
      applyHorseFrame(horseEl, frameIndex);
    }
  };

  const applyCarousel = () => {
    const stripEl = targets.getCarouselStrip();
    if (stripEl) {
      stripEl.style.transform = `translate3d(${-carouselOffsetPx}px, 0, 0)`;
    }
  };

  const applyFrame = () => {
    applyHorse();
    applyCarousel();
  };

  const tick = (timestamp: number) => {
    if (!isRunning) return;

    if (lastTimestamp === null) {
      lastTimestamp = timestamp;
    }

    const deltaMs = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    boostAmount *= Math.exp(-deltaMs / HORSE_BOOST_DECAY_MS);

    speedMultiplier +=
      (targetSpeedMultiplier - speedMultiplier) *
      Math.min(1, HORSE_SPEED_LERP * (deltaMs / 16));

    const currentSpeed = Math.max(0, speedMultiplier + boostAmount);

    horseProgress +=
      (deltaMs / loopDurationMs) * currentSpeed * HORSE_ANIMATION_RATE;

    if (loopWidthPx > 0 && !carouselPaused) {
      const entranceElapsedMs = getEntranceElapsedMs();

      if (isCarouselScrollReleased(entranceElapsedMs)) {
        carouselOffsetPx +=
          deltaMs * carouselPxPerMs * currentSpeed * CAROUSEL_SCROLL_RATE;

        if (carouselOffsetPx >= loopWidthPx) {
          carouselOffsetPx %= loopWidthPx;
          options.onCarouselLoop?.();
        }
      } else {
        carouselOffsetPx = getCarouselEntranceOffset(entranceElapsedMs);
      }
    }

    applyFrame();

    rafId = requestAnimationFrame(tick);
  };

  return {
    start() {
      if (isRunning) return;
      isRunning = true;
      lastTimestamp = null;
      rafId = requestAnimationFrame(tick);
    },
    stop() {
      isRunning = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    setLoopWidth(widthPx: number) {
      if (widthPx <= 0) return;

      if (loopWidthPx > 0) {
        carouselOffsetPx = (carouselOffsetPx / loopWidthPx) * widthPx;
      }

      loopWidthPx = widthPx;
      carouselPxPerMs = loopWidthPx / loopDurationMs;
      applyFrame();
    },
    setHoverSlow(active: boolean) {
      hoverSlow = active;
      targetSpeedMultiplier = resolveTargetSpeed();
    },
    setUserSpeed(multiplier: number, immediate = false) {
      userSpeedMultiplier = Math.max(0, multiplier);
      targetSpeedMultiplier = resolveTargetSpeed();
      if (immediate) {
        speedMultiplier = targetSpeedMultiplier;
      }
    },
    getUserSpeed() {
      return userSpeedMultiplier;
    },
    setCarouselPaused(paused: boolean) {
      carouselPaused = paused;
    },
    setCarouselOffset(offsetPx: number) {
      carouselOffsetPx = offsetPx;
      applyCarousel();
    },
    syncToPageLoadTime() {
      const entranceElapsedMs = getEntranceElapsedMs();

      horseProgress =
        (entranceElapsedMs / loopDurationMs) * HORSE_ANIMATION_RATE;

      if (loopWidthPx > 0) {
        carouselOffsetPx = getCarouselEntranceOffset(entranceElapsedMs);

        if (isCarouselScrollReleased(entranceElapsedMs)) {
          const carouselElapsedMs = getCarouselScrollElapsedMs(entranceElapsedMs);

          carouselOffsetPx +=
            carouselElapsedMs *
            carouselPxPerMs *
            userSpeedMultiplier *
            CAROUSEL_SCROLL_RATE;

          while (carouselOffsetPx >= loopWidthPx) {
            carouselOffsetPx -= loopWidthPx;
            options.onCarouselLoop?.();
          }
        }
      }

      applyFrame();
    },
    boost() {
      boostAmount = HORSE_CLICK_BOOST;
    },
    getProgress: () => horseProgress - Math.floor(horseProgress),
    getFrameIndex: () => {
      const wrapped = horseProgress - Math.floor(horseProgress);
      return (
        Math.floor(wrapped * HORSE_SPRITE.frameCount) % HORSE_SPRITE.frameCount
      );
    },
  };
}

export { CAROUSEL_LOOP_COPIES };
