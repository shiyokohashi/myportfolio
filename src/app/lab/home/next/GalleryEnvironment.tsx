"use client";

import * as THREE from "three";

import { WALL_RADIUS } from "@/app/lab/home/next/galleryRunState";

/** Dark cylindrical interior — subtle floor and curved wall. */
export function GalleryEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[WALL_RADIUS + 2, 64]} />
        <meshStandardMaterial
          color="#111111"
          roughness={0.92}
          metalness={0.04}
          toneMapped={false}
        />
      </mesh>

      <mesh>
        <cylinderGeometry
          args={[WALL_RADIUS, WALL_RADIUS, 18, 72, 1, true]}
        />
        <meshStandardMaterial
          color="#141414"
          roughness={0.88}
          metalness={0.06}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 9, 0]}>
        <circleGeometry args={[WALL_RADIUS * 0.92, 48]} />
        <meshStandardMaterial
          color="#0b0b0b"
          roughness={1}
          metalness={0}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      <pointLight position={[0, 6, 0]} intensity={0.35} color="#ffffff" distance={48} />
      <pointLight position={[0, 2.5, 0]} intensity={0.18} color="#dbeafe" distance={36} />
    </group>
  );
}
