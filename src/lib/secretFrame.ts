import {
  HORSE_USER_SPEED_MAX,
  HORSE_USER_SPEED_MIN,
} from "@/config/animation";

/** Hidden wireframe frame — revealed at min/max speed. */
export const SECRET_FRAME = {
  number: 36,
  title: "Frame 36",
  subtitle: "The original website design",
  imageSrc: "/images/frame-36-wireframe.png",
} as const;

const ENDPOINT_EPSILON = 0.02;

export function isSpeedAtEndpoint(speed: number): boolean {
  const clamped = Math.max(HORSE_USER_SPEED_MIN, speed);
  return (
    clamped <= ENDPOINT_EPSILON ||
    clamped >= HORSE_USER_SPEED_MAX - ENDPOINT_EPSILON
  );
}
