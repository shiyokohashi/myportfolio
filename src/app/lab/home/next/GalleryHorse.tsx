"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { useGalleryRun } from "@/app/lab/home/next/GalleryRunProvider";
import { NextPointCloudHorse } from "@/app/lab/home/next/NextPointCloudHorse";

/** Positions and rotates the galloping horse from gallery run state. */
export function GalleryHorse() {
  const groupRef = useRef<THREE.Group>(null);
  const { horsePosRef, horseHeadingRef, horseTurnRef } = useGalleryRun();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    group.position.copy(horsePosRef.current!);

    const angle =
      horseHeadingRef.current!.current + horseTurnRef.current!.current;
    group.rotation.set(0, angle, 0);
  });

  return (
    <group ref={groupRef} renderOrder={2}>
      <NextPointCloudHorse scale={1.38} />
    </group>
  );
}
