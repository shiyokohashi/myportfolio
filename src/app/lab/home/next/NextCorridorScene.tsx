"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { NextPointCloudHorse } from "@/app/lab/home/next/NextPointCloudHorse";
import { CORRIDOR_MAX_DISTANCE } from "@/components/CorridorScene";
import { FloatingWorkCards } from "@/components/FloatingWorkCards";
import { IdleCameraDrift } from "@/components/IdleCameraDrift";
import { HORSE_YAW } from "@/components/horseSceneConstants";
import { ZoomOutToPageScroll } from "@/components/ZoomOutToPageScroll";
import { CORRIDOR_PRESETS } from "@/config/corridorPresets";

type NextCorridorSceneProps = {
  zoomOutScrollsPage?: boolean;
};

/** Side-on corridor framing — wide preset, dot horse, floating work cards. */
export function NextCorridorScene({
  zoomOutScrollsPage = false,
}: NextCorridorSceneProps) {
  const { horsePos, lookAt, cameraPos, fov } = CORRIDOR_PRESETS.wide;

  return (
    <group rotation={[0, HORSE_YAW, 0]}>
      <PerspectiveCamera
        makeDefault
        position={cameraPos}
        fov={fov}
        near={0.05}
        far={120}
      />
      <FloatingWorkCards />
      <group position={horsePos} renderOrder={2}>
        <NextPointCloudHorse scale={1.38} />
      </group>
      <OrbitControls
        key="next-corridor-orbit"
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
