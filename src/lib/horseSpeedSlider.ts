import {
  HORSE_USER_SPEED_MAX,
  HORSE_USER_SPEED_MID,
  HORSE_USER_SPEED_MIN,
} from "@/config/animation";

const SLIDER_STEPS = 1000;
const SLIDER_MID = 0.5;

/** Slider position 0–1: left = 0×, center = 0.2×, right = 3×. */
export function sliderPositionToSpeed(position: number): number {
  const t = Math.max(0, Math.min(1, position));

  if (t <= SLIDER_MID) {
    return HORSE_USER_SPEED_MID * (t / SLIDER_MID);
  }

  return (
    HORSE_USER_SPEED_MID +
    (HORSE_USER_SPEED_MAX - HORSE_USER_SPEED_MID) * ((t - SLIDER_MID) / SLIDER_MID)
  );
}

export function speedToSliderPosition(speed: number): number {
  const clamped = Math.max(
    HORSE_USER_SPEED_MIN,
    Math.min(HORSE_USER_SPEED_MAX, speed),
  );

  if (clamped <= HORSE_USER_SPEED_MID) {
    return (clamped / HORSE_USER_SPEED_MID) * SLIDER_MID;
  }

  return (
    SLIDER_MID +
    ((clamped - HORSE_USER_SPEED_MID) /
      (HORSE_USER_SPEED_MAX - HORSE_USER_SPEED_MID)) *
      SLIDER_MID
  );
}

export function speedToSliderValue(speed: number): number {
  return Math.round(speedToSliderPosition(speed) * SLIDER_STEPS);
}

export function sliderValueToSpeed(value: number): number {
  return sliderPositionToSpeed(value / SLIDER_STEPS);
}

export const HORSE_SPEED_SLIDER_MIN = 0;
export const HORSE_SPEED_SLIDER_MAX = SLIDER_STEPS;
