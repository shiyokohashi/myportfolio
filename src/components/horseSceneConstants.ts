/** Shared gallop-axis orientation for horse and corridor. */
export const HORSE_YAW = -0.42;

/** Card walls — aisle midline is local x = 0. */
export const CORRIDOR_WALL_X = 18;

/** Matches PointCloudHorse clip duration — one full gallop stride. */
export const GALLOP_DURATION = 0.78;

/** Base corridor scroll speed in world units per second. */
export const CARD_SCROLL_SPEED = 8.4;

/** Scroll distance integrated with a subtle gallop-phase pulse (no drift). */
export function gallopSyncedTravel(elapsedTime: number): number {
  const t = elapsedTime;
  const period = GALLOP_DURATION;
  const pulse = 0.14;

  return (
    CARD_SCROLL_SPEED * t -
    CARD_SCROLL_SPEED *
      pulse *
      (period / (2 * Math.PI)) *
      (Math.cos((2 * Math.PI * t) / period) - 1)
  );
}
