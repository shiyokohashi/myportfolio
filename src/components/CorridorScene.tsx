"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { FloatingWorkCards } from "@/components/FloatingWorkCards";
import { IdleCameraDrift } from "@/components/IdleCameraDrift";
import { PointCloudHorse } from "@/components/PointCloudHorse";
import { ZoomOutToPageScroll } from "@/components/ZoomOutToPageScroll";
import { HORSE_YAW } from "@/components/horseSceneConstants";

const HORSE_POS: [number, number, number] = [0, 4.2, 0];
/** Aim through the midsection so legs and head both clear the frame. */
const LOOK_AT: [number, number, number] = [0, 2.2, 0];
export const CORRIDOR_MAX_DISTANCE = 50;

/**
 * Open framing: true side-on profile facing right (not running-at).
 * Camera sits in the aisle so the far wall of cards reads behind the horse.
 */
const CAMERA_POS: [number, number, number] = [-32, 2.5, 0.6];

type CorridorSceneProps = {
  /** When true, zooming out past maxDistance scrolls the page to intro. */
  zoomOutScrollsPage?: boolean;
};

/**
 * Default load: side-on horse profile with cards behind.
 */
export function CorridorScene({
  zoomOutScrollsPage = false,
}: CorridorSceneProps) {
  return (
    <group rotation={[0, HORSE_YAW, 0]}>
      <PerspectiveCamera
        makeDefault
        position={CAMERA_POS}
        fov={36}
        near={0.05}
        far={120}
      />
      {/* Cards first so transmission can sample them through the glass */}
      <FloatingWorkCards />
      <group position={HORSE_POS} renderOrder={2}>
        <PointCloudHorse scale={1.38} />
      </group>
      <OrbitControls
        key="horse-corridor-orbit"
        makeDefault
        enableDamping
        dampingFactor={0.06}
        target={LOOK_AT}
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
