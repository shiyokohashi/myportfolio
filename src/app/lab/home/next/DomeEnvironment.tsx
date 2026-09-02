"use client";

import * as THREE from "three";

import { DOME_RADIUS } from "@/app/lab/home/next/domeGalleryState";

/** Inner dome shell — viewer is always inside this volume. */
export function DomeEnvironment() {
  return (
    <group>
      <mesh renderOrder={-2}>
        <sphereGeometry args={[DOME_RADIUS, 80, 56]} />
        <meshStandardMaterial
          color="#020202"
          roughness={1}
          metalness={0}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <ambientLight intensity={0.05} color="#e8e8ec" />
      <pointLight position={[0, 6, 0]} intensity={0.22} distance={DOME_RADIUS * 2} color="#ffffff" />
    </group>
  );
}
