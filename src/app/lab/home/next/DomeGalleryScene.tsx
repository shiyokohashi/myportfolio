"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

import { DomeEnvironment } from "@/app/lab/home/next/DomeEnvironment";
import { DomeGalleryProvider } from "@/app/lab/home/next/DomeGalleryProvider";
import { DomeHorse } from "@/app/lab/home/next/DomeHorse";
import { DomeProjectPanels } from "@/app/lab/home/next/DomeProjectPanels";
import { DomeOrbitDrag } from "@/app/lab/home/next/DomeOrbitDrag";
import { DomeTurnReveal } from "@/app/lab/home/next/DomeTurnReveal";
import { DomeViewSync } from "@/app/lab/home/next/DomeViewSync";
import { DOME_RADIUS, DOME_SCENE_FRAMING } from "@/app/lab/home/next/domeGalleryState";
import { HORSE_YAW } from "@/components/horseSceneConstants";

/** Keep orbit zoom inside the dome shell. */
const DOME_MIN_ORBIT = 8;
const DOME_MAX_ORBIT = 28;

/** Dark dome gallery — fixed side-on horse, free orbit to discover projects. */
export function DomeGalleryScene() {
  const { lookAt, cameraPos, fov } = DOME_SCENE_FRAMING;

  return (
    <DomeGalleryProvider>
      <fog attach="fog" args={["#030303", DOME_RADIUS * 0.45, DOME_RADIUS * 1.85]} />
      <DomeEnvironment />
      <DomeProjectPanels />
      <group rotation={[0, HORSE_YAW, 0]}>
        <PerspectiveCamera
          makeDefault
          position={cameraPos}
          fov={fov}
          near={0.05}
          far={DOME_RADIUS * 3}
        />
        <DomeHorse />
        <OrbitControls
          key="dome-gallery-orbit"
          makeDefault
          enableDamping
          dampingFactor={0.06}
          target={lookAt}
          minDistance={DOME_MIN_ORBIT}
          maxDistance={DOME_MAX_ORBIT}
          minPolarAngle={Math.PI / 2 - 0.35}
          maxPolarAngle={Math.PI / 2 + 0.24}
        />
        <DomeViewSync />
        <DomeOrbitDrag />
        <DomeTurnReveal />
      </group>
    </DomeGalleryProvider>
  );
}
