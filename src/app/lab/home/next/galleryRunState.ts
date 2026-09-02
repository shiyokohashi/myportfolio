export const RUN_RADIUS = 11.5;
export const WALL_RADIUS = 26;
export const RUN_SPEED = 0.19;
/** 3D distance trigger — wall sits ~14.5 units from the run track. */
export const REVEAL_DISTANCE = 17;
/** Angular trigger — card sector in front of the horse. */
export const REVEAL_ANGLE = 0.72;
export const REVEAL_DURATION = 0.82;
export const HORSE_Y = 3.5;
export const CAMERA_DISTANCE = 8.5;
export const CAMERA_HEIGHT = 2.1;
export const TURN_SENSITIVITY = 0.0072;

export type GalleryCardLayout = {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  href: string;
  wallAngle: number;
  y: number;
  radius: number;
  scale: number;
  roll: number;
  hero: boolean;
};

export type CardRevealState = {
  startedAt: number | null;
  revealed: boolean;
};

export function wrapAngle(angle: number): number {
  let wrapped = angle;
  while (wrapped > Math.PI) wrapped -= Math.PI * 2;
  while (wrapped < -Math.PI) wrapped += Math.PI * 2;
  return wrapped;
}

export function horseFacingAngle(
  heading: number,
  turn: number,
): number {
  return heading + turn;
}
