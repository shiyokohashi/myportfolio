export type CorridorPreset = "default" | "wide";

export type CorridorPresetConfig = {
  horsePos: [number, number, number];
  lookAt: [number, number, number];
  cameraPos: [number, number, number];
  fov: number;
};

export const CORRIDOR_PRESETS: Record<CorridorPreset, CorridorPresetConfig> = {
  /** Original framing — matches the glass-corridor screen recording. */
  default: {
    horsePos: [0, 4.2, 0],
    lookAt: [0, 2.2, 0],
    cameraPos: [-32, 2.5, 0.6],
    fov: 36,
  },
  /** Wider framing — horse nudged right, camera pulled back. */
  wide: {
    horsePos: [1.4, 4.2, 0],
    lookAt: [0.4, 2.2, 0],
    cameraPos: [-37.5, 2.55, 0.65],
    fov: 40,
  },
};
