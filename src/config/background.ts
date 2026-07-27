/** Full-viewport background video — replace src to swap the scene. */
export const BACKGROUND_VIDEO = {
  src: "/videos/grass-breeze.mp4",
  blurPx: 0.6,
  brightness: 1.03,
  /** Full color at these horse speeds. */
  saturationFullAtSpeedLow: 0.1,
  saturationFullAtSpeedHigh: 1.7,
  /** Completely grayscale at this speed (default slider center). */
  saturationGrayscaleAtSpeed: 0.2,
  saturationMax: 1.08,
} as const;

/** Map horse speed to background video saturation — peaks at 0.1× and 1.7×, grey at 0.2×. */
export function getBackgroundVideoSaturation(speed: number): number {
  const {
    saturationMax,
    saturationFullAtSpeedLow,
    saturationFullAtSpeedHigh,
    saturationGrayscaleAtSpeed,
  } = BACKGROUND_VIDEO;
  const normalized = Math.max(0, speed);

  if (normalized === 0) return 0;

  if (normalized <= saturationFullAtSpeedLow) {
    return (normalized / saturationFullAtSpeedLow) * saturationMax;
  }

  if (normalized <= saturationGrayscaleAtSpeed) {
    const t =
      (normalized - saturationFullAtSpeedLow) /
      (saturationGrayscaleAtSpeed - saturationFullAtSpeedLow);
    return saturationMax * (1 - t);
  }

  if (normalized <= saturationFullAtSpeedHigh) {
    const t =
      (normalized - saturationGrayscaleAtSpeed) /
      (saturationFullAtSpeedHigh - saturationGrayscaleAtSpeed);
    return saturationMax * t;
  }

  return saturationMax;
}
