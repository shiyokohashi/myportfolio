"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { FloatingWorkCards } from "@/components/FloatingWorkCards";
import { IdleCameraDrift } from "@/components/IdleCameraDrift";
import { PointCloudHorse } from "@/components/PointCloudHorse";
import { ZoomOutToPageScroll } from "@/components/ZoomOutToPageScroll";
import { HORSE_YAW } from "@/components/horseSceneConstants";

const HORSE_POS: [number, number, number] = [0, 4.2, 0];
/** Aim below the horse so the composition sits higher / more centered. */
const LOOK_AT: [number, number, number] = [0.4, 1.6, 0.5];
export const CORRIDOR_MAX_DISTANCE = 50;

/** Same three-quarter front-left bearing as the preferred load angle. */
const VIEW_DIR = (() => {
  const from = { x: -9.2, y: 1.6, z: 15.5 };
  const dx = from.x - LOOK_AT[0];
  const dy = from.y - LOOK_AT[1];
  const dz = from.z - LOOK_AT[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  return { x: dx / len, y: dy / len, z: dz / len };
})();

const CAMERA_POS: [number, number, number] = [
  LOOK_AT[0] + VIEW_DIR.x * CORRIDOR_MAX_DISTANCE,
  LOOK_AT[1] + VIEW_DIR.y * CORRIDOR_MAX_DISTANCE,
  LOOK_AT[2] + VIEW_DIR.z * CORRIDOR_MAX_DISTANCE,
];

type CorridorSceneProps = {
  /** When true, zooming out past maxDistance scrolls the page to intro. */
  zoomOutScrollsPage?: boolean;
};

/**
 * Default load: preferred angle, zoomed out to maxDistance.
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
