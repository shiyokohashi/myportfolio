"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { FloatingWorkCards } from "@/components/FloatingWorkCards";
import { IdleCameraDrift } from "@/components/IdleCameraDrift";
import { PointCloudHorse } from "@/components/PointCloudHorse";
import { ZoomOutToPageScroll } from "@/components/ZoomOutToPageScroll";
import { HORSE_YAW } from "@/components/horseSceneConstants";
import {
  CORRIDOR_PRESETS,
  type CorridorPreset,
} from "@/config/corridorPresets";

export const CORRIDOR_MAX_DISTANCE = 50;

type CorridorSceneProps = {
  /** When true, zooming out past maxDistance scrolls the page to intro. */
  zoomOutScrollsPage?: boolean;
  preset?: CorridorPreset;
};

/**
 * Default load: side-on horse profile with cards behind.
 */
export function CorridorScene({
  zoomOutScrollsPage = false,
  preset = "wide",
}: CorridorSceneProps) {
  const { horsePos, lookAt, cameraPos, fov } = CORRIDOR_PRESETS[preset];

  return (
    <group rotation={[0, HORSE_YAW, 0]}>
      <PerspectiveCamera
        makeDefault
        position={cameraPos}
        fov={fov}
        near={0.05}
        far={120}
      />
      {/* Cards first so transmission can sample them through the glass */}
      <FloatingWorkCards />
      <group position={horsePos} renderOrder={2}>
        <PointCloudHorse scale={1.38} />
      </group>
      <OrbitControls
        key={`horse-corridor-orbit-${preset}`}
        makeDefault
        enableDamping
        dampingFactor={0.06}
        target={lookAt}
        minDistance={10}
        maxDistance={CORRIDOR_MAX_DISTANCE}
        minPolarAngle={Math.PI / 2 - 0.35}
        maxPolarAngle={Math.PI / 2 + 0.24}
      />
      <IdleCameraDrift />
      {zoomOutScrollsPage ? (
        <ZoomOutToPageScroll maxDistance={CORRIDOR_MAX_DISTANCE} />
      ) : null}
    </group>
  );
}
