/** Sprite sheet source — swap this path to use a different asset. */
export const HORSE_SPRITE = {
  src: "/images/horse-sprite.png",
  /** Total image width in pixels. */
  sheetWidth: 682,
  /** Total image height in pixels. */
  sheetHeight: 1024,
  /** Frames laid out in a grid (2 columns × 7 rows = 14 frames). */
  columns: 2,
  rows: 7,
  frameCount: 14,
} as const;

/** How long one full gallop cycle takes (ms). Carousel speed derives from this. */
export const GALLOP_CYCLE_MS = 5_000;

/** Horse gallop rate relative to base cycle (>1 = faster). */
export const HORSE_ANIMATION_RATE = 1.42;

/** Carousel scroll rate relative to base cycle (<1 = slower). */
export const CAROUSEL_SCROLL_RATE = 0.66;

/** Speed multiplier while a project card is hovered (1 = normal). */
export const HORSE_HOVER_SPEED = 0.12;

/** Brief speed burst added on project click, decays over HORSE_BOOST_DECAY_MS. */
export const HORSE_CLICK_BOOST = 0.55;

/** How quickly the click boost fades out (ms). */
export const HORSE_BOOST_DECAY_MS = 450;

/** How quickly speed eases toward hover/normal (higher = snappier). */
export const HORSE_SPEED_LERP = 0.14;

/** User-controlled speed multiplier range (horse + carousel). */
export const HORSE_USER_SPEED_MIN = 0;
export const HORSE_USER_SPEED_MAX = 3;
/** Speed at the center of the slider (also the default). */
export const HORSE_USER_SPEED_MID = 0.2;
export const HORSE_USER_SPEED_DEFAULT = HORSE_USER_SPEED_MID;

/** Display height of the horse on screen (px). Width scales from frame aspect ratio. */
export const HORSE_DISPLAY_HEIGHT_PX = 132;

/** One-time entrance run-in duration when the site first loads (ms). */
export const HORSE_ENTRANCE_DURATION_MS = 4_000;

/** Horse entrance progress (0–1) when carousel cards begin scrolling in. */
export const CAROUSEL_ENTRANCE_RELEASE_PROGRESS = 0.5;

/** Carousel card width (px). Used for layout and horizontal centering. */
export const CARD_WIDTH_PX = 460;

/** Minimum carousel inset — mirrors CardCarousel paddingLeft (1.5rem). */
export const CAROUSEL_PADDING_MIN_PX = 24;

/** Left padding that centers the first card when carousel offset is zero. */
export function getCarouselPaddingLeftPx(
  viewportWidth = typeof window === "undefined" ? 0 : window.innerWidth,
): number {
  return Math.max(CAROUSEL_PADDING_MIN_PX, viewportWidth / 2 - CARD_WIDTH_PX / 2);
}

/** Max card width as a viewport percentage. */
export const CARD_MAX_VW = 80;

/** Minimum gap between carousel cards (px). */
export const CARD_GAP_MIN_PX = 80;

/** Maximum gap between carousel cards (px). */
export const CARD_GAP_MAX_PX = 1000;

/** Number of duplicated card sets for seamless carousel looping. */
export const CAROUSEL_LOOP_COPIES = 4;

export function getFrameSize() {
  const frameWidth = HORSE_SPRITE.sheetWidth / HORSE_SPRITE.columns;
  const frameHeight = HORSE_SPRITE.sheetHeight / HORSE_SPRITE.rows;
  return { frameWidth, frameHeight };
}

export function getSpriteBackgroundPosition(frameIndex: number) {
  const { frameWidth, frameHeight } = getFrameSize();
  const col = frameIndex % HORSE_SPRITE.columns;
  const row = Math.floor(frameIndex / HORSE_SPRITE.columns);
  return {
    x: -col * frameWidth,
    y: -row * frameHeight,
  };
}

export function getHorseDisplayWidth(displayHeightPx = HORSE_DISPLAY_HEIGHT_PX) {
  const { frameWidth, frameHeight } = getFrameSize();
  return Math.round((frameWidth / frameHeight) * displayHeightPx);
}

function getHorseSpriteScale(displayHeightPx = HORSE_DISPLAY_HEIGHT_PX) {
  const { frameHeight } = getFrameSize();
  return displayHeightPx / frameHeight;
}

/** Pixel-aligned sprite metrics so scaled frames stay sharp. */
export function getHorseFrameMetrics(
  frameIndex: number,
  displayHeightPx = HORSE_DISPLAY_HEIGHT_PX,
) {
  const { frameWidth, frameHeight } = getFrameSize();
  const scale = getHorseSpriteScale(displayHeightPx);
  const displayWidth = Math.round(frameWidth * scale);
  const displayHeight = Math.round(frameHeight * scale);
  const { x, y } = getSpriteBackgroundPosition(frameIndex);

  return {
    displayWidth,
    displayHeight,
    sheetWidth: Math.round(HORSE_SPRITE.sheetWidth * scale),
    sheetHeight: Math.round(HORSE_SPRITE.sheetHeight * scale),
    posX: Math.round(x * scale),
    posY: Math.round(y * scale),
  };
}
